import localForage from "localforage";

function hash(str) {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash.toString();
}

export async function listApi(params, cache) {
  let url = '/api/category/paging';
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
  let cacheKey = hash(url);
  if (cache) {
    let cacheTime = await localForage.getItem('cacheTime' + cacheKey);
    if (cacheTime != null) {
      let now = Date.now();
      let milliseconds = now - cacheTime;
      let seconds = milliseconds / 1000;
      if (seconds < 60) {
        let cacheData = await localForage.getItem(cacheKey);
        if (cacheData != null) {
          return cacheData;
        }
      }
    }
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
  let json = res.json();
  await localForage.setItem(cacheKey, json);
  await localForage.setItem('cacheTime' + cacheKey, Date.now());
  return json;
}

export async function saveApi(params) {
  const res = await fetch('/api/category/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export async function updateApi(params) {
  const res = await fetch('/api/category/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
  return res.json();
}
