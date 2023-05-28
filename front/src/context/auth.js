import React, { useState, useEffect, createContext } from 'react'
import axios from '../config/axios'

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, SetUser] = useState(localStorage.getItem('user'));
    const [token, SetToken] = useState(localStorage.getItem('token'));
    const [logged, SetLogged] =  useState(localStorage.getItem('user') !== undefined);

    useEffect(() => {
        SetUser(localStorage.getItem('user'));
        SetToken(localStorage.getItem('token'));
        authSignIn(user !== '' && user !==  undefined && user !==  null && user !==  'null', user, token)
    }, []);

    const authSignIn = (logged, user, token) => {
        localStorage.setItem('user', user);
        localStorage.setItem('token', token);
        SetLogged(logged);
        SetUser(user);
        SetToken(token);
        axios.defaults.headers.Authorization = `Bearer ${token}`;
    }

    const authSignOut = () => {
        localStorage.setItem('user', '');
        localStorage.setItem('token', '');
        SetLogged(false);
        SetUser('');
        SetToken(null);
        axios.defaults.headers.Authorization = '';
    }

    return <AuthContext.Provider value={{user, logged, authSignIn, authSignOut }}>{children}</AuthContext.Provider>
};
