import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useApi } from './useApi';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

// Interface for API choices
interface ChoiceOption {
  value: string;
  label: string;
}

interface ApiChoices {
  gender: ChoiceOption[];
  fitness_level: ChoiceOption[];
  motivation_level: ChoiceOption[];
  preferred_workout_time: ChoiceOption[];
  primary_goal: ChoiceOption[];
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  height: string;
  weight: string;
  age: string;
  gender: string;
  fitnessLevel: string;
  primaryGoal: string;
  wakeUpTime: string;
  sleepTime: string;
  preferredWorkoutTime: string;
  notifications: boolean;
  motivationLevel: string;
  weeklyGoal: string;
}

export const useRegistrationForm = (onRegister: (user: any) => void) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    height: '',
    weight: '',
    age: '',
    gender: '',
    fitnessLevel: '',
    primaryGoal: '',
    wakeUpTime: '',
    sleepTime: '',
    preferredWorkoutTime: '',
    notifications: true,
    motivationLevel: '',
    weeklyGoal: '3',
  });

  // API choices state
  const [apiChoices, setApiChoices] = useState<ApiChoices | null>(null);
  const [choicesLoading, setChoicesLoading] = useState(true);

  // Dropdown states
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showFitnessDropdown, setShowFitnessDropdown] = useState(false);
  const [showGoalDropdown, setShowGoalDropdown] = useState(false);
  const [showWorkoutTimeDropdown, setShowWorkoutTimeDropdown] = useState(false);
  const [showMotivationDropdown, setShowMotivationDropdown] = useState(false);

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
  const { fetchPost, fetchGet, loading } = useApi();
  const { showToast } = useToast();
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (key: string, value: string | boolean) => {
    setForm({ ...form, [key]: value });
  };

  const canNext = () => {
    if (step === 0) return form.name && form.email && form.password && form.password === form.confirmPassword;
    if (step === 1) return form.height && form.weight && form.age && form.gender && form.fitnessLevel && form.primaryGoal;
    if (step === 2) return form.wakeUpTime && form.sleepTime && form.preferredWorkoutTime;
    return true;
  };

  const registerApi = async (form: FormData) => {
    // Helper function to find the value for a given label
    const findValueByLabel = (choices: ChoiceOption[], label: string): string => {
      const choice = choices.find(option => option.label === label);
      return choice ? choice.value : label;
    };

    // Helper function to normalize values for API
    const normalizeValue = (value: string): string => {
      return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    };

    // Debug logging
    console.log('API Choices:', apiChoices);
    console.log('Form Data:', form);

    // Map display labels to API enum values
    const genderValue = apiChoices ? findValueByLabel(apiChoices.gender, form.gender) : normalizeValue(form.gender);
    const fitnessLevelValue = apiChoices ? findValueByLabel(apiChoices.fitness_level, form.fitnessLevel) : normalizeValue(form.fitnessLevel);
    const primaryGoalValue = apiChoices ? findValueByLabel(apiChoices.primary_goal, form.primaryGoal) : normalizeValue(form.primaryGoal);
    const motivationLevelValue = apiChoices ? findValueByLabel(apiChoices.motivation_level, form.motivationLevel) : normalizeValue(form.motivationLevel);
    const preferredWorkoutTimeValue = apiChoices ? findValueByLabel(apiChoices.preferred_workout_time, form.preferredWorkoutTime) : normalizeValue(form.preferredWorkoutTime);

    // Debug logging for mapped values
    console.log('Mapped Values:', {
      gender: { original: form.gender, mapped: genderValue },
      fitnessLevel: { original: form.fitnessLevel, mapped: fitnessLevelValue },
      primaryGoal: { original: form.primaryGoal, mapped: primaryGoalValue },
      motivationLevel: { original: form.motivationLevel, mapped: motivationLevelValue },
      preferredWorkoutTime: { original: form.preferredWorkoutTime, mapped: preferredWorkoutTimeValue }
    });

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      height: Number(form.height),
      weight: Number(form.weight),
      age: Number(form.age),
      gender: genderValue,
      fitnessLevel: fitnessLevelValue,
      primaryGoal: primaryGoalValue,
      wakeUpTime: form.wakeUpTime,
      sleepTime: form.sleepTime,
      preferredWorkoutTime: preferredWorkoutTimeValue,
      notifications: form.notifications,
      motivationLevel: motivationLevelValue,
      weeklyGoal: form.weeklyGoal,
    };

    console.log('Final API Payload:', payload);
    try {
      const data = await fetchPost(`${API_BASE_URL}/auth/register`, payload, false);
      return data;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const getProfileChoices = async () => {
    try {
      setChoicesLoading(true);
      console.log('Fetching profile choices from:', `${API_BASE_URL}/choices`);
      const data = await fetchGet(`${API_BASE_URL}/choices`, false);
      console.log('Profile choices response:', data);
      
      if (data && data.success !== false) {
        setApiChoices(data?.data);
        console.log('API Choices set:', data?.data);
      } else {
        console.error('Failed to load form options from API');
        showToast('Failed to load form options. Please try again later.', 'error');
      }
    } catch (error: any) {
      console.error('Profile choices error:', error);
      showToast('Failed to load form options. Please try again later.', 'error');
    } finally {
      setChoicesLoading(false);
    }
  };

  useEffect(() => {
    getProfileChoices();
  }, []);

  

  const nextStep = async () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      const apiResult = await registerApi(form);
      if (apiResult.success) {
        showToast('Registration successful!', 'success');
        router.replace('/login');
        // If the API returns tokens, use them to log in immediately
        if (apiResult.access && apiResult.refresh) {
          await login(form, apiResult.access,);
          onRegister(form);
          router.replace('/(tabs)');
        } else {
          // Otherwise, redirect to login
          onRegister(form);
        
        }
      } else {
        showToast(apiResult.error || apiResult.message || 'Registration failed', 'error');
      }
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const getOptions = (key: keyof ApiChoices): ChoiceOption[] => {
    if (!apiChoices) return [];
    return apiChoices[key] || [];
  };

  const progress = ((step + 1) / 3) * 100;

  return {
    // State
    step,
    form,
    apiChoices,
    choicesLoading,
    loading,
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
  };
};
