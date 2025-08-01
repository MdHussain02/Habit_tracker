import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useToast } from '../hooks/useToast';

export const ToastExample = () => {
  const { showToast } = useToast();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Toast Examples</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Toast Types</Text>
        
        <TouchableOpacity 
          style={[styles.button, styles.successButton]} 
          onPress={() => showToast('Success message!', 'success')}
        >
          <Text style={styles.buttonText}>Show Success Toast</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.errorButton]} 
          onPress={() => showToast('Error message!', 'error')}
        >
          <Text style={styles.buttonText}>Show Error Toast</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.infoButton]} 
          onPress={() => showToast('Info message!', 'info')}
        >
          <Text style={styles.buttonText}>Show Info Toast</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.warningButton]} 
          onPress={() => showToast('Warning message!', 'warning')}
        >
          <Text style={styles.buttonText}>Show Warning Toast</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Toast Positions</Text>
        
        <TouchableOpacity 
          style={[styles.button, styles.positionButton]} 
          onPress={() => showToast('Top position toast!', 'success', 'top')}
        >
          <Text style={styles.buttonText}>Top Position</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.positionButton]} 
          onPress={() => showToast('Center position toast!', 'info', 'center')}
        >
          <Text style={styles.buttonText}>Center Position</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.positionButton]} 
          onPress={() => showToast('Bottom position toast!', 'warning', 'bottom')}
        >
          <Text style={styles.buttonText}>Bottom Position</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#18181b',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  section: {
    width: '100%',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  errorButton: {
    backgroundColor: '#f44336',
  },
  infoButton: {
    backgroundColor: '#2196F3',
  },
  warningButton: {
    backgroundColor: '#ff9800',
  },
  positionButton: {
    backgroundColor: '#7066F6',
  },
}); 