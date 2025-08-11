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

### Toast Positions

You can customize where the toast appears on the screen:

```typescript
// Default position (bottom)
showToast('Message', 'success');

// Top of screen
showToast('Message', 'success', 'top');

// Center of screen
showToast('Message', 'info', 'center');

// Bottom of screen (default)
showToast('Message', 'warning', 'bottom');
```

**Available Positions:**
- `'top'` - Appears at the top of the screen
- `'center'` - Appears in the center of the screen
- `'bottom'` - Appears at the bottom of the screen (default)

### Configuration

The toast is configured with the following default settings:
- Position: Bottom of screen
- Visibility time: 3 seconds
- Auto-hide: Enabled
- Top offset: 50px (for top position), 30px (for others)
- Bottom offset: 40px (for bottom position), 30px (for others)

### Custom Dark Theme Styling

The toasts are styled to match your app's dark theme with a compact design:

- **Background**: `#23232b` (dark gray matching your app's input fields)
- **Text**: `#fff` (white) for primary text, `#aaa` (light gray) for secondary text
- **Border Radius**: 12px (compact rounded corners)
- **Border Left**: 3px colored border indicating toast type
- **Shadows**: Subtle shadows with colors matching each toast type
- **Typography**: 14px font size for primary text, 12px for secondary text
- **Size**: Compact design with 40-60px height range
- **Padding**: 12px horizontal, 8px vertical for tight spacing

#### Color Scheme by Type:
- **Success**: Green (`#4CAF50`) border and shadow
- **Error**: Red (`#f44336`) border and shadow  
- **Info**: Blue (`#2196F3`) border and shadow
- **Warning**: Orange (`#ff9800`) border and shadow

### Setup

The `ToastProvider` is already set up in `app/_layout.tsx` and wraps the entire application. No additional setup is required.

## Migration from Custom Implementation

The new implementation is fully backward compatible. All existing `showToast` calls will continue to work without any changes. The function signature has been extended to support position:

```typescript
// Old signature (still works)
showToast(message: string, type?: 'success' | 'error' | 'info' | 'warning')

// New signature with position
showToast(message: string, type?: 'success' | 'error' | 'info' | 'warning', position?: 'top' | 'center' | 'bottom')
```

## Benefits of react-native-toast-message

1. **Better Performance**: Optimized animations and rendering
2. **More Features**: Support for multiple toast types, custom styling, and advanced configurations
3. **Better Accessibility**: Built-in accessibility features
4. **Cross-platform**: Consistent behavior across iOS and Android
5. **Active Maintenance**: Regularly updated and maintained
6. **Customizable**: Easy to customize appearance and behavior
7. **Dark Theme Ready**: Pre-configured to match your app's dark theme
8. **Flexible Positioning**: Multiple position options for different use cases
9. **Compact Design**: Small, unobtrusive toasts that don't block the UI

## Customization

The toast styling is defined in the `toastConfig` object in `hooks/useToast.tsx`. You can modify:

- Colors (background, text, borders)
- Typography (font size, weight)
- Spacing (padding, margins)
- Shadows and elevation
- Border radius and styling
- Position and offsets
- Size constraints (minHeight, maxHeight)

### Example Customization:

```typescript
const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: '#23232b', // Your app's dark background
        borderLeftColor: '#4CAF50', // Success color
        borderRadius: 12, // Compact border radius
        minHeight: 40, // Minimum height
        maxHeight: 60, // Maximum height
        // ... other styles
      }}
      text1Style={{
        color: '#fff', // White text
        fontSize: 14, // Compact font size
        fontWeight: '600',
      }}
    />
  ),
  // ... other toast types
};
```

### Position-Specific Offsets:

```typescript
// You can customize offsets for different positions
Toast.show({
  type: 'success',
  text1: 'Message',
  position: 'top',
  topOffset: 60, // Custom top offset
  bottomOffset: 30, // Custom bottom offset
});
```

## Example

See `examples/toast-usage.tsx` for a complete example of how to use all toast types and positions with the custom dark theme styling. 