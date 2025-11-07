<template>
  <section id="instagram" class="content-section">
    <div class="container">
      <h2 class="section-title pallas-heading">Folge uns auf Instagram</h2>
      <p class="section-subtitle">@pallas_world - Erlebe PALLAS.WORLD live!</p>
      
      <div class="instagram-grid">
        <!-- Instagram Carousel -->
        <div class="instagram-carousel">
          <div class="carousel-container" ref="carouselContainer">
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

          <!-- Carousel Controls -->
          <div class="carousel-controls">
            <button 
              v-for="(post, index) in 3" 
              :key="index"
              class="carousel-dot" 
              :class="{ active: currentPost === index }"
              @click="goToPost(index)"
            >
              {{ index + 1 }}
            </button>
          </div>

          <!-- Navigation Arrows -->
          <button class="carousel-arrow carousel-prev" @click="previousPost">
            ❮
          </button>
          <button class="carousel-arrow carousel-next" @click="nextPost">
            ❯
          </button>
        </div>

        <!-- Call to Action -->
        <div class="instagram-cta">
          <div class="cta-content">
            <h3 class="cta-title">@pallas_world</h3>
            <p class="cta-description">
              Verpasse keine Momente! Folge uns auf Instagram und erlebe PALLAS.WORLD 
              aus einer anderen Perspektive. Von Events über kulinarische Highlights 
              bis hin zu spontanen Sessions – sei Teil unserer Community.
            </p>
            <div class="cta-buttons">
              <a 
                href="https://www.instagram.com/pallas_world/" 
                target="_blank" 
                rel="noopener noreferrer"
                class="instagram-button"
              >
                <span class="instagram-icon">📸</span>
                Folgen auf Instagram
              </a>
              <a 
                href="https://www.instagram.com/p/DOjDLNljI_2/" 
                target="_blank" 
                rel="noopener noreferrer"
                class="post-button"
              >
                Post ansehen
              </a>
            </div>
            <div class="hashtags">
              <span class="hashtag">#PallasWorld</span>
              <span class="hashtag">#EverybodyWelcome</span>
              <span class="hashtag">#Hamburg</span>
              <span class="hashtag">#BarClubRestaurant</span>
            </div>
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
      } catch (error) {
        console.warn('Initial Instagram load failed:', error)
      }
    })

    onUnmounted(() => {
      stopAutoRotate()
    })

    return {
      currentPost,
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
.content-section {
  padding: 5rem 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(15px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  color: white;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 300;
  letter-spacing: 0.1em;
}

.section-subtitle {
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 4rem;
  font-weight: 300;
}

.instagram-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.instagram-carousel {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
}

.carousel-container {
  position: relative;
  width: 100%;
  max-width: 540px;
  overflow: hidden;
  border-radius: 10px;
}

.instagram-post {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.instagram-post.active {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}

.carousel-controls {
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 10;
}

.carousel-dot {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-dot:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.1);
}

.carousel-dot.active {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  border-color: white;
  color: white;
  transform: scale(1.2);
  box-shadow: 0 5px 20px rgba(240, 148, 51, 0.4);
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-arrow:hover {
  background: rgba(0, 0, 0, 0.9);
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-50%) scale(1.1);
}

.carousel-prev {
  left: -70px;
}

.carousel-next {
  right: -70px;
}

.instagram-cta {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.cta-content {
  text-align: center;
}

.cta-title {
  color: white;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  letter-spacing: 0.05em;
}

.cta-description {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.cta-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.instagram-button {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.instagram-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(240, 148, 51, 0.3);
}

.instagram-icon {
  font-size: 1.2rem;
}

.post-button {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.post-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.hashtags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.hashtag {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Mobile Optimization */
@media (max-width: 968px) {
  .instagram-grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .instagram-cta {
    padding: 2rem;
  }
  
  .content-section {
    padding: 3rem 0;
  }
  
  .carousel-arrow {
    display: none; /* Pfeile auf Mobile ausblenden */
  }
  
  .carousel-controls {
    bottom: -50px;
  }
  
  .carousel-dot {
    width: 40px;
    height: 40px;
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .cta-buttons {
    gap: 0.8rem;
  }
  
  .hashtags {
    gap: 0.3rem;
  }
  
  .hashtag {
    font-size: 0.8rem;
    padding: 0.2rem 0.6rem;
  }
  
  .instagram-carousel {
    min-height: 500px;
  }
  
  .carousel-controls {
    gap: 0.8rem;
  }
  
  .carousel-dot {
    width: 35px;
    height: 35px;
    font-size: 0.8rem;
  }
}

/* Instagram Embed Responsive Styling */
@media (max-width: 540px) {
  .instagram-post :deep(.instagram-media) {
    min-width: 280px !important;
    max-width: 100% !important;
  }
  
  .instagram-carousel {
    min-height: 450px;
  }
  
  .carousel-controls {
    bottom: -40px;
    gap: 0.5rem;
  }
  
  .carousel-dot {
    width: 30px;
    height: 30px;
    font-size: 0.7rem;
  }
}
</style>