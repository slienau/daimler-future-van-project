import _ from 'lodash'
import axios from 'axios'
import {AsyncStorage} from 'react-native'

import config from './config'

const api = axios.create({
  baseURL: `http://${config.apiEndpoint}:8080/`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000, // timeout of 10 seconds
})

api.interceptors.request.use(
  config => {
    console.log(`🌍 ${_.toUpper(config.method)} ${config.url}`)
    return config
  },
  error => Promise.reject(error)
)

api.interceptors.response.use(null, async error => {
  if (
    _.get(error, 'config.loginRetry') ||
    _.get(error, 'response.status') !== 401
  ) {
    if (error.message.startsWith('timeout of ')) {
      error.code = 408
      error.message = 'Timeout exceeded. Please check your internet connection.'
      throw error
    }
    // set error message to response body error message if possible
    error.code = _.get(
      error,
      'response.data.code',
      _.get(error, 'response.status', 400)
    )
    error.message = _.get(error, 'response.data.message', error.message)
    throw error
  }
  try {
    await loginWithStoreCredentials()
    const retryConfig = {
      loginRetry: true,
      ..._.pick(error.config, ['url', 'method', 'baseURL', 'params', 'data']),
    }
    return api(retryConfig)
  } catch (e) {
    throw error
  }
})

export default api

function setAuthToken(token) {
  api.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

async function loadToken() {
  const token = await AsyncStorage.getItem('token')
  if (!token) return false
  setAuthToken(token)
  return true
}

export async function isTokenValid() {
  if (!(await loadToken())) return false
  try {
    const res = await api.get('/account')
    return res.status === 200
  } catch (e) {
    console.warn(e)
    return false
  }
}

export async function login(config, noCredStoreUpdate = false) {
  const {data} = await api.post(
    '/login',
    _.pick(config, ['username', 'password'])
  )
  setAuthToken(data.token)
  await AsyncStorage.setItem('token', data.token)
  if (noCredStoreUpdate) return
  await AsyncStorage.setItem('username', config.username)
  await AsyncStorage.setItem('password', config.password)
}

export async function loginWithStoreCredentials() {
  return login(
    {
      username: await AsyncStorage.getItem('username'),
      password: await AsyncStorage.getItem('password'),
    },
    true
  )
}

export async function logout() {
  delete api.defaults.headers.common['Authorization']
  await AsyncStorage.removeItem('token')
  await AsyncStorage.removeItem('password')
}
