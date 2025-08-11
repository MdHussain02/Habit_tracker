import { useCallback } from 'react';
import Toast, { BaseToast, ErrorToast, ToastPosition } from 'react-native-toast-message';

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning', position?: ToastPosition) => void;
}

// Custom toast configuration to match your app's dark theme
const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: '#23232b',
        borderLeftColor: '#4CAF50',
        borderRadius: 12,
        borderLeftWidth: 3,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
        minHeight: 40,
        maxHeight: 60,
      }}
      contentContainerStyle={{
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
      text1Style={{
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
      }}
      text2Style={{
        color: '#aaa',
        fontSize: 12,
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: '#23232b',
        borderLeftColor: '#f44336',
        borderRadius: 12,
        borderLeftWidth: 3,
        shadowColor: '#f44336',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
        minHeight: 40,
        maxHeight: 60,
      }}
      contentContainerStyle={{
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
      text1Style={{
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
      }}
      text2Style={{
        color: '#aaa',
        fontSize: 12,
      }}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: '#23232b',
        borderLeftColor: '#2196F3',
        borderRadius: 12,
        borderLeftWidth: 3,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
        minHeight: 40,
        maxHeight: 60,
      }}
      contentContainerStyle={{
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
      text1Style={{
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
      }}
      text2Style={{
        color: '#aaa',
        fontSize: 12,
      }}
    />
  ),
  warning: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: '#23232b',
        borderLeftColor: '#ff9800',
        borderRadius: 12,
        borderLeftWidth: 3,
        shadowColor: '#ff9800',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
        minHeight: 40,
        maxHeight: 60,
      }}
      contentContainerStyle={{
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
      text1Style={{
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
      }}
      text2Style={{
        color: '#aaa',
        fontSize: 12,
      }}
    />
  ),
};

export const useToast = () => {
  const showToast = useCallback((
    message: string, 
    type: 'success' | 'error' | 'info' | 'warning' = 'success',
    position: ToastPosition = 'bottom'
  ) => {
    Toast.show({
      type: type,
      text1: message,
      position: position,
      visibilityTime: 3000,
      autoHide: true,
      topOffset: position === 'top' ? 50 : 30,
      bottomOffset: position === 'bottom' ? 40 : 30,
    });
  }, []);

  return { showToast };
};

// Export a provider that renders the Toast component with custom config
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toast config={toastConfig} />
    </>
  );
}; 