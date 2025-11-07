import { createContext, useContext, useState, type ReactNode } from "react";

type AuthContextTypeToken = {
    token: string | null;
    setToken: (token: string | null) => void;
};
const AuthContextToken = createContext<AuthContextTypeToken | null>(null);

export const AuthProviderToken = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);

    return (
        <AuthContextToken.Provider
            value={{
                token,
                setToken,
            }}
        >
            {children}
        </AuthContextToken.Provider>
    );
};

export const useAuthToken = () => {
    const context = useContext(AuthContextToken);
    if (!context) {
        throw new Error('useAuthToken must be used within an AuthProviderToken');
    }
    return context;
};