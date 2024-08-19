import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({children}) => {
    const [authState, setAuthState] = useState({
        token: null,
        user: null,
        authenticated: null
    });

    useEffect(() => {
        const loadTokenUser = async () => {
            const token = Cookies.get("TOKEN_KEY")
            const user = Cookies.get("USER_KEY");

            if(token && user){
                setAuthState({
                    token: token,
                    user: JSON.parse(user),
                    authenticated: true
                });
            }else{
                setAuthState({
                    token: null,
                    user: null,
                    authenticated: false
                });
            }
        };
        loadTokenUser();
    }, []);

    const setLogin = async (user, token) => {
        try {
            setAuthState({
                token: token,
                user: user,
                authenticated: true
            });
            Cookies.set("TOKEN_KEY", token);
            Cookies.set("USER_KEY", JSON.stringify(user));

            return "success";
        }catch (err){
            return "error";
        }
    };

    const logout = async () => {
        //  Delete token and user from cookies
        Cookies.remove("TOKEN_KEY");
        Cookies.remove("USER_KEY");

        // Reset auth state
        setAuthState({
            token: null,
            user: null,
            authenticated: false
        });
    };


    const value = { setLogin, logout, authState, setAuthState };
    
    return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>);
}