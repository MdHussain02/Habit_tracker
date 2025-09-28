import colors from '@/constants/Colors';
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  LayoutAnimation,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';
import { getUserData, saveUserData } from '../../utils/storage';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

interface AccordionSection {
  id: string;
  title: string;
  icon: string;
  iconFamily: 'AntDesign' | 'MaterialCommunityIcons' | 'Feather' | 'Ionicons';
  iconColor: string;
  iconBgColor: string;
  fields: {
    key: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'dropdown' | 'number';
    placeholder?: string;
    options?: string[];
  }[];
}

const accordionSections: AccordionSection[] = [
  {
    id: 'basic',
    title: 'Basic Information',
    icon: 'user',
    iconFamily: 'Feather',
    iconColor: colors.primary,
    iconBgColor: `${colors.primary}15`,
    fields: [
      {
        key: 'name',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Enter your full name'
      },
      {
        key: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'Enter your email address'
      },
      {
        key: 'phone',
        label: 'Phone Number',
        type: 'text',
        placeholder: 'Enter your phone number'
      }
    ]
  },
];

interface ModernDropdownProps {
  value: string;
  placeholder: string;
  options: string[];
  onSelect: (value: string) => void;
  title: string;
  disabled?: boolean;
}

const ModernDropdown: React.FC<ModernDropdownProps> = ({ 
  value, 
  placeholder, 
  options, 
  onSelect, 
  title,
  disabled = false 
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.modernDropdown, disabled && styles.disabledField]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <Text style={[styles.modernDropdownText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <AntDesign 
          name="down" 
          size={14} 
          color={disabled ? colors["text-secondary"] : colors["text-dark"]} 
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modernModalOverlay}>
          <View style={styles.modernModalContent}>
            <View style={styles.modernModalHeader}>
              <Text style={styles.modernModalTitle}>{title}</Text>
              <TouchableOpacity
                style={styles.modernModalClose}
                onPress={() => setModalVisible(false)}
              >
                <AntDesign name="close" size={20} color={colors["text-secondary"]} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modernOptionsList} showsVerticalScrollIndicator={false}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.modernOptionItem,
                    index === options.length - 1 && styles.lastOptionItem,
                    value === option && styles.selectedOptionItem
                  ]}
                  onPress={() => {
                    onSelect(option);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.modernOptionText,
                    value === option && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                  {value === option && (
                    <AntDesign name="check" size={16} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

interface AccordionItemProps {
  section: AccordionSection;
  isExpanded: boolean;
  onToggle: () => void;
  form: any;
  onChange: (key: string, value: string) => void;
  isEditing: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  section,
  isExpanded,
  onToggle,
  form,
  onChange,
  isEditing
}) => {
  const IconComponent = section.iconFamily === 'AntDesign' ? AntDesign :
                      section.iconFamily === 'MaterialCommunityIcons' ? MaterialCommunityIcons :
                      section.iconFamily === 'Feather' ? Feather : Ionicons;

  const renderField = (field: any) => {
    const commonStyle = [styles.modernInput, !isEditing && styles.disabledField];
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <View key={field.key} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{field.label}</Text>
            <TextInput
              style={commonStyle}
              placeholder={field.placeholder}
              placeholderTextColor={colors["text-secondary"]}
              value={form[field.key] || ''}
              onChangeText={v => onChange(field.key, v)}
              editable={isEditing}
              keyboardType={field.type === 'email' ? 'email-address' : field.type === 'number' ? 'numeric' : 'default'}
              autoCapitalize={field.type === 'email' ? 'none' : 'words'}
            />
          </View>
        );
      
      case 'password':
        return (
          <View key={field.key} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{field.label}</Text>
            <TextInput
              style={commonStyle}
              placeholder={field.placeholder}
              placeholderTextColor={colors["text-secondary"]}
              value={form[field.key] || ''}
              onChangeText={v => onChange(field.key, v)}
              secureTextEntry
              editable={isEditing}
            />
          </View>
        );
      
      case 'dropdown':
        return (
          <View key={field.key} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{field.label}</Text>
            <ModernDropdown
              value={form[field.key] || ''}
              placeholder={field.placeholder || 'Select an option'}
              options={field.options || []}
              onSelect={value => onChange(field.key, value)}
              title={field.label}
              disabled={!isEditing}
            />
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.accordionHeaderContent}>
          <View style={[styles.sectionIcon, { backgroundColor: section.iconBgColor }]}>
            <IconComponent name={section.icon as any} size={20} color={section.iconColor} />
          </View>
          <Text style={styles.accordionTitle}>{section.title}</Text>
        </View>
        
        <View style={styles.accordionChevron}>
          <AntDesign 
            name={isExpanded ? 'up' : 'down'} 
            size={16} 
            color={colors["text-secondary"]} 
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.accordionContent}>
          <View style={styles.fieldsContainer}>
            {section.fields.map(renderField)}
          </View>
        </View>
      )}
    </View>
  );
};

export default function PersonalDetailsScreen() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    gender: '',
    birthDate: '',
    location: '',
    occupation: '',
    language: '',
    theme: '',
    notifications: ''
  });
  
  const [originalForm, setOriginalForm] = useState(form);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']));
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const user = await getUserData();
      if (user) {
        const updatedForm = { ...form, ...user };
        setForm(updatedForm);
        setOriginalForm(updatedForm);
      }
      setLoading(false);
    })();
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleSave = async () => {
    try {
      // Validate passwords if changing
      if (form.newPassword && form.newPassword !== form.confirmPassword) {
        Alert.alert('Error', 'New passwords do not match');
        return;
      }

      await saveUserData(form);
      setOriginalForm(form);
      setIsEditing(false);
      
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      Alert.alert('Success', 'Your details have been updated successfully!');
    } catch (e) {
      Alert.alert('Error', 'Could not save your details. Please try again.');
    }
  };

  const handleCancel = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setForm(originalForm);
    setIsEditing(false);
  };

  const hasChanges = () => {
    return JSON.stringify(form) !== JSON.stringify(originalForm);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading your details...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors["text-light"]} />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Personal Details</Text>
            <Text style={styles.headerSubtitle}>Manage your profile information</Text>
          </View>

          {hasChanges() && !isEditing && (
            <View style={styles.changeIndicator}>
              <MaterialCommunityIcons name="circle" size={8} color={colors.primary} />
            </View>
          )}
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Accordion Sections */}
        {accordionSections.map((section) => (
          <AccordionItem
            key={section.id}
            section={section}
            isExpanded={expandedSections.has(section.id)}
            onToggle={() => toggleSection(section.id)}
            form={form}
            onChange={handleChange}
            isEditing={isEditing}
          />
        ))}

        {/* Global Action Buttons */}
        <View style={styles.globalActions}>
          {isEditing ? (
            <View style={styles.editingActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelButton]} 
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.saveButton]} 
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save All Changes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]} 
              onPress={() => setIsEditing(true)}
            >
              <Feather name="edit-2" size={16} color={colors.primary} />
              <Text style={styles.editButtonText}>Edit Details</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors["text-secondary"],
    fontWeight: '500',
  },
   header: {
    backgroundColor: colors.primary,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${colors["text-light"]}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors["text-light"],
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors["text-light"],
    fontWeight: '500',
    opacity: 0.9,
  },
  changeIndicator: {
    position: 'absolute',
    right: 0,
    top: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  // Accordion Styles
  accordionItem: {
    backgroundColor: colors["bg-accent"],
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingVertical: 16,
  },
  accordionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors["text-dark"],
  },
  accordionChevron: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accordionContent: {
    padding: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors["border-light"],
  },
  fieldsContainer: {
    gap: 16,
  },
  // Input Styles
  inputGroup: {
    marginBottom: 0,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors["text-dark"],
    marginBottom: 8,
  },
  modernInput: {
    backgroundColor: colors["bg-light"],
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors["text-dark"],
    borderWidth: 1,
    borderColor: colors["border-light"],
  },
  disabledField: {
    backgroundColor: colors["bg-light"],
    opacity: 0.6,
  },
  // Modern Dropdown Styles
  modernDropdown: {
    backgroundColor: colors["bg-light"],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors["border-light"],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modernDropdownText: {
    fontSize: 15,
    color: colors["text-dark"],
    flex: 1,
  },
  placeholderText: {
    color: colors["text-secondary"],
  },
  modernModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modernModalContent: {
    backgroundColor: colors["text-light"],
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modernModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors["border-light"],
  },
  modernModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors["text-dark"],
  },
  modernModalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors["bg-light"],
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernOptionsList: {
    maxHeight: 300,
  },
  modernOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors["border-light"],
  },
  lastOptionItem: {
    borderBottomWidth: 0,
  },
  selectedOptionItem: {
    backgroundColor: `${colors.primary}10`,
  },
  modernOptionText: {
    fontSize: 15,
    color: colors["text-dark"],
    flex: 1,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  // Global Action Styles
  globalActions: {
    marginTop: 20,
    padding: 20,
    backgroundColor: colors["bg-accent"],
    borderRadius: 16,
  },
  editingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
  },
  editButton: {
    backgroundColor: `${colors.primary}15`,
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: colors["text-light"],
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: colors["bg-light"],
    borderWidth: 1,
    borderColor: colors["border-light"],
  },
  cancelButtonText: {
    color: colors["text-secondary"],
    fontWeight: '600',
    fontSize: 14,
  },
});