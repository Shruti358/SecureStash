import auth from '@react-native-firebase/auth';
import functions from '@react-native-firebase/functions';
import { FUNCTION_BASE_URL } from '../config/backend';

export async function callCallable<T = any>(name: string, data?: any): Promise<T> {
  try {
    const callable = functions().httpsCallable(name);
    const res = await callable(data);
    return res.data as T;
  } catch (e) {
    console.error('Callable error', name, e);
    throw e;
  }
}

export async function authedGet<T = any>(path: string, params?: Record<string, string>): Promise<T> {
  const user = auth().currentUser;
  if (!user) throw new Error('Not authenticated');
  const token = await user.getIdToken();
  const url = new URL(`${FUNCTION_BASE_URL}/${path}`);
  Object.entries(params || {}).forEach(([k, v]) => url.searchParams.append(k, v));
  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}
