import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cognito configuration
  const COGNITO_DOMAIN = process.env.REACT_APP_COGNITO_DOMAIN || 'us-east-1vyybvgqpj.auth.us-east-1.amazoncognito.com';
  const CLIENT_ID = process.env.REACT_APP_COGNITO_CLIENT_ID || 'n7nvic500og1nih0tra7v2am6';
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI || 'https://finihon.onrender.com/';
  const TOKEN_ENDPOINT = `https://${COGNITO_DOMAIN}/oauth2/token`;

  // JWT decoder function
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  // Exchange authorization code for tokens
  const exchangeCodeForTokens = async (code) => {
    try {
      const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: CLIENT_ID,
          code,
          redirect_uri: REDIRECT_URI,
        }),
      });

      if (!response.ok) {
        throw new Error('Token exchange failed');
      }

      const tokens = await response.json();
      
      // Store tokens
      setAccessToken(tokens.access_token);
      setIdToken(tokens.id_token);
      
      // Decode ID token to get user info
      const decodedUser = decodeJWT(tokens.id_token);
      if (decodedUser) {
        setUser({
          sub: decodedUser.sub,
          email: decodedUser.email,
          name: decodedUser.name || decodedUser['cognito:username'],
        });
        setIsAuthenticated(true);
      }

      // Remove code parameter from URL
      const url = new URL(window.location);
      url.searchParams.delete('code');
      window.history.replaceState({}, document.title, url.toString());
      
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Handle login redirect to Cognito
  const login = () => {
    const loginUrl = `https://${COGNITO_DOMAIN}/login?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = loginUrl;
  };

  // Handle logout
  const logout = () => {
    // Clear local state
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(null);
    setIdToken(null);
    
    // Redirect to Cognito logout
    const logoutUrl = `https://${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = logoutUrl;
  };

  // Check for authorization code on app load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      exchangeCodeForTokens(code);
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    isAuthenticated,
    user,
    accessToken,
    idToken,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};