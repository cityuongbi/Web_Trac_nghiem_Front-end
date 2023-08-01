<script setup>
import { defineProps, ref, onMounted, onUnmounted, createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Card, message, Modal } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';
import axios from 'axios';

const props = defineProps(['question']);

const question = props.question;
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const router = useRouter();

const handleEdit = (questionID) =>
{
    router.push(`/edit_question/${questionID}`);
}

const handleDelete = async (id) =>
{
    Modal.confirm(
        {
            title: 'Xóa câu hỏi',
            icon: createVNode(ExclamationCircleOutlined),
            content: 'Bạn có chắc muốn xóa câu hỏi này?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            onOk: async () =>
            {
                const response = await axios.delete('question/delete_question/' + id);

                if (response.data.status == 200)
                {
                    message.success(
                        'Xóa câu hỏi thành công!',
                        3,
                    );
                    location.reload();
                }
                else
                {
                    message.error(
                        'Có lỗi xảy ra khi xóa câu hỏi này!',
                        3,
                    );
                }
            },
        });
}
</script>

<template>
    <Card hoverable :body-style="{ backgroundColor: '#FDFDFD' }"
        style="width: 80%; margin-bottom: 20px;" class="card-with-shadow">
        <div class="content-container">
            <div class="content">
                <p style="font-size: 16px; font-weight: bold;">Câu hỏi: {{ question.question_content }}</p>
                <div class="option-container">
                    <p v-for="(answer, idx) in question.answers" :key="answer.answer_id">
                        {{ String.fromCharCode(65 + idx) }}. {{ answer.answer_content }}</p>
                </div>
            </div>

            <div class="buttons">
                <a-button type="primary" @click="handleEdit(question.question_id)"
                    style="margin-bottom: 7px; width: 100px;">Sửa</a-button>
                <a-button type="danger" @click="handleDelete(question.question_id)"
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

.option-container
{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px;
}
</style>
