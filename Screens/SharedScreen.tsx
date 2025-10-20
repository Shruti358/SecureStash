import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import TopNavbar from '../components/TopNavbar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../contexts/AuthContext';
import { shareFileByEmail, subscribeSharedWithMe, subscribeSharesForFile, updateSharePermission, revokeShare, SharePermission } from '../services/shareService';
import { getFileIcon, getFileUrl } from '../services/fileService';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SharedScreenProps { navigation: any; route?: any; }

const SharedScreen: React.FC<SharedScreenProps> = ({ navigation, route }) => {
  const { user } = useAuth();
  const fileId: string | undefined = route?.params?.fileId;
  const fileNameFromRoute: string | undefined = route?.params?.fileName;

  // Manage mode state (when fileId provided)
  const [inviteEmail, setInviteEmail] = useState('');
  const [permission, setPermission] = useState<SharePermission>('read');
  const [shares, setShares] = useState<{email: string; permission: SharePermission}[]>([]);
  const [emailQuery, setEmailQuery] = useState('');

  // Shared-with-me state
  const [allShared, setAllShared] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [emailSearch, setEmailSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    if (fileId) {
      // Manage shares for this file
      return subscribeSharesForFile(fileId, setShares, (e)=>console.warn('shares sub error', e));
    } else {
      // Show files shared with me
      return subscribeSharedWithMe(user.email || '', setAllShared, (e)=>console.warn('shared-with-me sub error', e));
    }
  }, [user, fileId]);

  // Persist and restore queries
  useEffect(() => {
    const load = async () => {
      try {
        const uid = user?.uid || 'anon';
        if (fileId) {
          const savedEmailQ = await AsyncStorage.getItem(`shared-manage-emailq:${uid}:${fileId}`);
          if (savedEmailQ) setEmailQuery(savedEmailQ);
        } else {
          const savedQ = await AsyncStorage.getItem(`shared-q:${uid}`);
          const savedEmail = await AsyncStorage.getItem(`shared-owner-email:${uid}`);
          if (savedQ) setQuery(savedQ);
          if (savedEmail) setEmailSearch(savedEmail);
        }
      } catch (e) {
        // ignore
      }
    };
    load();
  }, [user?.uid, fileId]);

  useEffect(() => {
    const uid = user?.uid || 'anon';
    if (fileId) {
      AsyncStorage.setItem(`shared-manage-emailq:${uid}:${fileId}`, emailQuery).catch(()=>{});
    }
  }, [emailQuery, user?.uid, fileId]);

  useEffect(() => {
    const uid = user?.uid || 'anon';
    if (!fileId) {
      AsyncStorage.setItem(`shared-q:${uid}`, query).catch(()=>{});
    }
  }, [query, user?.uid, fileId]);

  useEffect(() => {
    const uid = user?.uid || 'anon';
    if (!fileId) {
      AsyncStorage.setItem(`shared-owner-email:${uid}`, emailSearch).catch(()=>{});
    }
  }, [emailSearch, user?.uid, fileId]);

  const filteredShared = useMemo(() => {
    const q = query.trim().toLowerCase();
    const e = emailSearch.trim().toLowerCase();
    return allShared.filter((f) => {
      const nameOk = !q || (f.name || '').toLowerCase().includes(q);
      const emailOk = !e || (f.ownerEmail || '').toLowerCase().includes(e);
      return nameOk && emailOk;
    });
  }, [allShared, query, emailSearch]);

  const filteredSharesByEmail = useMemo(() => {
    if (!emailQuery.trim()) return shares;
    const q = emailQuery.trim().toLowerCase();
    return shares.filter(s => (s.email || '').toLowerCase().includes(q));
  }, [shares, emailQuery]);

  const onInvite = async () => {
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;
    try {
  await shareFileByEmail(fileId!, user?.uid || '', email, permission, user?.email || undefined);
      setInviteEmail('');
      Alert.alert('Shared', `Invited ${email} with ${permission} access`);
    } catch (e:any) {
      Alert.alert('Share failed', e?.message || String(e));
    }
  };

  if (fileId) {
    // Manage shares mode
    return (
      <View style={styles.container}>
        <TopNavbar navigation={navigation} />
        <View style={styles.header}> 
          <Text style={styles.title}>Share "{fileNameFromRoute || 'Selected file'}"</Text>
          <Text style={styles.subtitle}>Invite by email and set permission</Text>
        </View>
        <View style={styles.inviteRow}>
          <Icon name="email-outline" size={20} color="#6b7280" />
          <TextInput
            style={styles.inviteInput}
            placeholder="Enter email to share"
            placeholderTextColor="#9CA3AF"
            value={inviteEmail}
            autoCapitalize="none"
            onChangeText={setInviteEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.permissionsRow}>
          <TouchableOpacity style={[styles.permChip, permission==='read' && styles.permChipActive]} onPress={()=>setPermission('read')}>
            <Icon name="eye-outline" size={16} color={permission==='read'? '#fff' : '#374151'} />
            <Text style={[styles.permText, permission==='read' && styles.permTextActive]}>Read</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.permChip, permission==='write' && styles.permChipActive]} onPress={()=>setPermission('write')}>
            <Icon name="pencil-outline" size={16} color={permission==='write'? '#fff' : '#374151'} />
            <Text style={[styles.permText, permission==='write' && styles.permTextActive]}>Write</Text>
          </TouchableOpacity>
          <View style={styles.flexSpacer} />
          <TouchableOpacity style={styles.inviteBtn} onPress={onInvite}>
            <Text style={styles.inviteBtnText}>Invite</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>People with access</Text>
  <View style={[styles.searchBar, styles.searchBarTight]}> 
          <Icon name="magnify" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by email"
            placeholderTextColor="#9CA3AF"
            value={emailQuery}
            onChangeText={setEmailQuery}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {emailQuery.length > 0 && (
            <TouchableOpacity onPress={() => setEmailQuery('')} style={styles.clearBtn}>
              <Icon name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={filteredSharesByEmail}
          keyExtractor={(item) => item.email}
          ItemSeparatorComponent={ListSepLg}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.shareRow}>
              <Icon name="account-circle" size={24} color="#6b7280" />
              <Text style={styles.shareEmail} numberOfLines={1}>{item.email}</Text>
              <View style={styles.flexSpacer} />
              <TouchableOpacity style={styles.smallChip} onPress={()=>updateSharePermission(fileId!, item.email, item.permission==='read'?'write':'read')}>
                <Text style={styles.smallChipText}>{item.permission}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>revokeShare(fileId!, item.email)} style={styles.ml8}>
                <Icon name="close" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    );
  }

  // Shared with me mode
  return (
    <View style={styles.container}>
      <TopNavbar navigation={navigation} />
      <View style={styles.header}> 
        <Text style={styles.title}>Shared with me</Text>
        <Text style={styles.subtitle}>Files and folders shared with you will appear here</Text>
      </View>
      <View style={styles.searchBar}>
        <Icon name="magnify" size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search files"
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
            <Icon name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.searchBar}>
        <Icon name="email-outline" size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by owner email"
          placeholderTextColor="#9CA3AF"
          value={emailSearch}
          onChangeText={setEmailSearch}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {emailSearch.length > 0 && (
          <TouchableOpacity onPress={() => setEmailSearch('')} style={styles.clearBtn}>
            <Icon name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {filteredShared.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No shared files yet</Text>
          <Text style={styles.emptySubtext}>Files shared with you by others will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={filteredShared}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={ListSepSm}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <SharedRow item={item} />}
        />
      )}
    </View>
  );
};

function SharedRow({ item }: { item: any }) {
  const meta = getFileIcon(item.name, item.kind, item.contentType);
  return (
    <View style={styles.fileItem}>
      <Icon name={meta.icon} size={24} color={meta.color} />
      <Text style={styles.fileText} numberOfLines={1}>{item.name}</Text>
  <View style={styles.flexSpacer} />
      <View style={styles.permBadge}>
        <Icon name={item.permission==='write' ? 'pencil-outline' : 'eye-outline'} size={14} color="#2563eb" />
        <Text style={styles.permBadgeText}>{item.permission}</Text>
      </View>
      <TouchableOpacity onPress={async ()=>{ try { const url = await getFileUrl(item.path, 300); Linking.openURL(url); } catch (e:any) { Alert.alert('Open failed', e?.message || String(e)); } }}>
        <Icon name="open-in-new" size={20} color="#6b7280" style={styles.ml8} />
      </TouchableOpacity>
    </View>
  );
}

function ListSepLg() { return <View style={styles.sepLg} />; }
function ListSepSm() { return <View style={styles.sepSm} />; }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { paddingHorizontal: 20, paddingTop: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 12 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 20 },
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchBarTight: { marginTop: 0 },
  searchInput: { flex: 1, marginLeft: 8, color: '#374151' },
  clearBtn: { paddingLeft: 6, paddingVertical: 2 },
  fileItem: {
    flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#fff', borderRadius: 8,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  fileText: { marginLeft: 8, fontSize: 14, color: '#111827', maxWidth: '55%' },
  inviteRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8, marginHorizontal: 20,
  },
  inviteInput: { flex: 1, marginLeft: 8, color: '#111827' },
  permissionsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 10 },
  permChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E5E7EB', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6, marginRight: 8 },
  permChipActive: { backgroundColor: '#22c55e' },
  permText: { marginLeft: 6, color: '#374151', fontWeight: '600' },
  permTextActive: { color: '#fff' },
  inviteBtn: { backgroundColor: '#22c55e', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  inviteBtnText: { color: '#fff', fontWeight: '600' },
  sectionTitle: { marginTop: 16, marginBottom: 8, paddingHorizontal: 20, color: '#374151', fontWeight: '700' },
  shareRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 10, marginHorizontal: 20 },
  shareEmail: { marginLeft: 8, color: '#111827', maxWidth: '50%' },
  smallChip: { backgroundColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  smallChipText: { fontSize: 12, color: '#374151' },
  permBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DBEAFE', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  permBadgeText: { fontSize: 12, color: '#1d4ed8', marginLeft: 4 },
  listContent: { paddingHorizontal: 20, paddingBottom: 16 },
  sepLg: { height: 8 },
  sepSm: { height: 6 },
  flexSpacer: { flex: 1 },
  ml8: { marginLeft: 8 },
});

export default SharedScreen;