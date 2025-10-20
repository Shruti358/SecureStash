import firestore from '@react-native-firebase/firestore';

export async function getUserUsageBytes(userId: string): Promise<number> {
  const snap = await firestore().collection('files').where('owner_id', '==', userId).get();
  let total = 0;
  snap.forEach((doc) => {
    const d: any = doc.data() || {};
    const size = typeof d.size === 'number' ? d.size : 0;
    total += size;
  });
  return total;
}

export function subscribeUserUsage(userId: string, onChange: (bytes: number) => void): () => void {
  const unsub = firestore()
    .collection('files')
    .where('owner_id', '==', userId)
    .onSnapshot((snap) => {
      let total = 0;
      snap.forEach((doc) => {
        const d: any = doc.data() || {};
        const size = typeof d.size === 'number' ? d.size : 0;
        total += size;
      });
      onChange(total);
    });
  return unsub;
}

export function bytesToGB(bytes: number): number {
  return bytes / (1024 * 1024 * 1024);
}
