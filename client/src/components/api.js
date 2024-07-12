import axios from 'axios';

const BASE_URL = 'http://192.168.1.134:8080/api';
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
