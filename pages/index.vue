<script setup>
import { onMounted } from 'vue'
import DefaultLayout from '../layouts/default.vue'
import HeroSection from '../components/sections/HeroSection.vue'
import EventsPreviewSection from '../components/sections/EventsPreviewSection.vue'
import AboutSection from '../components/sections/AboutSection.vue'
import InstagramSection from '../components/sections/InstagramSection.vue'
import ContactSection from '../components/sections/ContactSection.vue'
import PartnersSection from '../components/sections/PartnersSection.vue'

onMounted(() => {
  document.title = 'OCEAN PUB – Strandbar, Drinks & Events in Dahme'
})
</script>

<template>
  <DefaultLayout>
    <h1 class="sr-only">OCEAN PUB – Strandbar, Drinks & Events an der Ostsee in Dahme</h1>
    <HeroSection />
    <EventsPreviewSection />
    <AboutSection />
    <InstagramSection />
    <ContactSection />
    <PartnersSection />
  </DefaultLayout>
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