<script setup>
import { defineProps, ref, onMounted, onUnmounted } from 'vue';
import { Card } from 'ant-design-vue';
import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';

const props = defineProps(['test']);

const test = props.test;
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const countdown = ref(0);
let intervalId;

const calculateCountdown = (date, time) =>
{
    var currentDate = new Date();

    const p1 = date.split('/');
    const p2 = time.split(':');

    var targetDate = new Date(`${p1[2]}-${p1[1]}-${p1[0]}T${p2[0]}:${p2[1]}:00`);

    var distance = targetDate.getTime() - currentDate.getTime();

    var hours = Math.floor(distance / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdown.value = hours * 3600 + minutes * 60 + seconds;
};

onMounted(() =>
{
    calculateCountdown(test.start_date, test.start_time);

    intervalId = setInterval(() =>
    {
        countdown.value--;
    }, 1000);
});

onUnmounted(() =>
{
    clearInterval(intervalId);
});

const formatTime = (time) =>
{
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
</script>

<template>
    <Card hoverable :body-style="{ backgroundColor: '#FDFDFD' }"
        :head-style="{ fontSize: '20px', backgroundColor: '#F0F0F0' }" :title="test.test_name"
        style="width: 80%; margin-bottom: 20px;" class="card-with-shadow">
        <div class="content-container">
            <div class="content">
                <p>Thời gian bắt đầu: {{ `${test.start_time} - ${test.start_date}` }}.</p>
                <p>Thời gian kết thúc: {{ `${test.end_time} - ${test.end_date}` }}.</p>
                <p>Thời gian làm bài: {{ test.duration }} phút.</p>
                <p v-if="countdown > 0">
                    Đếm ngược:
                    <span style="color: red;">{{ formatTime(countdown) }}</span>
                </p>
            </div>

            <div class="buttons">
                <a-button :disabled="countdown > 0 && user.role != 'Admin'" type="primary" style="margin-right: 10px;">Làm bài</a-button>
            </div>
        </div>
    </Card>
</template>

<style scoped>
.card-with-shadow
{
    box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.2);
}

.content-container
{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.ant-btn[disabled]
{
    background-color: #969696;
    border-color: #d9d9d9;
    color: rgb(255, 255, 255);
    cursor: not-allowed;
    box-shadow: none;
}
</style>
