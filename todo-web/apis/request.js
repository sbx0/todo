import {getCookie} from "./cookies";

function hash(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash.toString();
}

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
                                  method,
                                  url,
                                  params,
                                  headers = {
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