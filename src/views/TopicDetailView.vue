<script setup>
import axios from 'axios';
import { ref, onMounted, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Test from '../components/Test.vue';
import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import { LoadingOutlined } from '@ant-design/icons-vue';

const route = useRoute();
const router = useRouter();
const tests = ref([]);
const topicID = route.params.id;
const isLoading = ref(true);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);


onMounted(async () =>
{
    if (!user.value)
    {
        router.push('/');
        message.error(
            'Vui lòng đăng nhập để tiếp tục!',
            3,
        );
    }

    tests.value = (await axios.get('test/' + topicID)).data.data;
    isLoading.value = false;
});

const indicator = h(LoadingOutlined,
    {
        style:
        {
            fontSize: '48px',
        },
        spin: true,
    });
</script>

<template>
    <div class="spinner" v-if="isLoading">
        <a-spin :indicator="indicator" />
    </div>
    <div v-else>
        <div class="page-title">
            <h1>DANH SÁCH BÀI TEST</h1>
        </div>

        <div class="tests-container">
            <Test v-for="test in tests" :key="test.test_id" :test="test" />
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caprasimo&family=Quicksand:wght@500&family=Zeyada&display=swap');

.tests-container
{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
}

.page-title
{
    text-align: center;
    margin-top: 20px;
    font-family: 'Caprasimo', cursive;
    font-size: 125%;
}

.spinner
{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    width: 100%;
}
</style>