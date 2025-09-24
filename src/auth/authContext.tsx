// AuthContext.tsx
import React, { createContext, useReducer, useEffect, ReactNode } from "react";

interface User {
  id?: number;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface AuthAction {
  type: "LOGIN" | "LOGOUT" | "SET_LOADING";
  payload?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, email: string, role?: string, id?: number) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  loading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, loading: false };
    case "LOGOUT":
      return { ...state, user: null, loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      dispatch({ type: "LOGIN", payload: JSON.parse(savedUser) });
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const login = (username: string, email: string, role: string = "user", id?: number) => {
    const newUser: User = { id, username, email, role };
    console.log('AuthContext: Creating new user object:', newUser);
    console.log('AuthContext: Storing in localStorage:', newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    dispatch({ type: "LOGIN", payload: newUser });
  };

  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
