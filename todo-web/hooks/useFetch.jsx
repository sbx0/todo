import {useEffect, useState} from "react";

export default function useFetch(method, url, params, active) {
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [data, setData] = useState(null);

    const refresh = () => {
        setRefreshFlag(!refreshFlag);
    }

    const buildCacheKey = (url, params) => {
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

    useEffect(() => {
        if (active == null) {
            active = true;
        }
        if (url && active) {
            let ignore = false;
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params)
            }).then(response => response.json())
                .then(json => {
                    if (!ignore) {
                        setData(json.data);
                    }
                });
            return () => {
                ignore = true;
            };
        }
    }, [buildCacheKey(url, params), refreshFlag]);

    return {data, refresh};
}
