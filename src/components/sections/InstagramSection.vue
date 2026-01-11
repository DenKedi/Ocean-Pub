<template>
  <section class="instagram-section theme-section-bg">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title theme-text-primary">@pallas_world</h2>
        <div class="title-line"></div>
      </div>

      <div class="instagram-container">
        <!-- Single Instagram Post Display -->
        <div class="instagram-display">
          <!-- Post 1 -->
          <div class="instagram-post" v-show="currentPost === 0">
            <iframe 
              src="https://www.instagram.com/p/DOjDLNljI_2/embed"
              frameborder="0"
              scrolling="no"
              allowtransparency="true"
              loading="lazy"
              class="theme-item-bg"
            ></iframe>
          </div>

          <!-- Post 2 -->
          <div class="instagram-post" v-show="currentPost === 1">
            <iframe 
              src="https://www.instagram.com/p/DNqBsR9M_l1/embed"
              frameborder="0"
              scrolling="no"
              allowtransparency="true"
              loading="lazy"
              class="theme-item-bg"
            ></iframe>
          </div>
        </div>

        <!-- Minimal Navigation -->
        <div class="navigation">
          <div class="nav-dots">
            <span 
              v-for="index in totalPosts" 
              :key="index"
              @click="goToPost(index - 1)"
              :class="['dot', { active: currentPost === index - 1 }]"
            ></span>
          </div>
          
          <div class="nav-arrows">
            <div @click="previousPost" class="arrow prev theme-item-bg theme-text-secondary">‹</div>
            <div @click="nextPost" class="arrow next theme-item-bg theme-text-secondary">›</div>
          </div>
        </div>

        <!-- Follow Link -->
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
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'InstagramSection',
  setup() {
    const currentPost = ref(0)
    const totalPosts = 2
    let autoRotateInterval = null

    // Einfache Navigation - kein Script Loading nötig!
    const nextPost = () => {
      currentPost.value = (currentPost.value + 1) % totalPosts
    }

    const previousPost = () => {
      currentPost.value = currentPost.value === 0 ? totalPosts - 1 : currentPost.value - 1
    }

    const goToPost = (index) => {
      currentPost.value = index
    }

    // Auto-rotation
    const startAutoRotate = () => {
      autoRotateInterval = setInterval(() => {
        nextPost()
      }, 6000) // 6 Sekunden
    }

    const stopAutoRotate = () => {
      if (autoRotateInterval) {
        clearInterval(autoRotateInterval)
        autoRotateInterval = null
      }
    }

    // Lifecycle
    onMounted(() => {
      // Instagram script für blockquotes
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      } else {
        const script = document.createElement('script');
        script.src = '//www.instagram.com/embed.js';
        script.async = true;
        document.head.appendChild(script);
        script.onload = () => {
          if (window.instgrm) {
            window.instgrm.Embeds.process();
          }
        };
      }
      // Auto-Rotation starten
      startAutoRotate()
    })

    onUnmounted(() => {
      stopAutoRotate()
    })

    return {
      currentPost,
      totalPosts,
      nextPost,
      previousPost,
      goToPost,
      startAutoRotate,
      stopAutoRotate
    }
  }
}
</script>

<style scoped>
.instagram-section {
  padding: 120px 0;
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

.instagram-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.02) 50%, transparent 51%),
    linear-gradient(-45deg, transparent 49%, rgba(255, 255, 255, 0.02) 50%, transparent 51%);
  background-size: 60px 60px;
  pointer-events: none;
  opacity: 0.3;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 2;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-title {
  font-family: 'Montserrat', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 100;
  margin: 0;
  letter-spacing: 8px;
  text-transform: lowercase;
  position: relative;
}

.title-line {
  width: 100px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--theme-border), transparent);
  margin: 30px auto 0;
  position: relative;
}

.title-line::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  background: var(--theme-text-primary);
  border-radius: 50%;
}

.instagram-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
}

.instagram-display {
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 650px;
  perspective: 1000px;
}

.instagram-post {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: translateZ(-50px) rotateY(10deg);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  filter: blur(2px);
}

.instagram-post:nth-child(1) { z-index: 3; }
.instagram-post:nth-child(2) { z-index: 2; }
.instagram-post:nth-child(3) { z-index: 1; }

.instagram-post[style*="block"], 
.instagram-post:not([style*="none"]) {
  opacity: 1;
  transform: translateZ(0) rotateY(0deg);
  filter: blur(0);
}

.instagram-post iframe {
  width: 100%;
  height: 100%;
  border: 1px solid var(--theme-border);
  backdrop-filter: blur(10px);
  transition: all 0.4s ease;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.instagram-post iframe:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 35px 70px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.navigation {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-top: 20px;
}

.nav-dots {
  display: flex;
  gap: 12px;
}

.dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
}

.dot::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.4s ease;
  opacity: 0;
}

.dot:hover::before {
  opacity: 1;
}

.dot.active {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 
    0 0 20px rgba(255, 255, 255, 0.3),
    0 0 40px rgba(255, 255, 255, 0.1);
}

.nav-arrows {
  display: flex;
  gap: 20px;
}

.arrow {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--theme-border);
  font-size: 20px;
  font-weight: 100;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.arrow::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.arrow:hover {
  transform: translateY(-2px);
}

.arrow:hover::before {
  left: 100%;
}

.arrow:active {
  transform: translateY(0);
}

.follow-section {
  text-align: center;
}

.follow-link {
  display: inline-block;
  padding: 16px 60px;
  border: 1px solid var(--theme-border);
  text-decoration: none;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 3px;
  text-transform: uppercase;
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
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.1), 
    rgba(255, 255, 255, 0.05)
  );
  transition: width 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.follow-link:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  letter-spacing: 4px;
}

.follow-link:hover::before {
  width: 100%;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .instagram-section {
    padding: 80px 0;
  }

  .container {
    padding: 0 20px;
  }

  .section-header {
    margin-bottom: 60px;
  }

  .section-title {
    font-size: 2.5rem;
    letter-spacing: 4px;
  }

  .instagram-display {
    max-width: 100%;
    height: 550px;
  }

  .navigation {
    gap: 30px;
    flex-direction: column;
  }

  .nav-arrows {
    order: -1;
  }

  .arrow {
    width: 45px;
    height: 45px;
    font-size: 18px;
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

  .instagram-display {
    height: 480px;
  }

  .instagram-container {
    gap: 40px;
  }

  .arrow {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .follow-link {
    padding: 12px 30px;
    letter-spacing: 1px;
  }
}
</style>