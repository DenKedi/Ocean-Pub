const fs = require('fs');

let content = fs.readFileSync('pages/events.vue', 'utf8');

// Replace dark page background
content = content.replace(
  '<div ref="eventsPage" class="events-page">',
  '<div ref="eventsPage" class="events-page theme-section-bg">'
);

// Remove the old parallax background and insert beach background
content = content.replace(
  /<div ref="backgroundLayer" class="background-layer">[\s\S]*?<\/div>/,
  `<!-- Decorative Beach Vibe Background -->
      <div class="beach-background" aria-hidden="true">
        <div class="beach-sun"></div>
        <svg class="beach-waves" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path class="wave wave--back" d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,224C672,224,768,192,864,186.7C960,181,1056,203,1152,213.3C1248,224,1344,224,1392,224L1440,224L1440,320L0,320Z" />
          <path class="wave wave--mid" d="M0,256L48,250.7C96,245,192,235,288,229.3C384,224,480,224,576,234.7C672,245,768,267,864,266.7C960,267,1056,245,1152,240C1248,235,1344,245,1392,250.7L1440,256L1440,320L0,320Z" />
          <path class="wave wave--front" d="M0,288L48,282.7C96,277,192,267,288,272C384,277,480,299,576,298.7C672,299,768,277,864,277.3C960,277,1056,299,1152,298.7C1248,299,1344,277,1392,266.7L1440,256L1440,320L0,320Z" />
        </svg>
      </div>`
);

// Switch titles and typography classes
content = content.replace(
  '<h1 class="page-title">',
  '<h1 class="page-title theme-text-primary">'
);

// Replace hardcoded colors with variables
content = content.replace(/background:\s*#000000;/g, '');
content = content.replace(/color:\s*#fff\s*!important;/g, 'color: var(--theme-textPrimary) !important;');
content = content.replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.5\)\s*!important;/g, 'color: var(--theme-textSecondary) !important;');
content = content.replace(/color:\s*rgba\(255,\s*255,\s*255,\s*0\.6\);/g, 'color: var(--theme-textSecondary);');
content = content.replace(/border: 1px solid rgba\(255, 255, 255, 0\.15\);/g, 'border: 1px solid var(--theme-border);');

content = content.replace(
  /\.events-page\s*{[^}]*}/,
  `.events-page {
  min-height: 100vh;
  position: relative;
  isolation: isolate;
  overflow: hidden;
}`
);

// Update event-card 
content = content.replace(
  /<div\s+v-for="event in group.events"[\s\S]*?class="event-card"/g,
  '<div v-for="event in group.events" :key="event._id" :id="\'event-\' + event._id" class="event-card theme-item-bg"'
);

// Update grid and list structures
content = content.replace(
  /<div\s+v-for="event in events"[\s\S]*?class="event-card"/g,
  '<div v-for="event in events" :key="event._id" :id="\'event-\' + event._id" class="event-card theme-item-bg"'
);

// Also need to inject beach background styles right after <style scoped>
const beachBackgroundStyles = `
/* Beach decorative background */
.beach-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50vh;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  background: linear-gradient(180deg, var(--beach-sky) 0%, transparent 100%);
}

.beach-sun {
  position: absolute;
  top: 4rem;
  right: 15%;
  width: clamp(120px, 20vw, 200px);
  aspect-ratio: 1;
  background: radial-gradient(circle at center, var(--beach-sun) 0%, var(--beach-sun-deep) 100%);
  border-radius: 50%;
  filter: blur(8px);
  opacity: 0.8;
  mix-blend-mode: overlay;
}

.beach-waves {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: clamp(80px, 15vw, 150px);
  transform: translateY(2px); /* overlap prevention */
}

.wave {
  fill: var(--theme-sectionBg);
}
.wave--back { opacity: 0.3; }
.wave--mid { opacity: 0.6; }
.wave--front { opacity: 1; }
`;

content = content.replace('<style scoped>', '<style scoped>\n' + beachBackgroundStyles);

// Remove hardcoded black background on event-image
content = content.replace(/background-color: #111;/g, 'background-color: transparent;');
content = content.replace(/background: #111;/g, 'background: transparent;');
content = content.replace(/background: rgba\(17, 17, 17, 0\.9\);/g, 'background: var(--theme-containerBg); border-right: 1px solid var(--theme-border);');

// Clean up border bottoms / gradients
content = content.replace(/linear-gradient\(90deg, transparent, #FF9d66, transparent\);/g, 'linear-gradient(90deg, transparent, var(--theme-textPrimary), transparent);');

fs.writeFileSync('pages/events.vue', content);
