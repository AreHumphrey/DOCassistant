export interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
}

export interface AuthContextProps {
    isAuthenticated: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    requireAuth: () => void;
}