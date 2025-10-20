import firestore from '@react-native-firebase/firestore';

export type SharePermission = 'read' | 'write';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

// Path helpers
const fileDoc = (fileId: string) => firestore().collection('files').doc(fileId);
const sharesCol = (fileId: string) => fileDoc(fileId).collection('shares');

export async function shareFileByEmail(fileId: string, ownerUid: string, email: string, permission: SharePermission, ownerEmail?: string) {
  const em = normalizeEmail(email);
  const ref = sharesCol(fileId).doc(em);
  await ref.set({
    email: em,
    permission,
    owner_id: ownerUid,
    owner_email: ownerEmail ? normalizeEmail(ownerEmail) : undefined,
    created_at: firestore.FieldValue.serverTimestamp(),
    updated_at: firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
}

export async function updateSharePermission(fileId: string, email: string, permission: SharePermission) {
  const em = normalizeEmail(email);
  await sharesCol(fileId).doc(em).update({ permission, updated_at: firestore.FieldValue.serverTimestamp() });
}

export async function revokeShare(fileId: string, email: string) {
  const em = normalizeEmail(email);
  await sharesCol(fileId).doc(em).delete();
}

export type SharedFileRecord = {
  id: string;
  name: string;
  path: string;
  kind?: 'image'|'video'|'document';
  contentType?: string;
  size?: number;
  owner_id?: string;
  ownerEmail?: string;
  permission: SharePermission;
};

// Subscribe to all files shared with a specific email address.
// Uses collectionGroup on `shares`. For each share doc we fetch its parent `files/{id}` document.
export function subscribeSharedWithMe(email: string, onChange: (rows: SharedFileRecord[]) => void, onError?: (e:any) => void) {
  const em = normalizeEmail(email);
  const sub = firestore()
    .collectionGroup('shares')
    .where('email', '==', em)
    .onSnapshot(async (snap) => {
      try {
        const tasks = snap.docs.map(async (shareDoc) => {
          const permission: SharePermission = (shareDoc.data()?.permission as SharePermission) || 'read';
          const ownerEmail: string | undefined = (shareDoc.data()?.owner_email as string | undefined) || undefined;
          const fileRef = shareDoc.ref.parent.parent; // files/{fileId}
          if (!fileRef) return null;
          const fileSnap = await fileRef.get();
          if (!fileSnap.exists) return null;
          const d: any = fileSnap.data() || {};
          return {
            id: fileSnap.id,
            name: d.name || 'Untitled',
            path: d.path,
            kind: d.kind,
            contentType: d.contentType,
            size: d.size,
            owner_id: d.owner_id,
            ownerEmail,
            permission,
          } as SharedFileRecord;
        });
        const rows = (await Promise.all(tasks)).filter(Boolean) as SharedFileRecord[];
        onChange(rows);
      } catch (e) {
        onError && onError(e);
      }
    }, (err) => onError && onError(err));
  return sub;
}

export function subscribeSharesForFile(fileId: string, onChange: (rows: {email: string; permission: SharePermission}[]) => void, onError?: (e:any)=>void) {
  const sub = sharesCol(fileId).onSnapshot((snap) => {
    const rows: {email: string; permission: SharePermission}[] = [];
    snap.forEach((doc) => {
      const d: any = doc.data() || {};
      rows.push({ email: d.email || doc.id, permission: (d.permission as SharePermission) || 'read' });
    });
    onChange(rows);
  }, (err) => onError && onError(err));
  return sub;
}

/*
  NOTE: Firestore Security Rules (pseudo):
  - Allow file owner full access to files/{fileId} and subcollection shares.
  - Allow users to read files/{fileId} if a matching shares doc exists with their email.
  - Allow writes (e.g., metadata updates) only if shares permission == 'write'.

  match /databases/{db}/documents {
    function isOwner(file) {
      return request.auth != null && file.data.owner_id == request.auth.uid;
    }
    function isSharedWith(fileId) {
      return exists(/databases/$(db)/documents/files/$(fileId)/shares/$(request.auth.token.email));
    }
    function hasWrite(fileId) {
      return get(/databases/$(db)/documents/files/$(fileId)/shares/$(request.auth.token.email)).data.permission == 'write';
    }

    match /files/{fileId} {
      allow read: if isOwner(resource) || isSharedWith(fileId);
      allow update, delete: if isOwner(resource) || hasWrite(fileId);
      allow create: if request.auth != null; // created by owner via app

      match /shares/{email} {
        allow read, write: if isOwner(get(/databases/$(db)/documents/files/$(fileId)));
      }
    }
  }
*/
