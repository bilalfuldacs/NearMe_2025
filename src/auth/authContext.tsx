// AuthContext.tsx
import React, { createContext, useReducer, useEffect, ReactNode } from "react";
import { authService, LoginCredentials, SignupCredentials, AuthResponse } from "../services/authService";

interface User {
  id?: number;
  username?: string;
  name?: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface AuthAction {
  type: "LOGIN" | "LOGOUT" | "SET_LOADING" | "SET_USER";
  payload?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  refreshToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  loading: true,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, loading: false, isAuthenticated: true };
    case "LOGOUT":
      return { ...state, user: null, loading: false, isAuthenticated: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload, loading: false, isAuthenticated: !!action.payload };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Initializing authentication state');
        
        // Check if user is authenticated
        if (authService.isAuthenticated()) {
          const user = authService.getUser();
          if (user) {
            console.log('AuthContext: Restoring user session:', user);
            dispatch({ type: "LOGIN", payload: user });
            return;
          }
        }
        
        // No valid session
        console.log('AuthContext: No valid session found');
        dispatch({ type: "SET_LOADING", payload: false });
      } catch (error) {
        console.error('AuthContext: Error initializing auth:', error);
        authService.clearAuth();
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login with email and password
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      console.log('AuthContext: Logging in user:', credentials.email);
      
      // Call auth service
      const response: AuthResponse = await authService.login(credentials);
      
      // Store tokens
      authService.storeTokens(response.tokens.access, response.tokens.refresh);
      
      // Store user
      authService.storeUser(response.user);
      
      // Update state
      dispatch({ type: "LOGIN", payload: response.user });
      
      console.log('AuthContext: Login successful');
    } catch (error: any) {
      console.error('AuthContext: Login failed:', error);
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  };

  /**
   * Signup new user
   */
  const signup = async (credentials: SignupCredentials): Promise<void> => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      console.log('AuthContext: Signing up user:', credentials.email);
      
      // Call auth service
      const response: AuthResponse = await authService.signup(credentials);
      
      // Store tokens
      authService.storeTokens(response.tokens.access, response.tokens.refresh);
      
      // Store user
      authService.storeUser(response.user);
      
      // Update state
      dispatch({ type: "LOGIN", payload: response.user });
      
      console.log('AuthContext: Signup successful');
    } catch (error: any) {
      console.error('AuthContext: Signup failed:', error);
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = (): void => {
    console.log('AuthContext: Logging out user');
    authService.clearAuth();
    dispatch({ type: "LOGOUT" });
  };

  /**
   * Update user data in context and localStorage
   */
  const updateUser = (userData: Partial<User>): void => {
    const updatedUser = { ...state.user, ...userData } as User;
    authService.storeUser(updatedUser);
    dispatch({ type: "SET_USER", payload: updatedUser });
  };

  /**
   * Get access token
   */
  const getAccessToken = (): string | null => {
    return authService.getAccessToken();
  };

  /**
   * Get refresh token
   */
  const getRefreshToken = (): string | null => {
    return authService.getRefreshToken();
  };

  /**
   * Refresh access token
   */
  const refreshToken = async (): Promise<void> => {
    try {
      const refreshTokenValue = authService.getRefreshToken();
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      console.log('AuthContext: Refreshing access token');
      const newAccessToken = await authService.refreshToken(refreshTokenValue);
      
      // Store new access token
      localStorage.setItem('access_token', newAccessToken);
      
      console.log('AuthContext: Access token refreshed');
    } catch (error) {
      console.error('AuthContext: Token refresh failed:', error);
      // Clear auth and logout
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        isAuthenticated: state.isAuthenticated,
        login,
        signup,
        logout,
        updateUser,
        getAccessToken,
        getRefreshToken,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
