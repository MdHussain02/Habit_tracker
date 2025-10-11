import { DropdownButton } from "@/components/DropDownButton";
import { DropdownModal } from "@/components/DropdownSelect";
import Button from "@/components/ui/Button";
import colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ProtectedRoute } from "../components/ProtectedRoute";
import CustomDateTimePicker from "../components/TimePicker";
import { useRegistrationForm } from "../hooks/useRegistrationForm";

const steps = ["Personal Info", "Health & Goals", "Preferences"];

export default function RegistrationScreen({
  onRegister,
}: {
  onRegister: (user: any) => void;
}) {
  const {
    // State
    step,
    form,
    choicesLoading,
    progress,

    // Dropdown states
    showGenderDropdown,
    showFitnessDropdown,
    showGoalDropdown,
    showWorkoutTimeDropdown,
    showMotivationDropdown,

    // Handlers
    handleChange,
    canNext,
    nextStep,
    prevStep,
    getOptions,

    // Dropdown handlers
    setShowGenderDropdown,
    setShowFitnessDropdown,
    setShowGoalDropdown,
    setShowWorkoutTimeDropdown,
    setShowMotivationDropdown,

    // Router
    router,
  } = useRegistrationForm(onRegister);

  return (
    <ProtectedRoute requireAuth={false}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#4CAF50" />
        </TouchableOpacity>

        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContainer}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={100}
        >
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {Math.round(progress)}% Complete
            </Text>
          </View>

          {/* Step Indicator */}
          <View style={styles.stepContainer}>
            {steps.map((label, idx) => (
              <View key={label} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    step >= idx && styles.stepCircleActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNumber,
                      step >= idx && styles.stepNumberActive,
                    ]}
                  >
                    {idx + 1}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    step >= idx && styles.stepLabelActive,
                  ]}
                >
                  {label}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.title}>{steps[step]}</Text>

          {/* Step 0: Personal Info */}
          {step === 0 && (
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Tell us about yourself</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#aaa"
                value={form.name}
                onChangeText={(v) => handleChange("name", v)}
              />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#aaa"
                value={form.email}
                onChangeText={(v) => handleChange("email", v)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                value={form.password}
                onChangeText={(v) => handleChange("password", v)}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#aaa"
                value={form.confirmPassword}
                onChangeText={(v) => handleChange("confirmPassword", v)}
                secureTextEntry
              />
              {form.password &&
                form.confirmPassword &&
                form.password !== form.confirmPassword && (
                  <Text style={styles.errorText}>Passwords don't match</Text>
                )}
            </View>
          )}

          {/* Step 1: Health & Goals */}
          {step === 1 && (
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Health & Fitness Goals</Text>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Height (cm)"
                  placeholderTextColor="#aaa"
                  value={form.height}
                  onChangeText={(v) => handleChange("height", v)}
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Weight (kg)"
                  placeholderTextColor="#aaa"
                  value={form.weight}
                  onChangeText={(v) => handleChange("weight", v)}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Age"
                  placeholderTextColor="#aaa"
                  value={form.age}
                  onChangeText={(v) => handleChange("age", v)}
                  keyboardType="numeric"
                />

                <DropdownButton
                  value={form.gender}
                  options={getOptions("gender")}
                  placeholder="Select Gender"
                  onPress={() => setShowGenderDropdown(true)}
                  style={[styles.halfInput]}
                  disabled={choicesLoading || getOptions("gender").length === 0}
                  title="gender"
                />
              </View>
              <DropdownButton
                value={form.fitnessLevel}
                options={getOptions("fitness_level")}
                placeholder="Select Fitness Level"
                onPress={() => setShowFitnessDropdown(true)}
                disabled={
                  choicesLoading || getOptions("fitness_level").length === 0
                }
              />
              <DropdownButton
                value={form.primaryGoal}
                options={getOptions("primary_goal")}
                placeholder="Select Primary Goal"
                onPress={() => setShowGoalDropdown(true)}
                disabled={
                  choicesLoading || getOptions("primary_goal").length === 0
                }
              />
            </View>
          )}

          {/* Step 2: Preferences */}
          {step === 2 && (
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>
                Daily Schedule & Preferences
              </Text>
              <CustomDateTimePicker
                // title="Wake Up Time"
                value={form.wakeUpTime}
                onValueChange={(time) => handleChange('wakeUpTime', time)}
                mode="time"
                placeHolderText="Wake Up Time"
              />
              <CustomDateTimePicker
                // title="Sleep Time"
                value={form.sleepTime}
                onValueChange={(time) => handleChange('sleepTime', time)}
                mode="time"
                placeHolderText="Sleep Time"
              />
              <DropdownButton
                value={form.preferredWorkoutTime}
                options={getOptions("preferred_workout_time")}
                placeholder="Select Preferred Workout Time"
                onPress={() => setShowWorkoutTimeDropdown(true)}
                disabled={
                  choicesLoading ||
                  getOptions("preferred_workout_time").length === 0
                }
              />
              <DropdownButton
                value={form.motivationLevel}
                options={getOptions("motivation_level")}
                placeholder="Select Motivation Level"
                onPress={() => setShowMotivationDropdown(true)}
                disabled={choicesLoading}
              />
            </View>
          )}

          {/* Navigation Buttons */}
          <View style={styles.buttonRow}>
            {step > 0 && (
              <Button
                onPress={prevStep}
                disabled={step === 0}
                type="secondary"
                size="large"
              >
                Back
              </Button>
            )}
            <Button
              onPress={nextStep}
              disabled={!canNext()}
              type="primary"
              size="large"
            >
              {step === steps.length - 1 ? "Create Account" : "Next"}
            </Button>
          </View>

          {/* Dropdown Modals */}
          <DropdownModal
            visible={showGenderDropdown}
            onClose={() => setShowGenderDropdown(false)}
            options={getOptions("gender")}
            onSelect={(option) => handleChange("gender", option)}
            title="Select Gender"
          />
          <DropdownModal
            visible={showFitnessDropdown}
            onClose={() => setShowFitnessDropdown(false)}
            options={getOptions("fitness_level")}
            onSelect={(option) => handleChange("fitnessLevel", option)}
            title="Select Fitness Level"
          />
          <DropdownModal
            visible={showGoalDropdown}
            onClose={() => setShowGoalDropdown(false)}
            options={getOptions("primary_goal")}
            onSelect={(option) => handleChange("primaryGoal", option)}
            title="Select Primary Goal"
          />
          <DropdownModal
            visible={showWorkoutTimeDropdown}
            onClose={() => setShowWorkoutTimeDropdown(false)}
            options={getOptions("preferred_workout_time")}
            onSelect={(option) => handleChange("preferredWorkoutTime", option)}
            title="Select Preferred Workout Time"
          />
          <DropdownModal
            visible={showMotivationDropdown}
            onClose={() => setShowMotivationDropdown(false)}
            options={getOptions("motivation_level")}
            onSelect={(option) => handleChange("motivationLevel", option)}
            title="Select Motivation Level"
          />
        </KeyboardAwareScrollView>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors["bg-light"],
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors["bg-light"],
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 100,
    backgroundColor: colors["bg-light"],
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors["bg-secondary"],
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    color: colors["text-secondary"],
    fontSize: 14,
    textAlign: "center",
  },
  stepContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors["bg-light"],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors["border-light"],
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors["border-light"],
  },
  stepNumber: {
    color: colors["text-secondary"],
    fontSize: 16,
    fontWeight: "bold",
  },
  stepNumberActive: {
    color: colors["text-light"],
  },
  stepLabel: {
    color: colors["text-disabled"],
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  stepLabelActive: {
    color: colors["text-secondary"],
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors["text-secondary"],
    marginBottom: 24,
    textAlign: "center",
  },
  formSection: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors["text-primary"],
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: colors["bg-light"],
    color: colors["text-primary"],
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors["border-light"],
  },
  row: {
    flexDirection: "row",
    flexWrap :"wrap",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  errorText: {
    color: colors["text-danger"],
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    gap: 16,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: "center",
    minWidth: 140,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  formBackButton: {
    backgroundColor: "#f0f0f5",
    shadowColor: "#999",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0.1,
  },
  // Dropdown styles
  dropdownButton: {
    width: "100%",
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 1,
    minHeight: 50,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButtonText: {
    // color: '#333',
    fontSize: 16,
    flex: 1,
  },
  placeholderText: {
    color: "#999",
  },
  dropdownArrow: {
    color: "#666",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxHeight: "70%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    color: "#333",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f5",
  },
  dropdownItemText: {
    color: "#333",
    fontSize: 16,
  },
});
