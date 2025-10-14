import { DropdownButton } from "@/components/DropDownButton";
import { DropdownModal } from "@/components/DropdownSelect";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ProtectedRoute } from "../components/ProtectedRoute";
import CustomDateTimePicker from "../components/TimePicker";
import { useRegistrationForm } from "../hooks/useRegistrationForm";

const { width } = Dimensions.get("window");

const steps = [
  "Personal Info",
  "Physical Details",
  "Fitness Level",
  "Goals",
  "Preferences",
];

export default function RegistrationScreen({
  onRegister,
}: {
  onRegister: (user: any) => void;
}) {
  const {
    step,
    form,
    choicesLoading,
    progress,
    showGenderDropdown,
    showFitnessDropdown,
    showGoalDropdown,
    showWorkoutTimeDropdown,
    showMotivationDropdown,
    handleChange,
    canNext,
    nextStep,
    prevStep,
    getOptions,
    setShowGenderDropdown,
    setShowFitnessDropdown,
    setShowGoalDropdown,
    setShowWorkoutTimeDropdown,
    setShowMotivationDropdown,
    router,
  } = useRegistrationForm(onRegister);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [step]);

  return (
    <ProtectedRoute requireAuth={false}>
      <View style={styles.container}>
        <LinearGradient
          colors={["#f0fdf4", "#fef3f2", "#eff6ff"]}
          style={styles.gradient}
        >
          <View style={[styles.blurCircle, styles.blurCircle1]} />
          <View style={[styles.blurCircle, styles.blurCircle2]} />

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
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progress}%`,
                      shadowColor: "#4CAF50",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 8,
                      elevation: 5,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(progress)}% Complete
              </Text>
            </View>

            <View style={styles.stepContainer}>
              {steps.map((label, idx) => (
                <View key={label} style={styles.stepItem}>
                  <View style={styles.stepWrapper}>
                    {idx > 0 && (
                      <View
                        style={[
                          styles.stepConnector,
                          step >= idx && styles.stepConnectorActive,
                        ]}
                      />
                    )}
                    <View
                      style={[
                        styles.stepCircle,
                        step >= idx && styles.stepCircleActive,
                        step === idx && styles.stepCircleCurrent,
                      ]}
                    >
                      {step > idx ? (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      ) : (
                        <Text
                          style={[
                            styles.stepNumber,
                            step >= idx && styles.stepNumberActive,
                          ]}
                        >
                          {idx + 1}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      step >= idx && styles.stepLabelActive,
                      step === idx && styles.stepLabelCurrent,
                    ]}
                  >
                    {label}
                  </Text>
                </View>
              ))}
            </View>

            <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
              <Text style={styles.title}>{steps[step]}</Text>

              {step === 0 && (
                <View style={styles.formSection}>
                  <Text style={styles.sectionTitle}>
                    Tell us about yourself
                  </Text>
                  <InputField
                    label="Full Name"
                    placeholder="Enter your Full Name"
                    value={form.name}
                    onChangeText={(v) => handleChange("name", v)}
                  />
                  <InputField
                    label="Email"
                    placeholder="Enter your Email"
                    value={form.email}
                    onChangeText={(v) => handleChange("email", v)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <InputField
                    label="Password"
                    placeholder="Enter your Password"
                    value={form.password}
                    onChangeText={(v) => handleChange("password", v)}
                    secureTextEntry
                  />
                  <InputField
                    label="Confirm Password"
                    placeholder="Confirm your Password"
                    value={form.confirmPassword}
                    onChangeText={(v) => handleChange("confirmPassword", v)}
                    secureTextEntry
                  />
                  {form.password &&
                    form.confirmPassword &&
                    form.password !== form.confirmPassword && (
                      <Text style={styles.errorText}>
                        Passwords don't match
                      </Text>
                    )}
                </View>
              )}

              {step === 1 && (
                <View style={styles.formSection}>
                  <Text style={styles.sectionTitle}>Your Physical Details</Text>
                  <View style={styles.row}>
                    <InputField
                      placeholder="Enter your Height"
                      label="Height (cm)"
                      value={form.height}
                      onChangeText={(v) => handleChange("height", v)}
                      keyboardType="numeric"
                    />
                    <InputField
                      placeholder="Enter your Weight"
                      label="Weight (kg)"
                      value={form.weight}
                      onChangeText={(v) => handleChange("weight", v)}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.row}>
                    <InputField
                      label="Age"
                      placeholder="Enter your Age"
                      value={form.age}
                      onChangeText={(v) => handleChange("age", v)}
                      keyboardType="numeric"
                    />
                    <DropdownButton
                      value={form.gender}
                      options={getOptions("gender")}
                      placeholder="Select Gender"
                      onPress={() => setShowGenderDropdown(true)}
                      disabled={
                        choicesLoading || getOptions("gender").length === 0
                      }
                      title="gender"
                    />
                  </View>
                </View>
              )}

              {step === 2 && (
                <View style={styles.formSection}>
                  <Text style={styles.sectionTitle}>Fitness Experience</Text>
                  <DropdownButton
                    value={form.fitnessLevel}
                    options={getOptions("fitness_level")}
                    placeholder="Select Fitness Level"
                    onPress={() => setShowFitnessDropdown(true)}
                    disabled={
                      choicesLoading || getOptions("fitness_level").length === 0
                    }
                    title="Fitness Level"
                  />
                  <DropdownButton
                    value={form.motivationLevel}
                    options={getOptions("motivation_level")}
                    placeholder="Select Motivation Level"
                    onPress={() => setShowMotivationDropdown(true)}
                    disabled={choicesLoading}
                    title="Motivation Level"
                  />
                </View>
              )}

              {step === 3 && (
                <View style={styles.formSection}>
                  <Text style={styles.sectionTitle}>What's Your Goal?</Text>
                  <DropdownButton
                    value={form.primaryGoal}
                    options={getOptions("primary_goal")}
                    placeholder="Select Primary Goal"
                    onPress={() => setShowGoalDropdown(true)}
                    disabled={
                      choicesLoading || getOptions("primary_goal").length === 0
                    }
                    title="Primary Goal"
                  />
                </View>
              )}

              {step === 4 && (
                <View style={styles.formSection}>
                  <Text style={styles.sectionTitle}>
                    Daily Schedule & Preferences
                  </Text>
                  <CustomDateTimePicker
                    title="Wake Up Time"
                    value={form.wakeUpTime}
                    onValueChange={(time) => handleChange("wakeUpTime", time)}
                    mode="time"
                    placeHolderText="Wake Up Time"
                  />
                  <CustomDateTimePicker
                    title="Sleep Time"
                    value={form.sleepTime}
                    onValueChange={(time) => handleChange("sleepTime", time)}
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
                    title="Preferred Workout Time"
                  />
                </View>
              )}

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
            </Animated.View>
          </KeyboardAwareScrollView>

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
        </LinearGradient>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  blurCircle: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.15,
  },
  blurCircle1: {
    top: -80,
    left: -80,
    backgroundColor: "#4CAF50",
  },
  blurCircle2: {
    bottom: -100,
    right: -100,
    backgroundColor: "#6366f1",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 100,
    padding: 12,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 100,
  },
  progressContainer: {
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  progressBar: {
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 10,
  },
  progressText: {
    color: "#666",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
  },
  stepContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingHorizontal: 4,
    position: "relative",
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
  },
  stepWrapper: {
    position: "relative",
    alignItems: "center",
  },
  stepConnector: {
    position: "absolute",
    right: "50%",
    top: "50%",
    width: width / 5 - 40,
    height: 2,
    backgroundColor: "#e0e0e0",
    transform: [{ translateY: -1 }],
  },
  stepConnectorActive: {
    backgroundColor: "#4CAF50",
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepCircleActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  stepCircleCurrent: {
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  stepNumber: {
    color: "#999",
    fontSize: 14,
    fontWeight: "bold",
  },
  stepNumberActive: {
    color: "#fff",
  },
  stepLabel: {
    color: "#999",
    fontSize: 9,
    textAlign: "center",
    fontWeight: "600",
    maxWidth: 60,
  },
  stepLabelActive: {
    color: "#666",
  },
  stepLabelCurrent: {
    color: "#4CAF50",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 28,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    minHeight: Dimensions.get("window").height * 0.6, // 👈 fixed visible height (~60% of screen)
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 20,
    textAlign: "center",
  },
  formSection: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    // flexDirection: "row",
    flexWrap: "wrap",
    // gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    gap: 16,
  },
});
