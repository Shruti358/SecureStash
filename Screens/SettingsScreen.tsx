import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import TopNavbar from '../components/TopNavbar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';

interface Props { navigation: any; }

export default function SettingsScreen({ navigation }: Props) {
  const user = auth().currentUser;
  const email = user?.email || '';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingChange, setLoadingChange] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const reauthenticate = async (password: string) => {
    const u = auth().currentUser;
    if (!u || !u.email) throw new Error('Not authenticated');
    const credential = auth.EmailAuthProvider.credential(u.email, password);
    await u.reauthenticateWithCredential(credential);
  };

  const handleChangePassword = async () => {
    try {
      if (!newPassword || !confirmPassword || !currentPassword) {
        Alert.alert('Error', 'Please fill all fields.');
        return;
      }
      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'New password and confirmation do not match.');
        return;
      }
      if (newPassword.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters.');
        return;
      }
      setLoadingChange(true);
      await reauthenticate(currentPassword);
      await auth().currentUser?.updatePassword(newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Success', 'Password updated successfully.');
    } catch (e: any) {
      const msg = e?.message || String(e);
      Alert.alert('Failed to update password', msg);
    } finally {
      setLoadingChange(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      Alert.alert('Delete account', 'This will permanently delete your account. Continue?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            setLoadingDelete(true);
            if (!currentPassword) {
              Alert.alert('Reauthentication required', 'Enter your current password and try again.');
              return;
            }
            await reauthenticate(currentPassword);
            await auth().currentUser?.delete();
          } catch (err: any) {
            Alert.alert('Delete failed', err?.message || String(err));
          } finally {
            setLoadingDelete(false);
          }
        }}
      ]);
    } catch (e: any) {
      Alert.alert('Error', e?.message || String(e));
    }
  };

  return (
    <View style={styles.container}>
      <TopNavbar navigation={navigation} />
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Settings</Text>
          <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
            <Icon name="home-outline" size={18} color="#111827" />
            <Text style={styles.homeBtnText}>Home</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Account Settings</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>Change Password</Text>
        </View>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email}</Text>

        <Text style={styles.label}>Current password</Text>
        <TextInput
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Enter current password"
          placeholderTextColor="#6b7280"
          secureTextEntry
        />
        <Text style={styles.label}>New password</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password"
          placeholderTextColor="#6b7280"
          secureTextEntry
        />
        <Text style={styles.label}>Confirm new password</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
          placeholderTextColor="#6b7280"
          secureTextEntry
        />
        <TouchableOpacity style={styles.primaryBtn} onPress={handleChangePassword} disabled={loadingChange}>
          {loadingChange ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.primaryBtnText}>Update Password</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Danger Zone</Text>
        <Text style={styles.helper}>Deleting your account is irreversible. You may need to re-enter your password to proceed.</Text>
        <TouchableOpacity style={styles.dangerBtn} onPress={handleDeleteAccount} disabled={loadingDelete}>
          {loadingDelete ? <ActivityIndicator size="small" color="#b91c1c" /> : (
            <>
              <Icon name="delete-alert-outline" size={18} color="#b91c1c" />
              <Text style={styles.dangerBtnText}>Delete Account</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { paddingHorizontal: 20, paddingTop: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 12 },
  homeBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E5E7EB', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14 },
  homeBtnText: { marginLeft: 6, color: '#111827', fontWeight: '600' },
  card: { backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 16, borderRadius: 12, padding: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 },
  label: { fontSize: 13, color: '#6b7280', marginTop: 8 },
  value: { fontSize: 14, color: '#111827', marginTop: 4 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginTop: 6, color: '#111827', backgroundColor: '#fff' },
  primaryBtn: { marginTop: 14, backgroundColor: '#16a34a', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  dangerBtn: { marginTop: 10, paddingVertical: 10, borderRadius: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#FEE2E2' },
  dangerBtnText: { marginLeft: 8, color: '#b91c1c', fontWeight: '700' },
  helper: { fontSize: 12, color: '#6b7280', marginTop: 6 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
