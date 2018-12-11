import axios from 'axios'

const api = axios.create({
  baseURL: 'http://40.89.170.229:8080',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default api
