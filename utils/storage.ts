import AsyncStorage from '@react-native-async-storage/async-storage';

export const REGISTRATION_KEY = 'user_registered';
export const USER_DATA_KEY = 'user_data';

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

export async function saveUserData(user: any) {
  await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

export async function getUserData() {
  const value = await AsyncStorage.getItem(USER_DATA_KEY);
  return value ? JSON.parse(value) : null;
}

export async function removeUserData() {
  await AsyncStorage.removeItem(USER_DATA_KEY);
}
