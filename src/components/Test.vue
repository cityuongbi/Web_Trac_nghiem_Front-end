<script setup>
import { defineProps, ref, onMounted, onUnmounted, createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Card, message, Modal } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';
import axios from 'axios';

const props = defineProps(['test', 'isManage']);

const test = props.test;
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const router = useRouter();
const topicName = ref('');

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

onUnmounted(() =>
{
    clearInterval(intervalId);

    calculateCountdown(test.start_date, test.start_time);

    intervalId = setInterval(() =>
    {
        countdown.value--;
    }, 1000);
});

onMounted(async () =>
{
    if (props.isManage)
    {
        await axios.get('topic/' + test.topic_id)
            .then((response) =>
            {
                topicName.value = response.data.data.topic_name;
            })
            .catch((error) =>
            {
                console.error(error);
            });
    }

    if (user.value.role == 'User')
    {
        calculateCountdown(test.start_date, test.start_time);

        intervalId = setInterval(() =>
        {
            countdown.value--;
        }, 1000);
    }
})

const viewTestDetail = (testID) =>
{
    router.push(`/test/detail/${testID}`);
}

const formatTime = (time) =>
{
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const handleEdit = (testID) =>
{
    router.push(`/edit_test/${testID}`);
}

const handleDelete = async (id) =>
{
    Modal.confirm(
        {
            title: 'Xóa bài test',
            icon: createVNode(ExclamationCircleOutlined),
            content: 'Bạn có chắc muốn xóa bài test này?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            onOk: async () =>
            {
                const response = await axios.delete('test/delete_test/' + id);

                if (response.data.status == 200)
                {
                    message.success(
                        'Xóa bài test thành công!',
                        3,
                    );
                    location.reload();
                }
                else
                {
                    message.error(
                        'Có lỗi xảy ra khi xóa bài test!',
                        3,
                    );
                }
            },
        });
}
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
                <p v-if="props.isManage">Topic: {{ topicName }}.</p>
                <p v-if="countdown > 0">
                    Đếm ngược:
                    <span style="color: red;">{{ formatTime(countdown) }}</span>
                </p>
            </div>

            <div class="buttons" v-if="!props.isManage">
                <a-button v-if="user.role == 'User'" @click="viewTestDetail(test.test_id)" :disabled="countdown > 0"
                    type="primary" style="margin-bottom: 7px; width: 100px;">Làm bài</a-button>
                <a-button v-else type="primary" @click="viewTestDetail(test.test_id)"
                    style="margin-bottom: 7px; width: 100px;">Xem</a-button>
            </div>

            <div class="buttons" v-else>
                <a-button type="primary" @click="handleEdit(test.test_id)"
                    style="margin-bottom: 7px; width: 100px;">Sửa</a-button>
                <a-button type="danger" @click="handleDelete(test.test_id)"
                    style="margin-bottom: 7px; width: 100px;">Xóa</a-button>
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

.buttons
{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
}
</style>
