import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/grid',
      name: 'grid',
      component: () => import('../views/GridView.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/WordSearchView.vue')
    },
    {
      path: '/crossword',
      name: 'crossword',
      component: () => import('../views/CrosswordView.vue')
    },
    {
      path: '/rookMove',
      name: 'rookMove',
      component: () => import('../views/RookMoveView.vue')
    }
  ]
})

export default router
