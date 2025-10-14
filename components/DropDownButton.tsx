import colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ChoiceOption {
  value: string;
  label: string;
}

export const DropdownButton = ({
  value,
  options = [],
  placeholder,
  onPress,
  style,
  disabled = false,
  title
}: {
  value: string;
  options?: ChoiceOption[];
  placeholder: string;
  onPress: () => void;
  style?: any;
  disabled?: boolean;
  title ?:string;
}) => {
  // Find the selected option to display its label
  const selectedOption = options?.find((option) => option.value === value);
  const displayText = selectedOption
    ? selectedOption.label
    : value || placeholder;

  return (

    <View style={styles.container}> 
      {title && <Text style={styles.title}>{title}</Text>}  
    <TouchableOpacity
      style={[styles.dropdownButton, style, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[styles.dropdownButtonText, !value && styles.placeholderText]}
      >
        {disabled ? "Loading..." : displayText}
      </Text>
      <Ionicons name="chevron-down" size={20} color="#9ca3af" />
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Dropdown styles
    container: {
    // marginVertical: 8,
  },
    title: {
      fontSize: 15,
      fontWeight: "600",
      color: colors["text-secondary"],
      marginBottom: 6,
      marginLeft:8,
    },
  dropdownButton: {
    width: "100%",
    backgroundColor: colors["bg-light"],
    borderRadius: 16,
    padding: 16,
    marginBottom: 0,
    borderWidth: 1,
    minHeight: 60,
    borderColor: colors["border-light"],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButtonText: {
    color: colors["text-dark"],
    fontSize: 16,
    flex: 1,
  },
  placeholderText: {
    color: colors["text-secondary"],
  },
  dropdownArrow: {
    color: colors["text-dark"],
    fontSize: 14,
    marginLeft: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0.1,
  },
});
