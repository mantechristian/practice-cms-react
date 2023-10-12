import jwt_decode from 'jwt-decode';
import { API_URL } from './config';

export const decodeAccessToken = (token) => {
    try {
        console.log('token: ', token);
        const decoded = jwt_decode(token);
        console.log('decoded: ', decoded);
        return decoded;
    } catch (err) {
        console.error('Error decoding token:', err);
    }
}

export const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        return new Promise((resolve) => {
            timer = setTimeout(async () => {
                const result = await func.apply(this, args);
                resolve(result);
            }, timeout);
        });
    };
};

export const fetchApi = async (url, method, headers, body) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...headers
        }
    };
    if (body !== null) {
        options.body = JSON.stringify(body);
    }
    const response = await fetch(`${API_URL}${url}`, options);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
};

export const getAuthHeader = () => {
    return { 'Authorization': 'Bearer ' + localStorage.getItem('accessToken')?.toString() };
}

// Validate email
export const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}