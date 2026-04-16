<script setup>
import { onMounted, ref } from 'vue'

import sitzeckeImg from '~/assets/pictures/sitzecke.webp'
import spinnexImg from '~/assets/pictures/spinnex.webp'

// SEO
useSeoMeta({
  title: 'PALLAS.WORLD – Bar, Events & Kultur in Hamburg-St. Pauli',
  ogTitle: 'PALLAS.WORLD – Bar, Events & Kultur in Hamburg-St. Pauli',
  description: 'Dein Wohnzimmer in Hamburg-St. Pauli. Bar, Events, Kultur & Nachtleben am Neuen Pferdemarkt 13. Everybody Welcome.',
  ogDescription: 'Dein Wohnzimmer in Hamburg-St. Pauli. Bar, Events, Kultur & Nachtleben am Neuen Pferdemarkt 13. Everybody Welcome.',
  ogImage: 'https://pallas.world/og-image.jpg',
  ogUrl: 'https://pallas.world',
})

useHead({
  link: [{ rel: 'canonical', href: 'https://pallas.world' }],
})

// Structured Data for BarOrPub
useSchemaOrg([
  defineWebPage(),
])

const currentBackgroundImage = ref(sitzeckeImg)

const updateBackgroundImage = () => {
  const now = new Date()
  const hour = now.getHours()
  
  // Zwischen 18 Uhr und 6 Uhr Morgens -> spinnex
  if (hour >= 18 || hour < 6) {
    currentBackgroundImage.value = spinnexImg
  } else {
    currentBackgroundImage.value = sitzeckeImg
  }
}

const preloadStoriesImages = async () => {
  const modules = await Promise.all([
    import('~/assets/pictures/spinne_full.webp'),
    import('~/assets/pictures/spinne_front.webp'),
    import('~/assets/pictures/stories/supreme/djs1.webp'),
    import('~/assets/pictures/stories/supreme/floor1.webp'),
    import('~/assets/pictures/stories/supreme/flyer1.webp'),
    import('~/assets/pictures/stories/supreme/platten.webp'),
    import('~/assets/pictures/stories/supreme/barkeeper1.webp'),
  ])

  modules.forEach(mod => {
    const img = new Image()
    img.src = mod.default
  })
}

onMounted(() => {
  updateBackgroundImage()
  
  // Preload Stories images with a delay to not block Home page rendering
  setTimeout(() => {
    requestAnimationFrame(() => {
      preloadStoriesImages()
    })
  }, 1000)
})
</script>

<template>
  <NuxtLayout :bg-image="currentBackgroundImage">
    <h1 class="sr-only">PALLAS.WORLD – Bar, Events & Kultur in Hamburg-St. Pauli</h1>
    <SectionsHeroSection />
    <SectionsEventsPreviewSection />
    <SectionsAboutSection />
    <SectionsInstagramSection />
    <SectionsContactSection />
    <SectionsPartnersSection />
  </NuxtLayout>
</template>

<style>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>