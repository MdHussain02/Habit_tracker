import AsyncStorage from '@react-native-async-storage/async-storage';

export const REGISTRATION_KEY = 'user_registered';
export const USER_DATA_KEY = 'user_data';
export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

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

export async function saveTokens(access: string, refresh?: string) {
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
}

export async function getAccessToken() {
  return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken() {
  return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function removeTokens() {
  await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
}

export async function isLoggedIn() {
  const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  const userData = await AsyncStorage.getItem(USER_DATA_KEY);
  return !!(accessToken && userData);
}
