<template>
  <section class="instagram-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Instagram</h2>
        <p class="section-description">Folge uns auf Instagram für die neuesten Updates</p>
      </div>

      <div class="instagram-grid">
        <!-- Instagram Carousel -->
        <div class="instagram-carousel">
          <div class="carousel-container">
            <!-- Post 1 -->
            <div class="instagram-post-preview" :class="{ active: currentPost === 0 }">
              <div class="post-preview">
                <div class="post-header">
                  <div class="profile-pic">
                    <span class="profile-emoji">🏢</span>
                  </div>
                  <div class="profile-info">
                    <h4 class="profile-name">PALLAS | Bar | Club</h4>
                    <span class="profile-handle">@pallas_world</span>
                  </div>
                  <div class="instagram-logo">📸</div>
                </div>
                <div class="post-content">
                  <div class="post-image">
                    <span class="post-emoji">🌟</span>
                    <div class="post-overlay">
                      <span class="play-icon">▶</span>
                    </div>
                  </div>
                  <div class="post-actions">
                    <span class="action-icon">❤️</span>
                    <span class="action-icon">💬</span>
                    <span class="action-icon">📤</span>
                  </div>
                  <div class="post-likes">Gefällt 142 Personen</div>
                  <div class="post-caption">
                    <strong>pallas_world</strong> Neues aus der PALLAS.WORLD! 🌍✨
                    <span class="post-hashtags">#PallasWorld #EverybodyWelcome #Hamburg</span>
                  </div>
                </div>
                <a 
                  href="https://www.instagram.com/p/DOjDLNljI_2/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="post-link"
                >
                  Auf Instagram ansehen
                </a>
              </div>
            </div>

            <!-- Post 2 -->
            <div class="instagram-post-preview" :class="{ active: currentPost === 1 }">
              <div class="post-preview">
                <div class="post-header">
                  <div class="profile-pic">
                    <span class="profile-emoji">🏢</span>
                  </div>
                  <div class="profile-info">
                    <h4 class="profile-name">PALLAS | Bar | Club</h4>
                    <span class="profile-handle">@pallas_world</span>
                  </div>
                  <div class="instagram-logo">📸</div>
                </div>
                <div class="post-content">
                  <div class="post-image">
                    <span class="post-emoji">🍸</span>
                    <div class="post-overlay">
                      <span class="play-icon">▶</span>
                    </div>
                  </div>
                  <div class="post-actions">
                    <span class="action-icon">❤️</span>
                    <span class="action-icon">💬</span>
                    <span class="action-icon">📤</span>
                  </div>
                  <div class="post-likes">Gefällt 89 Personen</div>
                  <div class="post-caption">
                    <strong>pallas_world</strong> Cocktail Vibes am Neuer Pferdemarkt! 🍹
                    <span class="post-hashtags">#Cocktails #Hamburg #BarLife</span>
                  </div>
                </div>
                <a 
                  href="https://www.instagram.com/p/DKCoo_ps0ig/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="post-link"
                >
                  Auf Instagram ansehen
                </a>
              </div>
            </div>

            <!-- Post 3 -->
            <div class="instagram-post-preview" :class="{ active: currentPost === 2 }">
              <div class="post-preview">
                <div class="post-header">
                  <div class="profile-pic">
                    <span class="profile-emoji">🏢</span>
                  </div>
                  <div class="profile-info">
                    <h4 class="profile-name">PALLAS | Bar | Club</h4>
                    <span class="profile-handle">@pallas_world</span>
                  </div>
                  <div class="instagram-logo">📸</div>
                </div>
                <div class="post-content">
                  <div class="post-image">
                    <span class="post-emoji">🎉</span>
                    <div class="post-overlay">
                      <span class="play-icon">▶</span>
                    </div>
                  </div>
                  <div class="post-actions">
                    <span class="action-icon">❤️</span>
                    <span class="action-icon">💬</span>
                    <span class="action-icon">📤</span>
                  </div>
                  <div class="post-likes">Gefällt 203 Personen</div>
                  <div class="post-caption">
                    <strong>pallas_world</strong> Weekend Vibes! Everybody Welcome 🌍
                    <span class="post-hashtags">#WeekendVibes #PartyTime #Unity</span>
                  </div>
                </div>
                <a 
                  href="https://www.instagram.com/p/DNqBsR9M_l1/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="post-link"
                >
                  Auf Instagram ansehen
                </a>
              </div>
            </div>
          </div>

          <!-- Navigation Controls -->
          <div class="carousel-controls">
            <button @click="previousPost" class="control-btn prev-btn" aria-label="Vorheriger Post">
              &#8249;
            </button>
            <div class="carousel-indicators">
              <button 
                v-for="index in totalPosts" 
                :key="index"
                @click="goToPost(index - 1)"
                :class="['indicator', { active: currentPost === index - 1 }]"
                :aria-label="`Post ${index} anzeigen`"
              ></button>
            </div>
            <button @click="nextPost" class="control-btn next-btn" aria-label="Nächster Post">
              &#8250;
            </button>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="instagram-cta">
          <div class="cta-content">
            <h3>Folge uns auf Instagram!</h3>
            <p>Verpasse keine Updates und sei Teil der PALLAS.WORLD Community</p>
            <a 
              href="https://www.instagram.com/pallas_world/" 
              target="_blank" 
              rel="noopener noreferrer"
              class="instagram-link"
            >
              @pallas_world folgen
            </a>
          </div>
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
    const totalPosts = 3
    let autoRotateInterval = null

    const nextPost = () => {
      currentPost.value = (currentPost.value + 1) % totalPosts
    }

    const previousPost = () => {
      currentPost.value = currentPost.value === 0 ? totalPosts - 1 : currentPost.value - 1
    }

    const goToPost = (index) => {
      currentPost.value = index
    }

    const startAutoRotate = () => {
      autoRotateInterval = setInterval(() => {
        nextPost()
      }, 5000) // Wechselt alle 5 Sekunden
    }

    const stopAutoRotate = () => {
      if (autoRotateInterval) {
        clearInterval(autoRotateInterval)
        autoRotateInterval = null
      }
    }

    onMounted(() => {
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
  padding: 100px 0;
  background: #111111;
  color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.section-description {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 1.2rem;
  color: #cccccc;
  max-width: 600px;
  margin: 0 auto;
}

.instagram-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  align-items: start;
}

.instagram-carousel {
  position: relative;
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.carousel-container {
  position: relative;
  height: 500px;
  overflow: hidden;
}

.instagram-post-preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.instagram-post-preview.active {
  opacity: 1;
  transform: translateX(0);
}

.post-preview {
  background: #ffffff;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #333;
}

.post-header {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eeeeee;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.profile-emoji {
  font-size: 20px;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-weight: 600;
  font-size: 14px;
  margin: 0;
  line-height: 1.2;
}

.profile-handle {
  color: #8e8e8e;
  font-size: 12px;
}

.instagram-logo {
  font-size: 20px;
}

.post-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-image {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.post-emoji {
  font-size: 60px;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
}

.post-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
}

.play-icon {
  color: white;
  font-size: 24px;
  margin-left: 4px;
}

.post-actions {
  display: flex;
  gap: 15px;
  padding: 0 15px;
  margin-bottom: 10px;
}

.action-icon {
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.action-icon:hover {
  transform: scale(1.1);
}

.post-likes {
  font-weight: 600;
  font-size: 14px;
  padding: 0 15px;
  margin-bottom: 10px;
}

.post-caption {
  padding: 0 15px;
  font-size: 14px;
  line-height: 1.4;
}

.post-hashtags {
  color: #0095f6;
  display: block;
  margin-top: 5px;
}

.post-link {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  color: white;
  text-decoration: none;
  padding: 12px 15px;
  font-weight: 600;
  text-align: center;
  transition: opacity 0.3s;
  margin-top: auto;
}

.post-link:hover {
  opacity: 0.9;
}

.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: #222222;
}

.control-btn {
  background: #333333;
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s;
}

.control-btn:hover {
  background: #555555;
  transform: scale(1.1);
}

.carousel-indicators {
  display: flex;
  gap: 10px;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: #555555;
  cursor: pointer;
  transition: all 0.3s;
}

.indicator.active {
  background: #ffffff;
  transform: scale(1.2);
}

.instagram-cta {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.cta-content h3 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: white;
}

.cta-content p {
  font-family: 'Source Sans 3', sans-serif;
  color: #cccccc;
  margin-bottom: 25px;
  line-height: 1.6;
}

.instagram-link {
  display: inline-block;
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  color: white;
  text-decoration: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s;
  box-shadow: 0 5px 15px rgba(240, 148, 51, 0.3);
}

.instagram-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(240, 148, 51, 0.5);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .instagram-section {
    padding: 60px 0;
  }

  .section-title {
    font-size: 2.2rem;
  }

  .instagram-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .carousel-container {
    height: 400px;
  }

  .post-image {
    height: 250px;
  }

  .post-emoji {
    font-size: 40px;
  }

  .instagram-cta {
    padding: 30px 20px;
  }

  .cta-content h3 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 15px;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .carousel-container {
    height: 350px;
  }

  .post-image {
    height: 200px;
  }

  .control-btn {
    width: 35px;
    height: 35px;
    font-size: 16px;
  }

  .instagram-cta {
    padding: 25px 15px;
  }
}
</style>