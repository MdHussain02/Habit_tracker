import colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

export type ButtonType = 'primary' | 'secondary' | 'outline' | 'link';
export type sizeType = 'small' | 'medium' | 'large';


interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  type?: ButtonType;
  size?: sizeType;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  spinnerColor?: string;
  testID?: string;
}

const MAIN_COLOR = colors.primary; // Use orange from palette
const PRESSED_COLOR = colors.primary; // Darker orange for pressed state
const DISABLED_COLOR = colors['bg-light'];
const TEXT_COLOR = colors['text-light']; // White text for better contrast

const getButtonStyle = (type: ButtonType, disabled: boolean): ViewStyle => {
  switch (type) {
    case 'secondary':
      return {
        backgroundColor: disabled ? DISABLED_COLOR : MAIN_COLOR,
        borderColor: MAIN_COLOR,
        borderWidth: 1,
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderColor: disabled ? DISABLED_COLOR : MAIN_COLOR,
        borderWidth: 2,
      };
    case 'primary':
    default:
      return {
        backgroundColor: disabled ? DISABLED_COLOR : MAIN_COLOR,
      };
    case 'link':
      return {
        backgroundColor: 'transparent',
        borderColor: disabled ? DISABLED_COLOR : MAIN_COLOR,
        borderWidth: 2,
        marginBottom: 18,
      };
  }
};

const getTextStyle = (type: ButtonType, disabled: boolean): TextStyle => {
  if (disabled) {
    return { color: '#FFFFFF', opacity: 0.7 }; // White with opacity for disabled state
  }
  return { color: '#FFFFFF' }; // White text for all button types
};

export default function Button({
  onPress,
  children,
  type = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  spinnerColor,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(type, isDisabled),
        style,
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={spinnerColor || TEXT_COLOR}
          style={{ marginRight: 8 }}
        />
      ) : null}
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text style={[getTextStyle(type, isDisabled), textStyle]}>{children}</Text>
      ) : (
        children
      )}
      {type === 'primary' && !loading && (
        <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginLeft: 8 }}>
          <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.7,
  },
}); 