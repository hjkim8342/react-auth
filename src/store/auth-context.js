import React, { useState, useEffect, useCallback } from 'react';

let logoutTimer;

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {},
});

const calculatingRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();
    const remainingDuration = adjExpirationTime - currentTime;
    return remainingDuration;
};

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationTime = localStorage.getItem('expirationTime');

    const remainingTime = calculatingRemainingTime(storedExpirationTime);

    if (remainingTime <= 60000) {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        return null;
    }

    return {
        token: storedToken,
        duration: remainingTime,
    };
};

export const AuthContextProvider = (props) => {
    // 로컬저장소에 token 및 만료시간 가져오기
    const tokenData = retrieveStoredToken();
    let initialToken;
    if (tokenData) {
        initialToken = tokenData.token;
    }
    // 로컬저장소에서 가져온 token값 useState에 초기화
    const [token, setToken] = useState(initialToken);
    const userIsLoggedIn = !!token;
    
    const logoutHandler = useCallback(() => {
        setToken(null);
        // 로그아웃 시 로컬저장소에 token값 삭제
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');

        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }, []);

    const loginHandler = (token, expirationTime) => {
        setToken(token);
        // 로그인 시 로컬저장소에 token값 저장
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', expirationTime);
        const remainingTime = calculatingRemainingTime(expirationTime);
        logoutTimer = setTimeout(logoutHandler, remainingTime);
    };

    useEffect(() => {
      if (tokenData) {
        console.log(tokenData.duration);
        logoutTimer = setTimeout(logoutHandler, tokenData.duration);
      }
    }, [tokenData, logoutHandler]);

    const contextValue = {
        token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
    }
    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}

export default AuthContext;