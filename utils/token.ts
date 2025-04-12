import { jwtDecode } from "jwt-decode";

export const getUserUUID = (token: string): string => {
  try {
    const decodedToken: any = jwtDecode(token);
    return decodedToken.user_uuid;
  } catch (e) {
    return "";
  }
};

export const getUserType = (token: string): string => {
  try {
    const decodedToken: any = jwtDecode(token);
    return decodedToken.user_type;
  } catch (e) {
    return "";
  }
};

export const getAccessTokenExpiryDate = (token: string): Date => {
  try {
    const decodedToken: any = jwtDecode(token);
    return new Date(decodedToken.exp * 1000);
  } catch (e) {
    return new Date();
  }
};

export const isTokenExpired = (token: string): boolean => {
  const expiryDate = getAccessTokenExpiryDate(token);
  return expiryDate < new Date();
};
