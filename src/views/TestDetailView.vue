<script setup>
import { ref, onMounted, h } from 'vue'
import axios from 'axios';
import { useRoute } from 'vue-router';
import { ClockCircleOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import Question from '../components/Question.vue';
import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const testDetail = ref(null);
const questions = ref([]);
const test_id = route.params.id;
const isLoading = ref(true);
const testName = ref('');
const attemp = ref([]);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const deadline = ref(0);
const format = ref('HH:mm:ss');

const onFinish = () =>
{
    message.success('Time is up!');
    localStorage.removeItem('deadline' + data.test.subject + props.id);
}

const setDeadline = (duration) =>
{
    deadline.value = Date.now() + 1000 * duration;
}

const getCurrentTime = () =>
{
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const dateTime = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
    return dateTime;
}


onMounted(async () =>
{

    await axios.get('test/detail/' + test_id)
        .then((response) =>
        {
            testDetail.value = response.data.data;
        });

    if (user.value && user.value.role == 'User')
    {
        const response = (await axios.post('test/detail/get_attemp', {
            test_id: test_id,
            user_id: user.value.user_id,
            question_ids: [],
            answers: [],
            score: 0,
            start_time: getCurrentTime()
        }));

        if (response.data.status == 403)
        {
            message.error(
                'Bạn đã làm bài test này rồi!',
                3,
            );
            router.back();
            return;
        }

        attemp.value = response.data.data;

        setDeadline(attemp.value.time_remaining);
    }

    questions.value = testDetail.value?.questions || [];
    testName.value = testDetail.value?.test_name || '';

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

    <div class="container" v-else>
        <div class="page-title">
            <h1>{{ testName }}</h1>
        </div>

        <div class="countdown" v-if="user.role == 'User'">
            <div>
                <a-tag color="error" style="margin-right: 10px; width: fit-content; font-size: 15px;">
                    <template #icon>
                        <clock-circle-outlined />
                    </template>
                    Thời gian còn lại:
                </a-tag>
            </div>

            <div>
                <a-row :gutter="16">
                    <a-col :span="12">
                        <a-statistic-countdown :value="deadline" @finish="onFinish" :format="format" />
                    </a-col>
                </a-row>
            </div>
        </div>

        <div class="question-container">
            <Question v-for="(question, index) in questions" :key="question.question_id" :question="question"
                :index="index" />
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600&display=swap');

.page-title
{
    text-align: center;
    margin-top: 20px;
    font-family: 'Quicksand', sans-serif;
    font-size: 125%;
}

.countdown
{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 10%;
    right: 20px;
    background-color: #fffafa;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
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
