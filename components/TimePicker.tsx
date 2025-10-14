// components/CustomDateTimePicker.tsx
import colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CustomDateTimePickerProps {
  value: string; // HH:MM format for time or YYYY-MM-DD for date
  onValueChange: (value: string) => void;
  mode: "time" | "date";
  title?: string;
  enabled?: boolean;
  placeHolderText?: string;
}

const { width } = Dimensions.get("window");

const parseTime = (
  timeString: string
): { hour: number; minute: number; period: string } => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return { hour: hour12, minute: minutes, period };
};

const parseDate = (
  dateString: string
): { year: number; month: number; day: number } => {
  const [year, month, day] = dateString.split("-").map(Number);
  return { year, month, day };
};

const formatTime = (hour: number, minute: number, period: string): string => {
  const hour24 =
    period === "PM" ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour;
  return `${hour24.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
};

const formatDate = (year: number, month: number, day: number): string => {
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
};

const formatDisplayTime = (timeString: string): string => {
  const { hour, minute, period } = parseTime(timeString);
  return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
};

const formatDisplayDate = (dateString: string): string => {
  const { year, month, day } = parseDate(dateString);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

const ScrollPicker = ({
  items,
  selectedIndex,
  onSelect,
  itemHeight = 50,
}: {
  items: (string | number)[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  itemHeight?: number;
}) => {
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: selectedIndex * itemHeight,
        animated: false,
      });
    }, 100);
  }, []);

  return (
    <View style={styles.scrollPickerContainer}>
      <View style={[styles.selectionIndicator, { height: itemHeight }]} />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.y / itemHeight
          );
          onSelect(index);
        }}
        contentContainerStyle={{ paddingVertical: itemHeight * 2 }}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.scrollItem, { height: itemHeight }]}
            onPress={() => {
              onSelect(index);
              scrollViewRef.current?.scrollTo({
                y: index * itemHeight,
                animated: true,
              });
            }}
          >
            <Text
              style={[
                styles.scrollItemText,
                selectedIndex === index && styles.scrollItemTextSelected,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default function CustomDateTimePicker({
  value,
  onValueChange,
  mode,
  title,
  enabled = true,
  placeHolderText,
}: CustomDateTimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  // Time state
  const initialTime =
    mode === "time"
      ? parseTime(value || "12:00")
      : { hour: 12, minute: 0, period: "AM" };
  const [selectedHour, setSelectedHour] = useState(initialTime.hour);
  const [selectedMinute, setSelectedMinute] = useState(initialTime.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(initialTime.period);

  // Date state
  const initialDate =
    mode === "date"
      ? parseDate(value || new Date().toISOString().split("T")[0])
      : { year: 2025, month: 1, day: 1 };
  const [selectedYear, setSelectedYear] = useState(initialDate.year);
  const [selectedMonth, setSelectedMonth] = useState(initialDate.month);
  const [selectedDay, setSelectedDay] = useState(initialDate.day);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ["AM", "PM"];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleConfirm = () => {
    if (mode === "time") {
      const timeString = formatTime(
        selectedHour,
        selectedMinute,
        selectedPeriod
      );
      onValueChange(timeString);
    } else {
      const dateString = formatDate(selectedYear, selectedMonth, selectedDay);
      onValueChange(dateString);
    }
    setShowPicker(false);
  };

  const handleCancel = () => {
    setShowPicker(false);
  };

  const displayValue =
    mode === "time"
      ? value
        ? formatDisplayTime(value)
        : null
      : value
      ? formatDisplayDate(value)
      : null;

  const iconName = mode === "time" ? "time-outline" : "calendar-outline";

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <TouchableOpacity
        style={[styles.button, !enabled && { opacity: 0.5 }]}
        onPress={() => enabled && setShowPicker(true)}
        disabled={!enabled}
      >
        <Ionicons name={iconName} size={20} color="#4CAF50" />
        {placeHolderText && !displayValue ? (
          <Text style={styles.buttonText}>{placeHolderText}</Text>
        ) : (
          <Text style={styles.buttonText}>{displayValue}</Text>
        )}

        <Ionicons name="chevron-down" size={20} color="#9ca3af" />
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {mode === "time" ? "Select Time" : "Select Date"}
              </Text>
              <TouchableOpacity onPress={handleCancel}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContainer}>
              {mode === "time" ? (
                <>
                  <ScrollPicker
                    items={hours}
                    selectedIndex={hours.indexOf(selectedHour)}
                    onSelect={(index) => setSelectedHour(hours[index])}
                  />
                  <Text style={styles.separator}>:</Text>
                  <ScrollPicker
                    items={minutes}
                    selectedIndex={selectedMinute}
                    onSelect={(index) => setSelectedMinute(minutes[index])}
                  />
                  <ScrollPicker
                    items={periods}
                    selectedIndex={periods.indexOf(selectedPeriod)}
                    onSelect={(index) => setSelectedPeriod(periods[index])}
                  />
                </>
              ) : (
                <>
                  <ScrollPicker
                    items={months.map((m) =>
                      new Date(2000, m - 1).toLocaleString("en-US", {
                        month: "short",
                      })
                    )}
                    selectedIndex={months.indexOf(selectedMonth)}
                    onSelect={(index) => {
                      const newMonth = months[index];
                      setSelectedMonth(newMonth);
                      const newDaysInMonth = getDaysInMonth(
                        selectedYear,
                        newMonth
                      );
                      if (selectedDay > newDaysInMonth) {
                        setSelectedDay(newDaysInMonth);
                      }
                    }}
                  />
                  <ScrollPicker
                    items={days}
                    selectedIndex={days.indexOf(selectedDay)}
                    onSelect={(index) => setSelectedDay(days[index])}
                  />
                  <ScrollPicker
                    items={years}
                    selectedIndex={years.indexOf(selectedYear)}
                    onSelect={(index) => setSelectedYear(years[index])}
                  />
                </>
              )}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginVertical: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors["text-secondary"],
    marginBottom: 6,
    marginLeft: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors["bg-light"],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors["border-light"],
    padding: 16,
    minHeight: 60,
  },
  buttonText: {
    color: colors["text-secondary"],
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
    height: 250,
  },
  scrollPickerContainer: {
    flex: 1,
    height: 250,
    position: "relative",
  },
  selectionIndicator: {
    position: "absolute",
    top: "50%",

    marginHorizontal: 2,
    left: 0,
    right: 0,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    transform: [{ translateY: -25 }],
    zIndex: 1,
  },
  scrollItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollItemText: {
    fontSize: 18,
    color: "#9ca3af",
    fontWeight: "500",
  },
  scrollItemTextSelected: {
    fontSize: 24,
    color: colors["text-primary"],
    fontWeight: "500",
    zIndex: 9,
  },
  separator: {
    fontSize: 28,
    fontWeight: "500",
    color: "#374151",
    marginHorizontal: 4,
  },
  modalActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
