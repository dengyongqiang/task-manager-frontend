import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.response.use(
  (response) => {
    const body = response.data
    if (body.code === 200) return body.data
    return Promise.reject(new Error(body.message))
  },
  (error) => Promise.reject(error),
)

export default request
