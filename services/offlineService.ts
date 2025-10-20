import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFileUrl } from './fileService';
import { Platform } from 'react-native';

const KEY = 'securestash.offline.map.v1';

export type OfflineEntry = { localPath: string; ts: number; size?: number };
export type OfflineMap = Record<string, OfflineEntry>; // fileId -> entry

export async function loadOfflineMap(): Promise<OfflineMap> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function saveOfflineMap(map: OfflineMap): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(map));
}

export function getLocalPath(fileId: string, name: string): string {
  const base = Platform.OS === 'android' ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath;
  // Ensure folder name
  const dir = `${base}/SecureStash`;
  const safeName = name.replace(/[/\\:*?"<>|]/g, '_');
  return `${dir}/${fileId}-${safeName}`;
}

export async function makeAvailableOffline(fileId: string, name: string, remotePath: string, size?: number): Promise<string> {
  const localPath = getLocalPath(fileId, name);
  // Ensure directory exists
  const dir = localPath.substring(0, localPath.lastIndexOf('/'));
  await RNFS.mkdir(dir);
  const url = await getFileUrl(remotePath, 600);
  const res = await RNFS.downloadFile({ fromUrl: url, toFile: localPath }).promise;
  if (res.statusCode && res.statusCode >= 400) throw new Error(`Download failed (${res.statusCode})`);
  const map = await loadOfflineMap();
  map[fileId] = { localPath, ts: Date.now(), size };
  await saveOfflineMap(map);
  return localPath;
}

export async function removeOffline(fileId: string): Promise<void> {
  const map = await loadOfflineMap();
  const entry = map[fileId];
  if (entry) {
    try { if (await RNFS.exists(entry.localPath)) await RNFS.unlink(entry.localPath); } catch {}
    delete map[fileId];
    await saveOfflineMap(map);
  }
}

export async function isOffline(fileId: string): Promise<boolean> {
  const map = await loadOfflineMap();
  const entry = map[fileId];
  if (!entry) return false;
  try { return await RNFS.exists(entry.localPath); } catch { return false; }
}
