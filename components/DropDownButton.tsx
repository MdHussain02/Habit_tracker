import colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ChoiceOption {
  value: string;
  label: string;
}

export const DropdownButton = ({ 
  value, 
  options = [],
  placeholder, 
  onPress, 
  style,
  disabled = false
}: { 
  value: string; 
  options?: ChoiceOption[];
  placeholder: string; 
  onPress: () => void; 
  style?: any;
  disabled?: boolean;
}) => {
  // Find the selected option to display its label
  const selectedOption = options?.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : value || placeholder;
  
  return (
    <TouchableOpacity 
      style={[styles.dropdownButton, style, disabled && styles.buttonDisabled]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.dropdownButtonText, !value && styles.placeholderText]}>
        {disabled ? 'Loading...' : displayText}
      </Text>
      <Text style={styles.dropdownArrow}>▼</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Dropdown styles
  dropdownButton: {
    width: '100%',
    backgroundColor: colors['bg-light'],
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    minHeight: 60,
    borderColor: colors['border-light'],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    color: colors['text-dark'],
    fontSize: 16,
    flex: 1,
  },
  placeholderText: {
    color: colors['text-secondary'],
  },
  dropdownArrow: {
    color: colors['text-dark'],
    fontSize: 14,
    marginLeft: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0.1,
  },
});
