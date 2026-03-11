<template>
  <section class="instagram-section theme-section-bg">
    <div class="container">
      <div class="instagram-container">
        <div class="instagram-column instagram-column-left">
          <div class="section-header">
            <h2 class="section-title theme-text-primary">@pallas_world</h2>
          </div>

          <div class="instagram-post post-left">
            <iframe 
              :src="`https://www.instagram.com/p/${postLeft}/embed/?img_index=1`"
              frameborder="0"
              scrolling="no"
              allowtransparency="true"
              loading="lazy"
              allow="encrypted-media; fullscreen"
            ></iframe>
          </div>
        </div>

        <div class="instagram-column instagram-column-right">
          <div class="instagram-post post-right">
            <iframe 
              :src="`https://www.instagram.com/p/${postRight}/embed/?img_index=1`"
              frameborder="0"
              scrolling="no"
              allowtransparency="true"
              loading="lazy"
              allow="encrypted-media; fullscreen"
            ></iframe>
          </div>

          <div class="follow-section">
            <a 
              href="https://www.instagram.com/pallas_world/" 
              target="_blank" 
              rel="noopener noreferrer"
              class="follow-link theme-button theme-text-primary"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" style="margin-right: 0.5rem;">
                <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow on Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const postLeft = ref('DRP6UlhjnMN')
const postRight = ref('DVTYNbNDATB')

onMounted(async () => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/settings`)
    if (data?.instagram?.postLeft) postLeft.value = data.instagram.postLeft
    if (data?.instagram?.postRight) postRight.value = data.instagram.postRight
  } catch {
    // keep defaults
  }

  if (window.instgrm) {
    window.instgrm.Embeds.process()
  } else {
    const script = document.createElement('script')
    script.src = '//www.instagram.com/embed.js'
    script.async = true
    document.head.appendChild(script)
    script.onload = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process()
      }
    }
  }
})
</script>

<style scoped>
.instagram-section {
  padding: 120px 0;
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 2;
}

.section-header {
  margin-bottom: 3rem;
}

.section-title {
  font-family: 'Montserrat', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 100;
  margin: 0;
  letter-spacing: 8px;
  text-transform: lowercase;
  text-align: left;
  max-width: 400px;
}

.instagram-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4rem;
  align-items: start;
}

.instagram-column {
  display: flex;
  flex-direction: column;
}

.instagram-column-left {
  padding-top: 7rem;
  align-items: flex-start;
}

.instagram-column-right {
  align-items: flex-end;
  gap: 3.5rem;
}

.instagram-post {
  width: 400px;
  height: 480px;
  overflow: hidden;
}

.post-right {
  align-self: flex-end;
}

.post-left {
  align-self: flex-start;
}

.instagram-post iframe {
  width: 100%;
  height: 100%;
  border: none;
  box-shadow: none;
}

.follow-section {
  width: 400px;
  text-align: center;
}

.follow-link {
  display: inline-flex;
  align-items: center;
  padding: 16px 60px;
  border: 1px solid var(--theme-border);
  text-decoration: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 3px;
  text-transform: uppercase;
  white-space: nowrap;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  backdrop-filter: blur(15px);
  position: relative;
  overflow: hidden;
}

.follow-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  transition: width 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.follow-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  letter-spacing: 4px;
}

.follow-link:hover::before {
  width: 100%;
}

/* Mobile */
@media (max-width: 768px) {
  .instagram-section {
    padding: 80px 0;
  }

  .container {
    padding: 0 20px;
  }

  .section-header {
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 2.5rem;
    letter-spacing: 4px;
    text-align: center;
  }

  .instagram-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .instagram-column-left,
  .instagram-column-right {
    padding-top: 0;
    align-items: center;
    gap: 2rem;
  }

  .instagram-post {
    width: 100%;
    height: 520px;
    max-width: 400px;
  }

  .follow-section {
    width: 100%;
    max-width: 400px;
  }

  .follow-link {
    padding: 14px 40px;
    font-size: 12px;
    letter-spacing: 2px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }

  .section-title {
    font-size: 2rem;
    letter-spacing: 3px;
  }

  .instagram-post {
    height: 460px;
  }

  .follow-link {
    padding: 12px 30px;
    letter-spacing: 1px;
  }
}
</style>