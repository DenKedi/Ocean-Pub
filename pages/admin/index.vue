<script setup>
import { ref, onMounted } from 'vue'

const router = useRouter()
const { state, login, isLoggedIn } = useAuth()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

onMounted(() => {
  // Wenn bereits eingeloggt, zum Dashboard weiterleiten
  if (isLoggedIn()) {
    router.push('/admin/dashboard')
  }
})

async function handleSubmit() {
  if (!email.value || !password.value) {
    error.value = 'Bitte E-Mail und Passwort eingeben'
    return
  }

  loading.value = true
  error.value = ''

  const result = await login(email.value, password.value)
  
  loading.value = false

  if (result.success) {
    router.push('/admin/dashboard')
  } else {
    error.value = result.error
  }
}
</script>

<template>
  <div class="admin-login">
    <div class="login-container">
      <div class="login-header">
        <h1>Admin Login</h1>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email">E-Mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="admin@pallas.de"
            autocomplete="email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Passwort</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            required
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading">Anmeldung...</span>
          <span v-else>Anmelden</span>
        </button>
      </form>

      <div class="login-footer">
        <NuxtLink to="/">← Zurück zur Website</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 2rem;
}

.login-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 3rem;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  color: #fff;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
}

.form-group input {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 0.875rem 1rem;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.form-group input:focus {
  outline: none;
  border-color: #646cff;
  background: rgba(255, 255, 255, 0.12);
}

.error-message {
  background: rgba(255, 82, 82, 0.15);
  border: 1px solid rgba(255, 82, 82, 0.3);
  color: #ff5252;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
}

.login-btn {
  background: linear-gradient(135deg, #646cff 0%, #535bf2 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(100, 108, 255, 0.3);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 2rem;
  text-align: center;
}

.login-footer a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.login-footer a:hover {
  color: #646cff;
}
</style>
