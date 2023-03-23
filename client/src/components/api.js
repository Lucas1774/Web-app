import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === process.env.REACT_APP_PRIVATE_ADDRESS;
const BASE_URL = isLocal ? `http://${process.env.REACT_APP_PRIVATE_ADDRESS}:8080/api` : `http://${process.env.REACT_APP_PUBLIC_ADDRESS}:8080/api`;
const auth = {username: 'user', password: 'password'};
const config = {
  headers: {
    'Authorization': 'Basic ' + btoa(`${auth.username}:${auth.password}`),
    'Content-Type': 'application/json'
  }
};

export function post(url, data) {
  return axios.post(BASE_URL + url, data, config);
}

export function get(url) {
  return axios.get(BASE_URL + url, config);
}
