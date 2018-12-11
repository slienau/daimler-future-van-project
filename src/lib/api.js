import axios from 'axios'

const api = axios.create({
  baseURL: 'http://40.89.170.229:8080',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  config => {
    console.log('🌍', config.url)
    return config
  },
  error => Promise.reject(error)
)

export default api

export function setToken(token) {
  api.defaults.headers.common['Authorization'] = 'Bearer ' + token
}
