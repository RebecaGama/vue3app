import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VocabuloView from '../views/VocabuloView.vue'
import AnuncioView from '../views/AnuncioView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/vocabulo',
    name: 'vocabulo',
    component: VocabuloView,
  },
  {
    path: '/anuncio',
    name: 'anuncio',
    component: AnuncioView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router