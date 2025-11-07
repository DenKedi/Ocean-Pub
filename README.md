# Pallas - Motion Design Website

A modern Vue.js + Vite website featuring motion design with MPEG-4 video background, responsive burger menu navigation, and mobile-first optimization.

## 🚀 Features

- **Motion Design Background**: MPEG-4 video (`flash.mp4`) as an immersive background
- **Responsive Burger Menu**: Animated hamburger menu with smooth transitions
- **Mobile-First Design**: Optimized for all screen sizes with fluid typography
- **Full Black Theme**: High-contrast dark theme for professional aesthetics
- **Modern Vue 3**: Built with Vue 3 Composition API and Vite for fast development
- **Accessibility**: WCAG compliant with proper focus management and reduced motion support

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next generation frontend tooling
- **CSS3** - Modern styling with flexbox, grid, and backdrop filters
- **HTML5 Video** - Optimized video background with fallbacks

## 📁 Project Structure

```
src/
├── assets/
│   ├── flash.mp4          # Motion design video background
│   └── vue.svg            # Vue logo
├── components/
│   ├── BurgerMenu.vue     # Animated hamburger menu component
│   └── HelloWorld.vue     # Default Vue component
├── App.vue                # Main application component
├── main.js                # Application entry point
└── style.css              # Global styles and theme
```

## 🎯 Development

### Prerequisites
- Node.js v18+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install
```

### Development Server
```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build for Production
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design Features

### Video Background
- Autoplay with muted attribute for browser compatibility
- `object-fit: cover` for responsive scaling
- Opacity overlay for content readability
- Fallback support for browsers without video support

### Burger Menu
- CSS-only animations using transforms
- Three-line to X transition
- Backdrop blur effects
- Touch-friendly sizing for mobile devices

### Responsive Design
- Mobile-first CSS approach
- Fluid typography using `clamp()`
- Flexible navigation that adapts to screen size
- Optimized touch targets for mobile

### Performance Optimizations
- Video preloading for smooth playback
- CSS transforms for hardware acceleration
- Minimal JavaScript for fast initial load
- Vite's built-in optimizations

## 🌐 Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- iOS Safari 14.4+
- Chrome Android 88+

## 📱 Mobile Features

- Touch-optimized navigation
- Responsive video scaling
- Accessible font sizes
- Optimized button sizes for touch
- Reduced motion support for accessibility

## 🎬 Video Background Tips

Replace `src/assets/flash.mp4` with your own motion design video:
- Recommended format: MP4 (H.264)
- Optimal resolution: 1920x1080 or higher
- Keep file size under 10MB for web performance
- Consider WebM format for additional browser support

## 🚀 Deployment

This project can be deployed to any static hosting service:
- Vercel
- Netlify 
- GitHub Pages
- AWS S3 + CloudFront

Build command: `npm run build`
Output directory: `dist/`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
