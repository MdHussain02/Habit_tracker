import colors from '@/constants/Colors';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ChoiceOption {
  value: string;
  label: string;
}

export const DropdownModal = ({ 
  visible, 
  onClose, 
  options, 
  onSelect, 
  title 
}: { 
  visible: boolean; 
  onClose: () => void; 
  options: ChoiceOption[]; 
  onSelect: (option: ChoiceOption) => void; 
  title: string;
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity 
        style={styles.modalOverlay} 
        onPress={onClose}
        activeOpacity={1}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={options || []}
            keyExtractor={(item) => item?.value || ''}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  console.log(`Selected option:`, item);
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.dropdownItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            style={styles.dropdownList}
            contentContainerStyle={styles.dropdownListContent}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Modal overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors['bg-light'],
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: colors['border-light'],
    shadowColor: colors['shadow'],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    color: colors['text-dark'],
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },

  // Dropdown list
  dropdownList: {
    maxHeight: 300,
    width: '100%',
  },
  dropdownListContent: {
    paddingVertical: 8,
  },
  dropdownItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors['border-light'],
  },
  dropdownItemText: {
    color: colors['text-dark'],
    fontSize: 16,
  },

  // Back nav button (if reused)
  backNavBtn: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors['bg-light'],
    borderWidth: 1,
    borderColor: colors['border-light'],
  },
  backNavBtnText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
