# Toast Implementation

This project now uses `react-native-toast-message` for displaying toast notifications. This provides a more robust and feature-rich toast system compared to the previous custom implementation.

## Installation

The library has been installed using yarn:
```bash
yarn add react-native-toast-message
```

## Usage

### Basic Usage

```typescript
import { useToast } from '../hooks/useToast';

const MyComponent = () => {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast('Operation completed successfully!', 'success');
  };

  const handleError = () => {
    showToast('Something went wrong!', 'error');
  };

  return (
    // Your component JSX
  );
};
```

### Available Toast Types

- `'success'` - Green toast for successful operations
- `'error'` - Red toast for error messages
- `'info'` - Blue toast for informational messages
- `'warning'` - Orange toast for warning messages

### Configuration

The toast is configured with the following default settings:
- Position: Bottom of screen
- Visibility time: 3 seconds
- Auto-hide: Enabled
- Top offset: 30px
- Bottom offset: 40px

### Setup

The `ToastProvider` is already set up in `app/_layout.tsx` and wraps the entire application. No additional setup is required.

## Migration from Custom Implementation

The new implementation is fully backward compatible. All existing `showToast` calls will continue to work without any changes. The function signature remains the same:

```typescript
showToast(message: string, type?: 'success' | 'error' | 'info' | 'warning')
```

## Benefits of react-native-toast-message

1. **Better Performance**: Optimized animations and rendering
2. **More Features**: Support for multiple toast types, custom styling, and advanced configurations
3. **Better Accessibility**: Built-in accessibility features
4. **Cross-platform**: Consistent behavior across iOS and Android
5. **Active Maintenance**: Regularly updated and maintained
6. **Customizable**: Easy to customize appearance and behavior

## Customization

If you need to customize the toast appearance, you can modify the configuration in the `useToast` hook:

```typescript
Toast.show({
  type: type,
  text1: message,
  position: 'bottom',
  visibilityTime: 3000, // 3 seconds
  autoHide: true,
  topOffset: 30,
  bottomOffset: 40,
  // Add custom styling here
});
```

## Example

See `examples/toast-usage.tsx` for a complete example of how to use all toast types. 