import axios from "axios";
axios.defaults.timeout = 5000;
axios.defaults.baseURL = "/api/";
//axios.defaults.baseURL = 'http://localhost:3000'
export function get(url, params) {
  return new Promise(resolve => {
    axios
      .get(url, {
        params: params,
        withCredentials: true
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(() => {
        resolve({
          code: 400
        });
      });
  });
}

export function post(url, params) {
  return new Promise(resolve => {
    axios
      .post(url, JSON.stringify(params), {
        withCredentials: true
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(() => {});
  });
}
