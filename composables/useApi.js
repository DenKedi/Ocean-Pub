import axios from 'axios'

export default function useApi() {
  const config = useRuntimeConfig()
  
  const api = axios.create({
    baseURL: config.public.apiBaseUrl,
    withCredentials: true,
  })

  // Token an jede Anfrage hängen
  api.interceptors.request.use(cfg => {
    if (import.meta.client) {
      const token = localStorage.getItem('token')
      if (token) cfg.headers['x-auth-token'] = token
    }
    return cfg
  })

  // 401 global abfangen
  api.interceptors.response.use(
    res => res,
    err => {
      if (import.meta.client && err?.response?.status === 401) {
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
