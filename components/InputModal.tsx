import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

type InputModalProps = {
  visible: boolean;
  title: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  initialValue?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
};

const InputModal: React.FC<InputModalProps> = ({ visible, title, placeholder, secureTextEntry, initialValue, confirmText = 'OK', cancelText = 'Cancel', onConfirm, onCancel }) => {
  const [value, setValue] = useState(initialValue || '');
  useEffect(() => { if (visible) setValue(initialValue || ''); }, [visible, initialValue]);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={setValue}
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
          />
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={onCancel}><Text style={styles.btnGhostText}>{cancelText}</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => onConfirm(value)}><Text style={styles.btnPrimaryText}>{confirmText}</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  card: { width: '86%', backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  title: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, color: '#111827' },
  row: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 10 },
  btn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  btnGhost: { backgroundColor: '#F3F4F6' },
  btnGhostText: { color: '#111827', fontWeight: '600' },
  btnPrimary: { backgroundColor: '#22c55e' },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },
});

export default InputModal;
