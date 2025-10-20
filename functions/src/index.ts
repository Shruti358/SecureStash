import * as admin from 'firebase-admin';
import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import { Request, Response } from 'express';
import { setGlobalOptions } from 'firebase-functions/v2';

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();
setGlobalOptions({ region: 'us-central1' });

// Data model references (normalized)
// - Firestore collections:
//   users/{uid}
//   folders/{folder_id}
//   files/{file_id}
//   fileTypes/{file_type_id}
//   acls/{acl_id}

// Helper: assert auth
function assertAuthed(auth: { uid: string } | undefined) {
  if (!auth) {
    throw new HttpsError('unauthenticated', 'Authentication required.');
  }
}

export const createFileMetadata = onCall(async (request) => {
  assertAuthed(request.auth);
  const uid = request.auth!.uid;
  const { name, size, contentType, folderId, fileTypeId } = request.data as {
    name: string; size: number; contentType: string; folderId?: string | null; fileTypeId?: number | null;
  };
  if (!name || !contentType || typeof size !== 'number') {
    throw new HttpsError('invalid-argument', 'name, size, contentType required');
  }
  const fileId = db.collection('files').doc().id;
  const storagePath = `files/${uid}/${fileId}/${name}`;
  const now = admin.firestore.FieldValue.serverTimestamp();
  await db.collection('files').doc(fileId).set({
    file_id: fileId,
    folder_id: folderId || null,
    name,
    file_type_id: fileTypeId || null,
    size,
    storage_path: storagePath,
    owner_id: uid,
    created_at: now,
    updated_at: now,
  });
  return { id: fileId, path: storagePath };
});

export const starFile = onCall(async (request) => {
  assertAuthed(request.auth);
  const uid = request.auth!.uid;
  const { fileId, value } = request.data as { fileId: string; value: boolean };
  if (!fileId || typeof value !== 'boolean') {
    throw new HttpsError('invalid-argument', 'fileId and value required');
  }
  const fileRef = db.collection('files').doc(fileId);
  const fileSnap = await fileRef.get();
  if (!fileSnap.exists) throw new HttpsError('not-found', 'File not found');
  await fileRef.update({ starred_by: value ? admin.firestore.FieldValue.arrayUnion(uid) : admin.firestore.FieldValue.arrayRemove(uid) });
  return { ok: true };
});

export const deleteFile = onCall(async (request) => {
  assertAuthed(request.auth);
  const uid = request.auth!.uid;
  const { fileId } = request.data as { fileId: string };
  if (!fileId) throw new HttpsError('invalid-argument', 'fileId required');
  const fileRef = db.collection('files').doc(fileId);
  const snap = await fileRef.get();
  if (!snap.exists) throw new HttpsError('not-found', 'File not found');
  const dataDel = snap.data() as { storage_path: string; owner_id: string };
  const owner_id = dataDel.owner_id;
  if (owner_id !== uid) throw new HttpsError('permission-denied', 'Not owner');
  // Delete storage object
  await storage.bucket().file(dataDel.storage_path).delete({ ignoreNotFound: true });
  // Delete metadata and any star
  await fileRef.delete();
  return { ok: true };
});

export const createShare = onCall(async (request) => {
  assertAuthed(request.auth);
  const uid = request.auth!.uid;
  const { fileId, recipients } = request.data as { fileId: string; recipients: string[] };
  if (!fileId || !Array.isArray(recipients)) {
    throw new HttpsError('invalid-argument', 'fileId and recipients required');
  }
  const fileRef = db.collection('files').doc(fileId);
  const snap = await fileRef.get();
  if (!snap.exists) throw new HttpsError('not-found', 'File not found');
  const { owner_id } = snap.data() as { storage_path: string; owner_id: string };
  if (owner_id !== uid) throw new HttpsError('permission-denied', 'Not owner');
  // Create ACL docs for each recipient (id: `${fileId}_${recipient}`)
  const batch = db.batch();
  const createdAt = admin.firestore.FieldValue.serverTimestamp();
  recipients.forEach((r) => {
    const aclId = `${fileId}_${r}`;
    const ref = db.collection('acls').doc(aclId);
    batch.set(ref, {
      acl_id: aclId,
      item_id: fileId,
      item_type: 'file',
      shared_with: r,
      permission: 'read',
      shared_by: uid,
      created_at: createdAt,
    });
  });
  await batch.commit();
  return { ok: true };
});

export const revokeShare = onCall(async (request) => {
  assertAuthed(request.auth);
  const uid = request.auth!.uid;
  const { shareId } = request.data as { shareId: string };
  if (!shareId) throw new HttpsError('invalid-argument', 'shareId required');
  // Allow owner to revoke specific ACL (shareId is acl_id)
  const aclRef = db.collection('acls').doc(shareId);
  const snap = await aclRef.get();
  if (!snap.exists) throw new HttpsError('not-found', 'ACL not found');
  const acl = snap.data() as { shared_by: string };
  if (acl.shared_by !== uid) throw new HttpsError('permission-denied', 'Not owner');
  await aclRef.delete();
  return { ok: true };
});

// HTTP endpoint: generate a signed download URL for a file the user owns
export const getDownloadUrl = onRequest(async (req: Request, res: Response) => {
  try {
    if (req.method !== 'GET') {
      res.status(405).send('Method Not Allowed');
      return;
    }
    // Firebase Authentication via ID token in Authorization: Bearer <token>
    const idToken = (req.headers.authorization || '').toString().replace('Bearer ', '');
    if (!idToken) {
      res.status(401).send('Missing bearer token');
      return;
    }
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;
    const { fileId } = req.query as { fileId?: string };
    if (!fileId) {
      res.status(400).send('fileId is required');
      return;
    }
    const fileRef = db.collection('files').doc(fileId);
    const snap = await fileRef.get();
    if (!snap.exists) { res.status(404).send('File not found'); return; }
    const data = snap.data() as { storage_path: string; contentType?: string; owner_id: string };
    const isOwner = data.owner_id === uid;
    if (!isOwner) {
      // Ensure ACL exists for this user
      const aclRef = db.collection('acls').doc(`${fileId}_${uid}`);
      const acl = await aclRef.get();
      if (!acl.exists) { res.status(403).send('Forbidden'); return; }
    }
    const path = data.storage_path;
    const [metadata] = await storage.bucket().file(path).getMetadata();
    const contentType = metadata.contentType || 'application/octet-stream';
    const [url] = await storage.bucket().file(path).getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType,
    });
    res.json({ url });
  } catch (err: any) {
    console.error('getDownloadUrl error', err);
    res.status(500).send('Internal error');
  }
});
