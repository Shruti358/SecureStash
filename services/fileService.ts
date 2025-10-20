import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { STORAGE_BACKEND, SUPABASE_BUCKET } from '../config/storage';
import { supabase } from '../config/supabase';

export async function getFileUrl(path: string, expiresSeconds = 120): Promise<string> {
  if (STORAGE_BACKEND === 'supabase') {
    const { data, error } = await supabase.storage.from(SUPABASE_BUCKET).createSignedUrl(path, expiresSeconds);
    if (error || !data?.signedUrl) throw new Error(error?.message || 'Failed to create signed URL');
    return data.signedUrl;
  } else {
    const ref = storage().ref(path);
    return await ref.getDownloadURL();
  }
}

export async function deleteFile(fileId: string, path: string): Promise<void> {
  // delete from storage first
  if (STORAGE_BACKEND === 'supabase') {
    const { error } = await supabase.storage.from(SUPABASE_BUCKET).remove([path]);
    if (error) throw new Error(error.message);
  } else {
    await storage().ref(path).delete();
  }
  // then remove metadata
  await firestore().collection('files').doc(fileId).delete();
}

// Soft delete: move to bin by flagging the document
export async function moveToBin(fileId: string): Promise<void> {
  await firestore().collection('files').doc(fileId).set({
    trashed: true,
    trashed_at: firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
}

// Restore from bin
export async function restoreFromBin(fileId: string): Promise<void> {
  await firestore().collection('files').doc(fileId).set({
    trashed: false,
    trashed_at: null,
  }, { merge: true });
}

// Icon mapping for MaterialCommunityIcons
export function getFileIcon(name?: string, kind?: string, contentType?: string): { icon: string; color: string } {
  const lower = (name || '').toLowerCase();
  const ct = (contentType || '').toLowerCase();
  const from = (s: string) => lower.endsWith(s);

  if (kind === 'image' || ct.startsWith('image/') || from('.png') || from('.jpg') || from('.jpeg') || from('.gif') || from('.webp')) {
    return { icon: 'image', color: '#f43f5e' };
  }
  if (kind === 'video' || ct.startsWith('video/') || from('.mp4') || from('.mov') || from('.mkv') || from('.avi')) {
    return { icon: 'video', color: '#06b6d4' };
  }
  if (from('.pdf') || ct === 'application/pdf') {
    return { icon: 'file-pdf-box', color: '#ef4444' };
  }
  if (from('.doc') || from('.docx')) {
    return { icon: 'file-word-box', color: '#3b82f6' };
  }
  if (from('.xls') || from('.xlsx')) {
    return { icon: 'file-excel-box', color: '#22c55e' };
  }
  if (from('.ppt') || from('.pptx')) {
    return { icon: 'file-powerpoint-box', color: '#f97316' };
  }
  if (kind === 'document') {
    return { icon: 'file-document', color: '#6b7280' };
  }
  return { icon: 'file', color: '#6b7280' };
}
