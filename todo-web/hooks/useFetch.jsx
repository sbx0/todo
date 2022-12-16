import {useEffect, useState} from "react";

export default function useFetch({method, url, params, active, setLoading, initData}) {
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [data, setData] = useState(initData);
    const [totalPage, setTotalPage] = useState(1);

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
            let begin = Date.now();
            setLoading(true);
            if (method === 'POST') {
                fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params)
                }).then(response => response.json()).then(json => {
                    if (!ignore) {
                        if (params?.page != null && params.page > 1) {
                            setData(data.concat(json.data));
                        } else {
                            setData(json.data);
                        }
                        setTotalPage(json?.common?.totalPage);
                    }
                }).finally(() => {
                    let end = Date.now();
                    let useTime = end - begin;
                    if (useTime < 200) {
                        setTimeout(() => {
                            setLoading(false);
                        }, 200 - useTime);
                    } else {
                        setLoading(false);
                    }
                });
            } else {
                url = buildCacheKey(url, params);
                fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(response => response.json()).then(json => {
                    if (!ignore) {
                        if (params?.page != null && params.page > 1) {
                            setData(data.concat(json.data));
                        } else {
                            setData(json.data);
                        }
                        setTotalPage(json?.common?.totalPage);
                    }
                }).finally(() => {
                    let end = Date.now();
                    let useTime = end - begin;
                    if (useTime < 200) {
                        setTimeout(() => {
                            setLoading(false);
                        }, 200 - useTime);
                    } else {
                        setLoading(false);
                    }
                });
            }
            return () => {
                ignore = true;
            };
        }
    }, [buildCacheKey(url, params), refreshFlag]);

    return {data, refresh, totalPage, setData};
}
