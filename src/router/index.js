import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import QuizDetailView from '../views/QuizDetailView.vue';
import TopicDetailView from '../views/TopicDetailView.vue';
import TestDetailView from '../views/TestDetailView.vue';
import ManageQuestionView from '../views/ManageQuestionView.vue';
import MangeTopicView from '../views/ManageTopicView.vue';
import ManageTestView from '../views/ManageTestView.vue';

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

                {
                    path: '/test/detail/:id',
                    name: 'test_detail',
                    component: TestDetailView
                },

                {
                    path: '/manage_test',
                    name: 'manage_test',
                    component: ManageTestView
                },

                {
                    path: '/manage_topic',
                    name: 'manage_topic',
                    component: MangeTopicView
                },

                {
                    path: '/manage_question',
                    name: 'manage_question',
                    component: ManageQuestionView
                }
            ]
    })

export default router
