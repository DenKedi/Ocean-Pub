<script setup>
import { onMounted } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import HeroSection from '../components/sections/HeroSection.vue'
import EventsPreviewSection from '../components/sections/EventsPreviewSection.vue'
import InstagramSection from '../components/sections/InstagramSection.vue'
import ContactSection from '../components/sections/ContactSection.vue'
import FooterSection from '../components/sections/FooterSection.vue'
import backgroundImage from '../assets/pictures/sitzecke.jpg'

// Images to preload for StoriesPage
import spinneFullImg from '../assets/pictures/spinne_full.png'
import spinneFrontImg from '../assets/pictures/spinne_front.png'
import djs1Img from '../assets/pictures/stories/supreme/djs1.png'
import floor1Img from '../assets/pictures/stories/supreme/floor1.png'
import flyer1Img from '../assets/pictures/stories/supreme/flyer1.png'
import plattenImg from '../assets/pictures/stories/supreme/platten.png'
import barkeeper1Img from '../assets/pictures/stories/supreme/barkeeper1.png'

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
  // Preload Stories images with a delay to not block Home page rendering
  setTimeout(() => {
    requestAnimationFrame(() => {
      preloadStoriesImages()
    })
  }, 1000)
})
</script>

<template>
  <MainLayout :bg-image="backgroundImage">
    <HeroSection />
    <EventsPreviewSection />
    <InstagramSection />
    <ContactSection />
    <FooterSection />
  </MainLayout>
</template>

<style>
/* Global styles are already in style.css */
</style>