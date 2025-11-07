<template>
  <section id="events" class="content-section events-section">
    <div class="container">
      <h2 class="section-title pallas-heading">PALLAS.WORLD Events</h2>
      
      <!-- Calendar Component -->
      <div class="calendar-wrapper">
        <div class="calendar-header">
          <button @click="previousMonth" class="nav-button">‹</button>
          <h3 class="month-year">{{ currentMonthYear }}</h3>
          <button @click="nextMonth" class="nav-button">›</button>
        </div>
        
        <div class="calendar-grid">
          <div class="calendar-day-header" v-for="day in dayHeaders" :key="day">{{ day }}</div>
          <div 
            v-for="date in calendarDates" 
            :key="date.key"
            class="calendar-day"
            :class="{
              'other-month': !date.isCurrentMonth,
              'has-event': date.hasEvent,
              'today': date.isToday
            }"
            @click="selectDate(date)"
          >
            <span class="date-number">{{ date.day }}</span>
            <div v-if="date.hasEvent" class="event-indicator"></div>
          </div>
        </div>
      </div>
      
      <!-- Events List -->
      <div class="events-list">
        <h3 class="events-list-title">
          {{ selectedDate ? `Events am ${formatSelectedDate}` : 'Alle Events' }}
        </h3>
        
        <div class="event-item" v-for="event in filteredEvents" :key="event.id">
          <div class="event-date">
            <div class="event-day">{{ formatEventDay(event.date) }}</div>
            <div class="event-month">{{ formatEventMonth(event.date) }}</div>
          </div>
          
          <div class="event-content">
            <div class="event-time">{{ event.time }}</div>
            <h4 class="event-title">{{ event.title }}</h4>
            <p class="event-description">{{ event.description }}</p>
            <div class="event-meta">
              <span class="event-price">{{ event.price }}</span>
              <span class="event-type">{{ event.type }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Current date and selected date
const currentDate = ref(new Date())
const selectedDate = ref(null)

// Sample events data
const events = ref([
  {
    id: 1,
    title: 'World Unity Night',
    description: 'Kulturen treffen aufeinander – eine Nacht voller internationaler Musik, Tanz und kulinarischer Vielfalt.',
    date: new Date(2024, 11, 14), // December 14, 2024
    time: '21:00 Uhr',
    price: 'Eintritt frei',
    type: 'Wöchentlich'
  },
  {
    id: 2,
    title: 'Cultural Food Journey',
    description: 'Entdecke mit uns die Geschmäcker der Welt. Jede Woche ein anderes Land, authentische Küche.',
    date: new Date(2024, 11, 12), // December 12, 2024
    time: '18:00 Uhr',
    price: '20€ pro Person',
    type: 'Wöchentlich'
  },
  {
    id: 3,
    title: 'Open Stage for All',
    description: 'Deine Bühne, deine Kunst! Musik, Poetry, Comedy – alle sind willkommen.',
    date: new Date(2024, 11, 16), // December 16, 2024
    time: '20:00 Uhr',
    price: 'Eintritt frei',
    type: 'Wöchentlich'
  },
  {
    id: 4,
    title: 'Private Celebration',
    description: 'Feiere deine besonderen Momente bei PALLAS.WORLD. Von Geburtstagen bis Firmenfeiern.',
    date: new Date(2024, 11, 20), // December 20, 2024
    time: '19:00 Uhr',
    price: 'Ab 30€ pro Person',
    type: 'Privat'
  },
  {
    id: 5,
    title: 'World Unity Night',
    description: 'Kulturen treffen aufeinander – eine Nacht voller internationaler Musik, Tanz und kulinarischer Vielfalt.',
    date: new Date(2024, 11, 21), // December 21, 2024
    time: '21:00 Uhr',
    price: 'Eintritt frei',
    type: 'Wöchentlich'
  }
])

// Day headers for calendar
const dayHeaders = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

// Current month and year display
const currentMonthYear = computed(() => {
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ]
  return `${months[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`
})

// Generate calendar dates
const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // Get first day of month and adjust for Monday start
  const firstDay = new Date(year, month, 1)
  const firstDayWeekday = (firstDay.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0
  
  // Get last day of month
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  
  const dates = []
  
  // Add previous month's trailing dates
  const prevMonth = new Date(year, month - 1, 0)
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const day = prevMonth.getDate() - i
    const date = new Date(year, month - 1, day)
    dates.push({
      key: `prev-${day}`,
      day,
      date,
      isCurrentMonth: false,
      hasEvent: hasEventOnDate(date),
      isToday: isToday(date)
    })
  }
  
  // Add current month's dates
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    dates.push({
      key: `curr-${day}`,
      day,
      date,
      isCurrentMonth: true,
      hasEvent: hasEventOnDate(date),
      isToday: isToday(date)
    })
  }
  
  // Add next month's leading dates to complete the grid
  const totalCells = Math.ceil(dates.length / 7) * 7
  let nextDay = 1
  while (dates.length < totalCells) {
    const date = new Date(year, month + 1, nextDay)
    dates.push({
      key: `next-${nextDay}`,
      day: nextDay,
      date,
      isCurrentMonth: false,
      hasEvent: hasEventOnDate(date),
      isToday: isToday(date)
    })
    nextDay++
  }
  
  return dates
})

// Check if date has events
const hasEventOnDate = (date) => {
  return events.value.some(event => 
    event.date.toDateString() === date.toDateString()
  )
}

// Check if date is today
const isToday = (date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

// Filtered events based on selected date
const filteredEvents = computed(() => {
  if (!selectedDate.value) {
    return events.value.sort((a, b) => a.date - b.date)
  }
  
  return events.value.filter(event => 
    event.date.toDateString() === selectedDate.value.toDateString()
  )
})

// Format selected date
const formatSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  
  return selectedDate.value.toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

// Calendar navigation
const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

// Select date
const selectDate = (dateObj) => {
  if (dateObj.hasEvent) {
    selectedDate.value = dateObj.date
  } else {
    selectedDate.value = null
  }
}

// Format event date parts
const formatEventDay = (date) => {
  return date.getDate().toString().padStart(2, '0')
}

const formatEventMonth = (date) => {
  const months = ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ']
  return months[date.getMonth()]
}
</script>

<style scoped>
.content-section {
  padding: 5rem 0;
  background: var(--theme-eventsBg, var(--theme-sectionBg));
  backdrop-filter: blur(10px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  color: white !important;
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 700 !important;
}

/* Calendar Styles */
.calendar-wrapper {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.nav-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.month-year {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.1em;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.calendar-day-header {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  text-align: center;
  padding: 1rem 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
}

.calendar-day {
  background: rgba(0, 0, 0, 0.3);
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem;
}

.calendar-day:hover {
  background: rgba(255, 255, 255, 0.1);
}

.calendar-day.other-month {
  opacity: 0.4;
}

.calendar-day.today {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.calendar-day.has-event {
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
}

.calendar-day.has-event:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.date-number {
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
}

.event-indicator {
  width: 6px;
  height: 6px;
  background: #00ff88;
  border-radius: 50%;
  margin-top: 4px;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.6);
}

/* Events List */
.events-list {
  margin-top: 3rem;
}

.events-list-title {
  color: white;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: 0.05em;
}

.event-item {
  display: flex;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.event-item:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.25);
}

.event-date {
  flex-shrink: 0;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.event-day {
  color: white;
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}

.event-month {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  margin-top: 0.2rem;
}

.event-content {
  flex: 1;
}

.event-time {
  color: #00ff88;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.event-title {
  color: white;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.event-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.event-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.event-price {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.event-type {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid rgba(0, 255, 136, 0.3);
}

/* Mobile Optimization */
@media (max-width: 768px) {
  .content-section {
    padding: 3rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .calendar-wrapper {
    padding: 1.5rem;
  }
  
  .calendar-header {
    margin-bottom: 1.5rem;
  }
  
  .month-year {
    font-size: 1.2rem;
  }
  
  .nav-button {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }
  
  .calendar-day {
    min-height: 50px;
    padding: 0.3rem;
  }
  
  .date-number {
    font-size: 0.85rem;
  }
  
  .event-indicator {
    width: 4px;
    height: 4px;
    margin-top: 2px;
  }
  
  .event-item {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }
  
  .event-date {
    width: 60px;
    height: 60px;
    align-self: flex-start;
  }
  
  .event-day {
    font-size: 1.4rem;
  }
  
  .event-month {
    font-size: 0.7rem;
  }
  
  .event-title {
    font-size: 1.2rem;
  }
  
  .event-description {
    font-size: 0.9rem;
  }
  
  .event-meta {
    gap: 0.5rem;
  }
  
  .event-price,
  .event-type {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 480px) {
  .calendar-day {
    min-height: 40px;
  }
  
  .calendar-day-header {
    padding: 0.8rem 0.3rem;
    font-size: 0.8rem;
  }
  
  .date-number {
    font-size: 0.8rem;
  }
}
</style>