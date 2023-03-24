export const setCache = (key, value) => {
    localStorage.setItem(key, value);
}

export const getCache = (key) => {
    return localStorage.getItem(key);
}
