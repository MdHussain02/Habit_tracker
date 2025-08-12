import { useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast, { BaseToast, ErrorToast, ToastPosition } from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextType {
  showToast: (message: string, type?: ToastType, position?: ToastPosition) => void;
}

const ToastIcon = ({ type }: { type: ToastType }) => {
  const iconProps = {
    size: 20,
    color: '#fff',
  };

  switch (type) {
    case 'success':
      return <Ionicons name="checkmark-circle" {...iconProps} />;
    case 'error':
      return <Ionicons name="close-circle" {...iconProps} />;
    case 'warning':
      return <Ionicons name="warning" {...iconProps} />;
    case 'info':
    default:
      return <Ionicons name="information-circle" {...iconProps} />;
  }
};

interface CustomToastProps {
  type: ToastType;
  text1: string;
  [key: string]: any;
}

const CustomToast = ({ type, text1, ...rest }: CustomToastProps) => {
  const backgroundColor = {
    success: '#4CAF50',
    error: '#f44336',
    info: '#2196F3',
    warning: '#ff9800',
  }[type];

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        { backgroundColor },
      ]}
    >
      <View style={styles.iconContainer}>
        <ToastIcon type={type} />
      </View>
      <Text style={styles.message} numberOfLines={2}>
        {text1}
      </Text>
    </Animated.View>
  );
};

const toastConfig = {
  success: (props: any) => <CustomToast {...props} type="success" />,
  error: (props: any) => <CustomToast {...props} type="error" />,
  info: (props: any) => <CustomToast {...props} type="info" />,
  warning: (props: any) => <CustomToast {...props} type="warning" />,
};

export const useToast = () => {
  const showToast = useCallback((message: string, type: ToastType = 'success', position: ToastPosition = 'bottom') => {
    Toast.show({
      type,
      position,
      text1: message,
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
      bottomOffset: 40,
    });
  }, []);

  return { showToast };
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 48,
    maxWidth: '90%',
    alignSelf: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  message: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
});

// Export a provider that renders the Toast component with custom config
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toast config={toastConfig} />
    </>
  );
}; 