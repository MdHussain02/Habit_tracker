import { useCallback } from 'react';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

// Custom toast configuration to match your app's dark theme
const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: '#23232b',
        borderLeftColor: '#4CAF50',
        borderRadius: 16,
        borderLeftWidth: 4,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingVertical: 12,
      }}
      text1Style={{
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
      }}
      text2Style={{
        color: '#aaa',
        fontSize: 14,
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: '#23232b',
        borderLeftColor: '#f44336',
        borderRadius: 16,
        borderLeftWidth: 4,
        shadowColor: '#f44336',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingVertical: 12,
      }}
      text1Style={{
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
      }}
      text2Style={{
        color: '#aaa',
        fontSize: 14,
      }}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: '#23232b',
        borderLeftColor: '#2196F3',
        borderRadius: 16,
        borderLeftWidth: 4,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingVertical: 12,
      }}
      text1Style={{
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
      }}
      text2Style={{
        color: '#aaa',
        fontSize: 14,
      }}
    />
  ),
  warning: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: '#23232b',
        borderLeftColor: '#ff9800',
        borderRadius: 16,
        borderLeftWidth: 4,
        shadowColor: '#ff9800',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingVertical: 12,
      }}
      text1Style={{
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
      }}
      text2Style={{
        color: '#aaa',
        fontSize: 14,
      }}
    />
  ),
};

export const useToast = () => {
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    Toast.show({
      type: type,
      text1: message,
      position: 'bottom',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
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