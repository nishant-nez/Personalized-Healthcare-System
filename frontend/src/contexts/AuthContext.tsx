import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import axios from '@/api/axios';
import { isAxiosError } from 'axios';
import { useCookies } from 'react-cookie';
import { useToast } from "@/components/ui/use-toast";

interface IUser {
    id: number;
    name: string;
    email: string;
    is_staff: boolean;
};

interface AuthContextProps {
    isLoggedIn: boolean;
    user: IUser | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuthenticated: () => Promise<void>;
    load_user: () => Promise<void>;
    // register: (name: string, email: string, password: string, re_pasword: string) => Promise<void>;
    access: string;
    refresh: string;
    isLoading: boolean;
};


const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cookies, setCookie] = useCookies(['access', 'refresh'])
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [access, setAccess] = useState<string>('');
    const [refresh, setRefresh] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const setValues = (isLoggedIn: boolean, access: string, refresh: string) => {
        setIsLoggedIn(isLoggedIn);
        setAccess(access);
        setRefresh(refresh);
        setCookie('access', access, { path: '/' });
        setCookie('refresh', refresh, { path: '/' });
    }

    const load_user = async () => {
        if (cookies.access) {
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${cookies.access}`,
                },
                withCredentials: true,
            };
            try {
                const response = await axios.get('/api/auth/users/me/', config);

                setUser(response.data);
            } catch (error: unknown) {
                setValues(false, '', '');
                setUser(null);
                if (isAxiosError(error)) {
                    console.error("User loading failed", error.response?.data.detail);
                } else {
                    console.error("User loading failed", (error as Error).message);
                }
            }
        } else {
            setValues(false, '', '');
        }
    };


    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            };
            const response = await axios.post('/api/auth/jwt/create/', { email, password }, config);
            setValues(true, response.data.access, response.data.refresh);
            setIsLoading(false);
        } catch (error: unknown) {
            setValues(false, '', '');
            setIsLoading(false);
            if (isAxiosError(error)) {
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: error.response?.data.detail,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: (error as Error).message,
                });
            }
        }
        setIsLoading(false);
    };


    const checkAuthenticated = async () => {
        if (cookies.access) {
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            };

            const body = JSON.stringify({ token: cookies.access });

            try {
                await axios.post('/api/auth/jwt/verify/', body, config);
                setIsLoggedIn(true);
            } catch (err: unknown) {
                setIsLoggedIn(false);
                console.log('err from checkauthenticated', err)
            }
        } else {
            setIsLoggedIn(false);
        }
    };

    const logout = () => {
        setValues(false, '', '');
    };

    useEffect(() => {
        if (cookies.access && cookies.refresh) {
            load_user();
        }
    }, [cookies]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, user, access, refresh, checkAuthenticated, logout, load_user, isLoading, }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};