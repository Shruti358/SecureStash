import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import TopNavbar from '../components/TopNavbar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props { navigation: any; }

type FaqItem = { q: string; a: string };

const FAQ: FaqItem[] = [
  { q: 'How do I upload files?', a: 'Go to Uploads from the left drawer, then choose Image, Video, Document, or Camera. Your files will appear in the list and on Home.' },
  { q: 'How can I share files with others?', a: 'Open the 3-dot menu on a file and choose Share. Enter the recipient email and set permissions (read or write).' },
  { q: 'How do I restore a file from Bin?', a: 'Open Bin from the drawer, tap Restore on the item to move it back to Home.' },
  { q: 'How do I permanently delete a file?', a: 'In Bin, tap Delete on an item. You will be asked to confirm before the permanent deletion.' },
  { q: 'How do I change my password?', a: 'Open Settings from the drawer, go to Change Password, re-enter your current password, and enter your new one.' },
  { q: 'How do I protect a file with a password?', a: 'Open a file\'s 3-dot menu and choose Protect with password. You\'ll set a password that will be required to open, preview, or copy the file link.' },
  { q: 'How does file password protection work?', a: 'Your file password is never stored in plain text. We derive a salted hash using PBKDF2 (SHA-256) on-device and only store the hash and salt with the file metadata. When you or a collaborator opens the file, we verify by hashing what they enter and comparing it to the stored hash.' },
  { q: 'Which actions require the file\'s password?', a: 'Opening a file, inline preview, and copying a link for a protected file all require entering the correct file password first.' },
  { q: 'I forgot a file\'s password. What can I do?', a: 'Passwords cannot be recovered, but the owner can change or remove the file password after re-authenticating their account. Open the 3-dot menu on the file and choose Change file password or Remove file password, then sign in again when prompted.' },
  { q: 'Do shared users also need the file password?', a: 'Yes. If a file is protected, anyone with access (including via sharing) must enter the correct file password to open or preview it.' },
  { q: 'Does password protection encrypt the actual file bytes?', a: 'No. Password protection gates access in the app by verifying a password-derived hash before generating access. The file bytes themselves are not end-to-end encrypted. Avoid sharing file passwords and remove protection when no longer needed.' },
  { q: 'Can I remove a file\'s password later?', a: 'Yes. Use Remove file password from the 3-dot menu. For your security, removing requires re-authenticating your account first.' },
];

export default function HelpFeedbackScreen({ navigation }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const sendFeedback = async () => {
    const subject = encodeURIComponent('SecureStash Feedback');
    const body = encodeURIComponent('Hi team,\n\nI would like to share the following feedback:\n\n- ');
  const url = `mailto:xamnxd@gmail.com?subject=${subject}&body=${body}`;
    const can = await Linking.canOpenURL(url);
    if (!can) {
      Alert.alert('Cannot open mail app', 'Please configure an email client and try again.');
      return;
    }
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <TopNavbar navigation={navigation} />
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Help & Feedback</Text>
          <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
            <Icon name="home-outline" size={18} color="#111827" />
            <Text style={styles.homeBtnText}>Home</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Find answers to common questions or send us feedback.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>FAQs</Text>
        {FAQ.map((item, idx) => (
          <View key={idx} style={styles.faqCard}>
            <TouchableOpacity style={styles.faqHeader} onPress={() => setOpenIndex(openIndex === idx ? null : idx)}>
              <Text style={styles.faqQ}>{item.q}</Text>
              <Icon name={openIndex === idx ? 'chevron-up' : 'chevron-down'} size={22} color="#6b7280" />
            </TouchableOpacity>
            {openIndex === idx && (
              <Text style={styles.faqA}>{item.a}</Text>
            )}
          </View>
        ))}

  <Text style={[styles.sectionTitle, styles.sectionTitleSpacing]}>Contact</Text>
        <TouchableOpacity style={styles.feedbackBtn} onPress={sendFeedback}>
          <Icon name="email-outline" size={18} color="#111827" />
          <Text style={styles.feedbackBtnText}>Send Feedback</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 8 },
  sectionTitleSpacing: { marginTop: 12 },
  faqCard: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ: { fontSize: 14, fontWeight: '600', color: '#111827', marginRight: 8 },
  faqA: { marginTop: 8, color: '#374151', fontSize: 13, lineHeight: 18 },
  feedbackBtn: { marginTop: 6, flexDirection: 'row', alignItems: 'center', backgroundColor: '#E5E7EB', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, alignSelf: 'flex-start' },
  feedbackBtnText: { marginLeft: 6, color: '#111827', fontWeight: '600' },
});
