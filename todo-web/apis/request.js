import {getCookie, removeCookie} from "./cookies";
import toast from "react-hot-toast";

export const fetcher = (...args) => callApi(...args).then((res) => res);

export function buildPath(url, params) {
    if (params) {
        const paramsArray = [];
        Object.keys(params).forEach((key) =>
            paramsArray.push(key + '=' + encodeURI(params[key]))
        );
        if (paramsArray.length > 0) {
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&');
            } else {
                url += '&' + paramsArray.join('&');
            }
        }
    }
    return url;
}

let loadingId = null;

export async function fetchLoading(params) {
    let clear = () => {
    };

    const loading = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            if (loadingId == null) {
                const id = toast.loading("请求中...");
                loadingId = id;
                resolve(id);
            }
        }, 500);
        clear = () => {
            clearTimeout(timeout);
            loadingId = null;
            resolve('')
        }
    });

    const fetch = new Promise((resolve, reject) => {
        callApi(params).then(r => {
            clear();
            resolve(r);
        });
    });

    return await Promise.all([loading, fetch]).then((responses) => {
        let id = responses[0];
        toast.dismiss(id);
        return responses[1];
    });
}

export async function callApi({
                                  method = 'GET',
                                  url,
                                  params,
                                  body = null,
                                  headers = {
                                      'Accept': 'application/json',
                                      'Content-Type': 'application/json',
                                  },
                                  token
                              }) {
    if (typeof document !== 'undefined') {
        token = getCookie('token');
    }
    if (token != null && token.trim() !== '') {
        headers = {
            ...headers,
            Authorization: 'Bearer ' + token
        }
    }
    let res;
    if (method === 'POST') {
        res = await fetch(url, {
            method: method,
            headers: headers,
            body: body == null ? JSON.stringify(params) : body
        });
    } else {
        res = await fetch(buildPath(url, params), {
            method: method,
            headers: headers
        });
    }
    if (!res.ok) {
        if (res.status === 401) {
            if (typeof document !== 'undefined') {
                removeCookie('token');
            }
        }

        return {
            "code": 1,
            "success": false,
            "message": res.status + " " + res.statusText,
            "data": null
        }
    } else {
        return res.json();
    }
}
