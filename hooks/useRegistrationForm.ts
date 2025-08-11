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

  const handleChange = (key: string, value: string | boolean | { value: string; label: string }) => {
    // If the value is an object with value/label (from a dropdown selection),
    // we want to store the value, not the label
    if (value && typeof value === 'object' && 'value' in value) {
      setForm({ ...form, [key]: value.value });
    } else {
      setForm({ ...form, [key]: value });
    }
  };

  const canNext = () => {
    if (step === 0) return form.name && form.email && form.password && form.password === form.confirmPassword;
    if (step === 1) return form.height && form.weight && form.age && form.gender && form.fitnessLevel && form.primaryGoal;
    if (step === 2) return form.wakeUpTime && form.sleepTime && form.preferredWorkoutTime;
    return true;
  };

  const registerApi = async (form: FormData) => {
    console.log('API Choices:', apiChoices);
    console.log('Form Data:', form);

    // The form values are the same as the API expects since label and value are identical
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      height: Number(form.height),
      weight: Number(form.weight),
      age: Number(form.age),
      gender: form.gender,
      fitnessLevel: form.fitnessLevel,
      primaryGoal: form.primaryGoal,
      wakeUpTime: form.wakeUpTime,
      sleepTime: form.sleepTime,
      preferredWorkoutTime: form.preferredWorkoutTime,
      notifications: form.notifications,
      motivationLevel: form.motivationLevel,
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
      const response = await fetchGet(`${API_BASE_URL}/choices`, false);
      
      if (response && response.success !== false && response.data) {
        const transformedData = {
          gender: response.data.gender || [],
          fitness_level: response.data.fitnessLevel || response.data.fitness_level || [],
          motivation_level: response.data.motivationLevel || response.data.motivation_level || [],
          preferred_workout_time: response.data.preferredWorkoutTime || response.data.preferred_workout_time || [],
          primary_goal: response.data.primaryGoal || response.data.primary_goal || []
        };
        
        setApiChoices(transformedData);
      } else {
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
    if (!apiChoices) {
      return [];
    }
    
    const options = apiChoices[key];
    
    if (!Array.isArray(options)) {
      return [];
    }
    
    return options;
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
