<script setup>
import MainLayout from '../layouts/MainLayout.vue'
import HeroSection from '../components/sections/HeroSection.vue'
import AboutSection from '../components/sections/AboutSection.vue'
import MenuSection from '../components/sections/MenuSection.vue'
import InstagramSection from '../components/sections/InstagramSection.vue'
import ContactSection from '../components/sections/ContactSection.vue'
import FooterSection from '../components/sections/FooterSection.vue'
</script>

<template>
  <MainLayout>
    <HeroSection />
    <AboutSection />
    <MenuSection />
    <InstagramSection />
    <ContactSection />
    <FooterSection />
  </MainLayout>
</template>

<style>
/* Global styles are already in style.css */
</style>