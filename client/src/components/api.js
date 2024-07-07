import axios from 'axios';

const MAX_DATA_LENGTH = 10000;
const isLocal = !/Android/i.test(navigator.userAgent) && (window.location.hostname === 'localhost' || window.location.hostname === process.env.REACT_APP_PRIVATE_ADDRESS);
const BASE_URL = isLocal ? `http://${process.env.REACT_APP_PRIVATE_ADDRESS}:8080/api` : `https://${process.env.REACT_APP_PUBLIC_ADDRESS}/api`;
const auth = { username: process.env.REACT_APP_SERVER_USERNAME, password: process.env.REACT_APP_SERVER_PASSWORD };
const config = {
  headers: {
    'Authorization': 'Basic ' + btoa(`${auth.username}:${auth.password}`),
    'Content-Type': 'application/json'
  }
};

export const post = (url, data) => {
  if (JSON.stringify(data).length > MAX_DATA_LENGTH) {
    return Promise.resolve({ data: `Data exceeds maximum length of ${MAX_DATA_LENGTH} characters.` });
  } else {
    return axios.post(BASE_URL + url, data, config);
  }
};

export const get = (url) => {
  return axios.get(BASE_URL + url, config);
};
