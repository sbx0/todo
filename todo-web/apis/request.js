import {getCookie, removeCookie} from "./cookies";

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

export async function callApi({
                                  method = 'GET',
                                  url,
                                  params,
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
            body: JSON.stringify(params)
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