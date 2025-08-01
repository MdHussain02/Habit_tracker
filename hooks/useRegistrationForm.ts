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
    const payload = {
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      profile: {
        name: form.name,
        age: Number(form.age),
        gender: form.gender,
        weight: Number(form.weight),
        height: Number(form.height),
        fitness_level: form.fitnessLevel,
        motivation_level: form.motivationLevel,
        notifications: form.notifications,
        preferred_workout_time: form.preferredWorkoutTime,
        primary_goal: form.primaryGoal,
        sleep_time: form.sleepTime,
        wake_up_time: form.wakeUpTime,
        weekly_goal: Number(form.weeklyGoal),
      },
    };
    try {
      const data = await fetchPost(`${API_BASE_URL}/register`, payload, false);
      return data;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const getProfileChoices = async () => {
    try {
      setChoicesLoading(true);
      const data = await fetchGet(`${API_BASE_URL}/profile/choices`, false);
      if (data.success !== false) {
        setApiChoices(data?.data);
      } else {
        showToast('Failed to load form options', 'error');
      }
    } catch (error: any) {
      showToast('Failed to load form options', 'error');
      console.error('Profile choices error:', error);
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
          await login(form, apiResult.access, apiResult.refresh);
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
