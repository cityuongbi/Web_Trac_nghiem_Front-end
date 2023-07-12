import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import QuizDetailView from '../views/QuizDetailView.vue';
import TopicDetailView from '../views/TopicDetailView.vue';

const router = createRouter
    ({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes:
            [
                {
                    path: '/',
                    name: 'home',
                    component: HomeView
                },

                {
                    path: '/detail/:id',
                    name: 'detail',
                    component: QuizDetailView
                },

                {
                    path: '/detail/:id/:admin',
                    name: 'detail_admin',
                    component: QuizDetailView
                },

                {
                    path: '/tests/:id',
                    name: 'topic',
                    component: TopicDetailView
                },
            ]
    })

export default router
