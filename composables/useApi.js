import axios from 'axios'
import { useRouter } from 'vue-router'

export default function useApi() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5051/api'

  const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
  })

  // Token an jede Anfrage hängen
  api.interceptors.request.use(cfg => {
    const token = localStorage.getItem('token')
    if (token) cfg.headers['x-auth-token'] = token
    return cfg
  })

  // 401 global abfangen
  api.interceptors.response.use(
    res => res,
    err => {
      if (err?.response?.status === 401) {
        localStorage.removeItem('token')
        const router = useRouter()
        if (router.currentRoute.value.path !== '/') {
          router.push('/')
        }
      }
      return Promise.reject(err)
    }
  )

  return api
}
