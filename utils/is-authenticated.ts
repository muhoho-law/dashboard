const isAuthenticated = () => {
  const accessToken =
    useHashedCookie<string>('access_token').value && useHashedCookie<string>('account_uuid').value;
  // check if accessToken is valid and not expired
  return accessToken && !isTokenExpired(accessToken);
};

export default isAuthenticated;
