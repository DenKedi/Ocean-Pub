<template>
  <section id="speisekarte" class="content-section theme-section-bg">
    <div class="container">
      <h2 class="section-title theme-text-primary pallas-heading">PALLAS.WORLD Kulinarik</h2>
      <div class="menu-categories">
        <div class="menu-category theme-container-bg">
          <h3 class="theme-text-primary">Restaurant Experience</h3>
          <div class="menu-item">
            <div class="item-info">
              <h4 class="theme-text-primary">PALLAS World Bowl</h4>
              <p class="theme-text-secondary">Internationale Aromen vereint in einer Schüssel</p>
            </div>
            <span class="price theme-item-bg theme-text-secondary">16€</span>
          </div>
          <div class="menu-item">
            <div class="item-info">
              <h4 class="theme-text-primary">Unity Sharing Plate</h4>
              <p class="theme-text-secondary">Gemeinsam genießen verbindet Kulturen</p>
            </div>
            <span class="price theme-item-bg theme-text-secondary">24€</span>
          </div>
          <div class="menu-item">
            <div class="item-info">
              <h4 class="theme-text-primary">Street Food Journey</h4>
              <p class="theme-text-secondary">Eine kulinarische Reise um die Welt</p>
            </div>
            <span class="price theme-item-bg theme-text-secondary">12€</span>
          </div>
        </div>
        
        <div class="menu-category theme-container-bg">
          <h3 class="theme-text-primary">Bar Signatures</h3>
          <div class="menu-item">
            <div class="item-info">
              <h4 class="theme-text-primary">Everybody Welcome</h4>
              <p class="theme-text-secondary">Unser Hauscocktail für alle Menschen</p>
            </div>
            <span class="price theme-item-bg theme-text-secondary">12€</span>
          </div>
          <div class="menu-item">
            <div class="item-info">
              <h4 class="theme-text-primary">PALLAS Unity</h4>
              <p class="theme-text-secondary">Ein Cocktail, der Welten verbindet</p>
            </div>
            <span class="price theme-item-bg theme-text-secondary">13€</span>
          </div>
          <div class="menu-item">
            <div class="item-info">
              <h4 class="theme-text-primary">Hamburg Spirit</h4>
              <p class="theme-text-secondary">Die Seele der Stadt im Glas</p>
            </div>
            <span class="price theme-item-bg theme-text-secondary">14€</span>
          </div>
        </div>

        <div class="menu-category theme-container-bg">
          <h3 class="theme-text-primary">Club Vibes</h3>
          <div class="menu-item">
            <div class="item-info">
              <h4 class="theme-text-primary">Dance Floor Energy</h4>
              <p class="theme-text-secondary">Perfekt für lange Nächte gemacht</p>
            </div>
            <span class="price theme-item-bg theme-text-secondary">10€</span>
          </div>
          <div class="menu-item">
            <div class="item-info">
              <h4 class="theme-text-primary">Night Owl Special</h4>
              <p class="theme-text-secondary">Für alle, die die Nacht zum Tag machen</p>
            </div>
            <span class="price theme-item-bg theme-text-secondary">9€</span>
          </div>
          <div class="menu-item">
            <div class="item-info">
              <h4 class="theme-text-primary">After Party Relief</h4>
              <p class="theme-text-secondary">Sanfter Ausklang für perfekte Nächte</p>
            </div>
            <span class="price theme-item-bg theme-text-secondary">8€</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.content-section {
  border-top: 1px solid var(--theme-border);
  position: relative;
}

.content-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 15% 30%, rgba(255, 255, 255, 0.01) 0%, transparent 60%),
    radial-gradient(circle at 85% 70%, rgba(255, 255, 255, 0.015) 0%, transparent 60%);
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 8rem 2rem;
  position: relative;
  z-index: 1;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  text-align: center;
  margin-bottom: 5rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  text-shadow: 0 0 40px rgba(255, 255, 255, 0.1);
  position: relative;
  color: #ffffff !important;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--theme-border), transparent);
}

.menu-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 3rem;
}

.menu-category {
  padding: 3rem 2.5rem;
  border-radius: 4px;
  border: 1px solid var(--theme-border);
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
  overflow: hidden;
  background: transparent !important;
  box-shadow: 
    0 8px 40px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.menu-category::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.015), transparent);
  transition: left 0.8s ease;
}

.menu-category:hover::before {
  left: 100%;
}

.menu-category:hover {
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(255, 255, 255, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.menu-category h3 {
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  font-weight: 100;
  text-align: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--theme-border);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  opacity: 0.95;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem 0;
  border-bottom: 1px solid var(--theme-border);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  position: relative;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  padding-left: 1rem;
}

.menu-item:hover::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, transparent, var(--theme-border), transparent);
}

.item-info h4 {
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
  font-weight: 200;
  letter-spacing: 0.05em;
  font-family: 'Montserrat', sans-serif;
  opacity: 0.95;
}

.item-info p {
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
  font-weight: 200;
  font-family: 'Source Sans 3', sans-serif;
  letter-spacing: 0.01em;
}

.price {
  font-size: 1.1rem;
  font-weight: 100;
  flex-shrink: 0;
  margin-left: 1.5rem;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.1em;
  padding: 0.3rem 0.8rem;
  border: 1px solid var(--theme-border);
  border-radius: 1px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

/* Mobile Optimization */
@media (max-width: 768px) {
  .container {
    padding: 5rem 1rem;
  }
  
  .menu-categories {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  
  .menu-category {
    padding: 2.5rem 2rem;
  }
  
  .menu-item {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    padding: 1.5rem 0;
  }
  
  .price {
    margin-left: 0;
    align-self: flex-end;
  }
}
</style>