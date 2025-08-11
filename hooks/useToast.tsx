import { useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast, { BaseToast, ErrorToast, ToastPosition } from 'react-native-toast-message';

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning', position?: ToastPosition) => void;
}

const ToastIcon = ({ type }: { type: string }) => {
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

const CustomToast = ({ type, text1, ...rest }: any) => {
  const backgroundColor = {
    success: '#4CAF50',
    error: '#f44336',
    info: '#2196F3',
    warning: '#ff9800',
  }[type] || '#4CAF50';

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
  const showToast = useCallback((
    message: string, 
    type: 'success' | 'error' | 'info' | 'warning' = 'success',
    position: ToastPosition = 'top'
  ) => {
    Toast.show({
      type: type,
      text1: message,
      position: position,
      visibilityTime: 3000,
      autoHide: true,
      topOffset: position === 'top' ? 60 : 30,
      bottomOffset: position === 'bottom' ? 60 : 30,
      props: { type },
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