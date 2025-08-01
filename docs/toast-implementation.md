# Toast Implementation

This project now uses `react-native-toast-message` for displaying toast notifications with custom styling that matches the app's dark theme. This provides a more robust and feature-rich toast system compared to the previous custom implementation.

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

### Custom Dark Theme Styling

The toasts are styled to match your app's dark theme:

- **Background**: `#23232b` (dark gray matching your app's input fields)
- **Text**: `#fff` (white) for primary text, `#aaa` (light gray) for secondary text
- **Border Radius**: 16px (matching your app's rounded corners)
- **Border Left**: 4px colored border indicating toast type
- **Shadows**: Custom shadows with colors matching each toast type
- **Typography**: 16px font size with 600 weight for primary text

#### Color Scheme by Type:
- **Success**: Green (`#4CAF50`) border and shadow
- **Error**: Red (`#f44336`) border and shadow  
- **Info**: Blue (`#2196F3`) border and shadow
- **Warning**: Orange (`#ff9800`) border and shadow

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
7. **Dark Theme Ready**: Pre-configured to match your app's dark theme

## Customization

The toast styling is defined in the `toastConfig` object in `hooks/useToast.tsx`. You can modify:

- Colors (background, text, borders)
- Typography (font size, weight)
- Spacing (padding, margins)
- Shadows and elevation
- Border radius and styling

### Example Customization:

```typescript
const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: '#23232b', // Your app's dark background
        borderLeftColor: '#4CAF50', // Success color
        borderRadius: 16, // Match your app's border radius
        // ... other styles
      }}
      text1Style={{
        color: '#fff', // White text
        fontSize: 16,
        fontWeight: '600',
      }}
    />
  ),
  // ... other toast types
};
```

## Example

See `examples/toast-usage.tsx` for a complete example of how to use all toast types with the custom dark theme styling. 