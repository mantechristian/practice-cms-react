import jwt_decode from 'jwt-decode';

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