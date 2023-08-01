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

    const response = await axios.get('test');

    if (response.data.status == 200)
        tests.value = response.data.data;

    isLoading.value = false;
});

const addTest = () =>
{
    router.push(`/edit_test/-1`);
}

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

        <div class="add-test-button">
            <a-button type="primary" style="background-color: rgb(3, 169, 3); border-color: rgb(3, 169, 3); width: 80%; font-size: 20px; height: auto; box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.2);" @click="addTest">Thêm bài test</a-button>
        </div>

        <div class="tests-container">
            <Test v-for="test in tests" :key="test.test_id" :test="test" :isManage="true" />
        </div>
    </div>
</template>

<style scoped>

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
    font-family: 'Quicksand', sans-serif;
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

.add-test-button
{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}
</style>