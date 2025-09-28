import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Type definitions for icon families
type IconFamily = 'AntDesign' | 'MaterialCommunityIcons' | 'Feather';

// Animation configuration options
export interface AccordionAnimationConfig {
  duration?: number;
  useLayoutAnimation?: boolean;
  animationType?: 'easeInEaseOut' | 'spring' | 'linear';
}

// Main accordion props interface
export interface AccordionProps {
  title: string;
  subtitle?: string;
  icon?: string;
  iconFamily?: IconFamily;
  iconColor?: string;
  iconBgColor?: string;
  children: React.ReactNode;
  isExpanded?: boolean;
  defaultExpanded?: boolean;
  onToggle?: (isExpanded: boolean) => void;
  animationConfig?: AccordionAnimationConfig;
  style?: any;
  headerStyle?: any;
  contentStyle?: any;
  disabled?: boolean;
  colors?: {
    primary?: string;
    textPrimary?: string;
    textSecondary?: string;
    background?: string;
    border?: string;
    shadow?: string;
  };
}

// Default colors (you can customize these)
const defaultColors = {
  primary: '#007AFF',
  textPrimary: '#1C1C1E',
  textSecondary: '#8E8E93',
  background: '#FFFFFF',
  border: '#E5E5EA',
  shadow: '#000000',
};

export const Accordion: React.FC<AccordionProps> = ({
  title,
  subtitle,
  icon,
  iconFamily = 'AntDesign',
  iconColor,
  iconBgColor,
  children,
  isExpanded: controlledExpanded,
  defaultExpanded = false,
  onToggle,
  animationConfig = {},
  style,
  headerStyle,
  contentStyle,
  disabled = false,
  colors = defaultColors,
}) => {
  // State for uncontrolled mode
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  
  // Animation values
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const animatedRotation = useRef(new Animated.Value(0)).current;

  // Determine if controlled or uncontrolled
  const isControlled = controlledExpanded !== undefined;
  const isExpanded = isControlled ? controlledExpanded : internalExpanded;

  // Merge colors with defaults
  const finalColors = { ...defaultColors, ...colors };

  // Get icon component
  const getIconComponent = () => {
    switch (iconFamily) {
      case 'MaterialCommunityIcons':
        return MaterialCommunityIcons;
      case 'Feather':
        return Feather;
      default:
        return AntDesign;
    }
  };

  // Animation configurations
  const getLayoutAnimationConfig = () => {
    const { animationType = 'easeInEaseOut' } = animationConfig;
    
    switch (animationType) {
      case 'spring':
        return LayoutAnimation.Presets.spring;
      case 'linear':
        return LayoutAnimation.Presets.linear;
      default:
        return LayoutAnimation.Presets.easeInEaseOut;
    }
  };

  // Toggle accordion
  const handleToggle = () => {
    if (disabled) return;

    const newExpanded = !isExpanded;
    const { duration = 300, useLayoutAnimation = true } = animationConfig;

    // Update state if uncontrolled
    if (!isControlled) {
      setInternalExpanded(newExpanded);
    }

    // Call onToggle callback
    onToggle?.(newExpanded);

    // Handle animations
    if (useLayoutAnimation) {
      LayoutAnimation.configureNext(getLayoutAnimationConfig());
    }

    // Animate height and opacity
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: newExpanded ? 1 : 0,
        duration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: newExpanded ? 1 : 0,
        duration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedRotation, {
        toValue: newExpanded ? 1 : 0,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Icon component
  const IconComponent = getIconComponent();

  // Animated rotation for chevron
  const chevronRotation = animatedRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={[styles.accordionContainer, { backgroundColor: finalColors.background }, style]}>
      {/* Header */}
      <TouchableOpacity
        style={[styles.accordionHeader, headerStyle]}
        onPress={handleToggle}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
      >
        <View style={styles.accordionLeft}>
          {/* Icon */}
          {icon && (
            <View style={[
              styles.accordionIcon,
              {
                backgroundColor: iconBgColor || `${finalColors.primary}20`,
              }
            ]}>
              <IconComponent
                name={icon as any}
                size={20}
                color={iconColor || finalColors.primary}
              />
            </View>
          )}
          
          {/* Text Content */}
          <View style={styles.accordionTextContainer}>
            <Text style={[styles.accordionTitle, { color: finalColors.textPrimary }]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.accordionSubtitle, { color: finalColors.textSecondary }]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {/* Chevron */}
        <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
          <AntDesign
            name="down"
            size={16}
            color={finalColors.textSecondary}
            style={[styles.chevron, disabled && { opacity: 0.5 }]}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Content */}
      {isExpanded && (
        <Animated.View
          style={[
            styles.accordionContent,
            {
              opacity: animatedOpacity,
              borderTopColor: finalColors.border,
            },
            contentStyle,
          ]}
        >
          {children}
        </Animated.View>
      )}
    </View>
  );
};

// Hook for managing multiple accordions
export const useAccordions = (initialState: { [key: string]: boolean } = {}) => {
  const [expandedAccordions, setExpandedAccordions] = useState(initialState);

  const toggleAccordion = (key: string) => {
    setExpandedAccordions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const setAccordionState = (key: string, isExpanded: boolean) => {
    setExpandedAccordions(prev => ({
      ...prev,
      [key]: isExpanded,
    }));
  };

  const expandAll = () => {
    setExpandedAccordions(prev => {
      const newState: { [key: string]: boolean } = {};
      Object.keys(prev).forEach(key => {
        newState[key] = true;
      });
      return newState;
    });
  };

  const collapseAll = () => {
    setExpandedAccordions(prev => {
      const newState: { [key: string]: boolean } = {};
      Object.keys(prev).forEach(key => {
        newState[key] = false;
      });
      return newState;
    });
  };

  return {
    expandedAccordions,
    toggleAccordion,
    setAccordionState,
    expandAll,
    collapseAll,
  };
};

// Accordion Group Component for managing multiple accordions
export interface AccordionGroupProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
  style?: any;
  spacing?: number;
}

export const AccordionGroup: React.FC<AccordionGroupProps> = ({
  children,
  allowMultiple = true,
  style,
  spacing = 16,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const handleChildToggle = (index: number, isExpanded: boolean) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      
      if (!allowMultiple && isExpanded) {
        // Collapse all others
        newSet.clear();
      }
      
      if (isExpanded) {
        newSet.add(index);
      } else {
        newSet.delete(index);
      }
      
      return newSet;
    });
  };

  // Clone children and add props
  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child) && child.type === Accordion) {
      return React.cloneElement(child as React.ReactElement<AccordionProps>, {
        isExpanded: expandedItems.has(index),
        onToggle: (isExpanded: boolean) => {
          handleChildToggle(index, isExpanded);
          (child as React.ReactElement<AccordionProps>).props.onToggle?.(isExpanded);
        },
        style: [
          (child as React.ReactElement<AccordionProps>).props.style,
          index > 0 && { marginTop: spacing },
        ],
      });
    }
    return child;
  });

  return (
    <View style={style}>
      {enhancedChildren}
    </View>
  );
};

const styles = StyleSheet.create({
  accordionContainer: {
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  accordionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accordionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accordionTextContainer: {
    flex: 1,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  accordionSubtitle: {
    fontSize: 13,
  },
  chevron: {
    marginLeft: 8,
  },
  accordionContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
  },
});