<script setup>
import MainLayout from '../layouts/MainLayout.vue'
import HeroSection from '../components/sections/HeroSection.vue'
import EventsPreviewSection from '../components/sections/EventsPreviewSection.vue'
import InstagramSection from '../components/sections/InstagramSection.vue'
import ContactSection from '../components/sections/ContactSection.vue'
import FooterSection from '../components/sections/FooterSection.vue'
import backgroundImage from '../assets/pictures/sitzecke.jpg'
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