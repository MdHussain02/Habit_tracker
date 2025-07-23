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
    onSelect: (value: string) => void; 
    title: string;
  }) => (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
              >
                <Text style={styles.dropdownItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            style={styles.dropdownList}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#18181b',
    },
    scrollContainer: {
      flexGrow: 1,
      padding: 24,
      paddingTop: 40,
      backgroundColor: '#18181b',
    },
    progressContainer: {
      marginBottom: 32,
    },
    progressBar: {
      height: 8,
      backgroundColor: '#333',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#7066F6',
      borderRadius: 4,
    },
    progressText: {
      color: '#aaa',
      fontSize: 14,
      textAlign: 'center',
    },
    stepContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 32,
      paddingHorizontal: 20,
    },
    stepItem: {
      alignItems: 'center',
      flex: 1,
    },
    stepCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#333',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    stepCircleActive: {
      backgroundColor: '#7066F6',
    },
    stepNumber: {
      color: '#666',
      fontSize: 16,
      fontWeight: 'bold',
    },
    stepNumberActive: {
      color: '#fff',
    },
    stepLabel: {
      color: '#666',
      fontSize: 12,
      textAlign: 'center',
      fontWeight: '500',
    },
    stepLabelActive: {
      color: '#fff',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 24,
      textAlign: 'center',
    },
    formSection: {
      width: '100%',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#fff',
      marginBottom: 16,
      textAlign: 'center',
    },
    input: {
      width: '100%',
      backgroundColor: '#23232b',
      color: '#fff',
      borderRadius: 16,
      padding: 18,
      marginBottom: 16,
      fontSize: 16,
      borderWidth: 1,
      borderColor: '#333',
    },
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    halfInput: {
      flex: 1,
    },
    errorText: {
      color: '#ff6b6b',
      fontSize: 14,
      marginBottom: 16,
      textAlign: 'center',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 24,
      gap: 16,
    },
    button: {
      backgroundColor: '#7066F6',
      borderRadius: 20,
      paddingVertical: 16,
      paddingHorizontal: 40,
      alignItems: 'center',
      minWidth: 140,
      shadowColor: '#7066F6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    backButton: {
      backgroundColor: '#333',
      shadowColor: '#333',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center',
    },
    buttonDisabled: {
      opacity: 0.5,
      shadowOpacity: 0.1,
    },
    // Dropdown styles
    dropdownButton: {
      width: '100%',
      backgroundColor: '#23232b',
      borderRadius: 16,
      padding: 18,
      marginBottom: 10,
      marginTop: 10,
      borderWidth: 1,
      minHeight: 50,
      borderColor: '#333',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dropdownButtonText: {
      color: '#fff',
      fontSize: 16,
      flex: 1,
    },
    placeholderText: {
      color: '#aaa',
    },
    dropdownArrow: {
      color: '#666',
      fontSize: 12,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#23232b',
      borderRadius: 20,
      padding: 24,
      width: '90%',
      maxHeight: '70%',
      borderWidth: 1,
      borderColor: '#333',
    },
    modalTitle: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
    },
    dropdownList: {
      maxHeight: 300,
    },
    dropdownItem: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#333',
    },
    dropdownItemText: {
      color: '#fff',
      fontSize: 16,
    },
    backNavBtn: {
      alignSelf: 'flex-start',
      marginBottom: 12,
      marginTop: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: '#23232b',
    },
    backNavBtnText: {
      color: '#7066F6',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });