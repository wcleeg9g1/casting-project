import React, {createContext, useState, useContext, useCallback, Children} from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext); 

/* 
액세스 토큰은 메모리에만 저장
리프레시 토큰은 백엔드에서 HttpOnly 쿠키로 저장
*/

export const AuthProvider = ({children}) => {
    const [access, setAccess] = useState(null); 

    const login = async (username, password) => {
        const res = await fetch("http://localhost:8000/api/auth/token/", {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            credentials: "include", // allow cookies
            body: JSON.stringify({username, password})
        }); 

        if (!res.ok) {
            const text = await res.text();
            throw new Error("Login failed: " + text);
        }

        const data = await res.json(); 
        setAccess(data.access); 
    }

    const refresh = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:8000/api/auth/token/refresh/", {
                method: "POST",
                credentials: "include",
            });
            if (res && !res.ok) {
                setAccess(null);
                return null;
            }
            const data = await res.json();
            setAccess(data.access);
            return data.access;
        } catch {
            return null;
        }
    }, []);

    const logout = async () => {
        await fetch("http://localhost:8000/api/auth/logout/", {
            method: "POST",
            credentials: "include",
            headers: access ? { Authorization: `Bearer ${access}` } : {},
        }); 
        setAccess(null);
    }; 

    return (
        <AuthContext.Provider value={{ access, setAccess, login, refresh, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

