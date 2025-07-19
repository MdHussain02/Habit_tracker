import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getUserData, saveUserData } from '../../utils/storage';

export default function PersonalDetailsScreen() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    height: '',
    weight: '',
    age: '',
    gender: '',
  });
  const [originalForm, setOriginalForm] = useState(form);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const user = await getUserData();
      if (user) {
        setForm(user);
        setOriginalForm(user);
      }
      setLoading(false);
    })();
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = async () => {
    try {
      await saveUserData(form);
      setOriginalForm(form);
      setIsEditing(false);
      Alert.alert('Success', 'Personal details updated!');
    } catch (e) {
      Alert.alert('Error', 'Could not save details');
    }
  };

  const handleCancel = () => {
    setForm(originalForm);
    setIsEditing(false);
  };

  if (loading) return null;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.title}>Personal Details</Text>
      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#aaa"
            value={form.name}
            onChangeText={v => handleChange('name', v)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={form.email}
            onChangeText={v => handleChange('email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Height (cm)"
              placeholderTextColor="#aaa"
              value={form.height}
              onChangeText={v => handleChange('height', v)}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Weight (kg)"
              placeholderTextColor="#aaa"
              value={form.weight}
              onChangeText={v => handleChange('weight', v)}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Age"
              placeholderTextColor="#aaa"
              value={form.age}
              onChangeText={v => handleChange('age', v)}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Gender"
              placeholderTextColor="#aaa"
              value={form.gender}
              onChangeText={v => handleChange('gender', v)}
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.detailsBox}>
          <DetailRow label="Name" value={form.name} />
          <DetailRow label="Email" value={form.email} />
          <DetailRow label="Height (cm)" value={form.height} />
          <DetailRow label="Weight (kg)" value={form.weight} />
          <DetailRow label="Age" value={form.age} />
          <DetailRow label="Gender" value={form.gender} />
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value || '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#23232b',
    color: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputHalf: {
    width: '48%',
    marginRight: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 320,
  },
  saveButton: {
    backgroundColor: '#7066F6',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 120,
    marginTop: 16,
    marginBottom: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#333',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 120,
    marginBottom: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  detailsBox: {
    backgroundColor: '#23232b',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '600',
  },
  detailValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
  },
  editButton: {
    backgroundColor: '#7066F6',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 120,
    marginTop: 16,
    alignSelf: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 