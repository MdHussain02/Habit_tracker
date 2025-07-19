import AsyncStorage from '@react-native-async-storage/async-storage';

export const REGISTRATION_KEY = 'user_registered';

export async function isUserRegistered() {
  const value = await AsyncStorage.getItem(REGISTRATION_KEY);
  return value === 'true';
}

export async function setUserRegistered() {
  await AsyncStorage.setItem(REGISTRATION_KEY, 'true');
}

export async function logoutUser() {
  await AsyncStorage.removeItem(REGISTRATION_KEY);
}
