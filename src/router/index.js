import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import TopicDetailView from '../views/TopicDetailView.vue';
import TestDetailView from '../views/TestDetailView.vue';
import ManageQuestionView from '../views/ManageQuestionView.vue';
import MangeTopicView from '../views/ManageTopicView.vue';
import ManageTestView from '../views/ManageTestView.vue';
import EditTopicView from '../views/EditTopicView.vue';
import EditTestView from '../views/EditTestView.vue';
import EditQuestionView from '../views/EditQuestionView.vue';

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
                },

                {
                    path: '/edit_topic/:id',
                    name: 'edit_topic',
                    component: EditTopicView
                },

                {
                    path: '/edit_test/:id',
                    name: 'edit_test',
                    component: EditTestView
                },

                {
                    path: '/edit_question/:id',
                    name: 'edit_question',
                    component: EditQuestionView
                },
            ]
    })

export default router
