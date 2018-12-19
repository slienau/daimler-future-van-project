import axios from 'axios'
import {AsyncStorage} from 'react-native'

const api = axios.create({
  baseURL: 'http://40.89.153.255:8080',
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

function setAuthToken(token) {
  api.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

export async function loadToken() {
  const token = await AsyncStorage.getItem('token')
  if (!token) return false
  setAuthToken(token)
  return !!token
}

export async function setToken(token) {
  await AsyncStorage.setItem('token', token)
  setAuthToken(token)
}

export async function clearToken() {
  await AsyncStorage.removeItem('token')
}
