<script setup>
import { onMounted, ref } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import HeroSection from '../components/sections/HeroSection.vue'
import AboutSection from '../components/sections/AboutSection.vue'
import EventsPreviewSection from '../components/sections/EventsPreviewSection.vue'
import InstagramSection from '../components/sections/InstagramSection.vue'
import ContactSection from '../components/sections/ContactSection.vue'
import sitzeckeImg from '../assets/pictures/sitzecke.webp'
import spinnexImg from '../assets/pictures/spinnex.webp'

// Images to preload for StoriesPage
import spinneFullImg from '../assets/pictures/spinne_full.webp'
import spinneFrontImg from '../assets/pictures/spinne_front.webp'
import djs1Img from '../assets/pictures/stories/supreme/djs1.webp'
import floor1Img from '../assets/pictures/stories/supreme/floor1.webp'
import flyer1Img from '../assets/pictures/stories/supreme/flyer1.webp'
import plattenImg from '../assets/pictures/stories/supreme/platten.webp'
import barkeeper1Img from '../assets/pictures/stories/supreme/barkeeper1.webp'

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

const preloadStoriesImages = () => {
  const images = [
    spinneFullImg,
    spinneFrontImg,
    djs1Img,
    floor1Img,
    flyer1Img,
    plattenImg,
    barkeeper1Img
  ]

  images.forEach(src => {
    const img = new Image()
    img.src = src
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
  <MainLayout :bg-image="currentBackgroundImage">
    <HeroSection />
    <EventsPreviewSection />
    <AboutSection />
    <InstagramSection />
    <ContactSection />
  </MainLayout>
</template>

<style>
/* Global styles are already in style.css */
</style>