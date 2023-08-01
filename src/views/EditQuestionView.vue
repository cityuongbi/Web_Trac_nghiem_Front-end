<script setup>
import { ref, onMounted, createVNode, h } from 'vue';
import { UploadOutlined, SaveOutlined, StopOutlined, ExclamationCircleOutlined, PlusCircleOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios';
import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';

const router = useRouter();
const route = useRoute();
const question_id = route.params.id;
const userStore = useUserStore();
const questionContent = ref('');
const isLoading = ref(true);
const isCorrectAnswer = ref([false, false, false, false, false, false, false, false, false, false]);
const numAnswers = ref(1);
const answers = ref([
    {
        'answer_content': '',
        'is_correct': false
    }
]);

const { user } = storeToRefs(userStore);

const handleCancel = () =>
{
    router.push('/manage_question');
}

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

    if (question_id != -1)
    {
        const response = await axios.get('question/question_and_answers/' + question_id);

        if (response.data.status == 200)
        {
            questionContent.value = response.data.data.question_content;
            answers.value = response.data.data.answers;
            numAnswers.value = answers.value.length;
            for (let i = 0; i < answers.value.length; i++)
            {
                isCorrectAnswer.value[i] = answers.value[i].is_correct;
            }
        }
    }

    isLoading.value = false;
});

const saveQuestion = () =>
{
    for (let i = 0; i < answers.value.length; i++)
    {
        if (answers.value[i].answer_content == '')
        {
            message.error(
                'Vui lòng nhập đầy đủ thông tin!',
                3,
            );
            return;
        }
    }

    for (let i = 0; i < answers.value.length; i++)
    {
        answers.value[i].is_correct = isCorrectAnswer.value[i];
    }

    const question = {
        'question_content': questionContent.value,
        'answers': answers.value
    };

    Modal.confirm(
        {
            title: 'Lưu câu hỏi',
            icon: createVNode(ExclamationCircleOutlined),
            content: 'Bạn có chắc muốn lưu câu hỏi này?',
            okText: 'Lưu',
            cancelText: 'Hủy',
            onOk: async () =>
            {
                const response = await axios.post('question/add_question', question);

                if (response.data.status == 200)
                {
                    message.success(
                        'Lưu câu hỏi thành công!',
                        3,
                    );
                    router.push('/manage_question');
                }
                else
                {
                    message.error(
                        'Có lỗi xảy ra khi lưu câu hỏi này!',
                        3,
                    );
                }
            },
        });

}

const addAnswer = () =>
{
    answers.value.push(
        {
            'answer_content': '',
            'is_correct': false
        });
}

const removeAnswer = (index) =>
{
    answers.value.splice(index, 1);
    numAnswers.value--;
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
        <h1 style="font-family: 'Quicksand', sans-serif;">Câu hỏi</h1>
        <div class="container">
            <div class="content">
                <a-form>
                    <a-form-item label="Câu hỏi" :labelCol="{ span: 2 }">
                        <a-textarea required="true" v-model:value="questionContent" placeholder="Nhập câu hỏi..."
                            :auto-size="{ minRows: 2 }" />
                    </a-form-item>
                    <a-form-item v-for="(answer, index) in answers" :key="index" :label="String.fromCharCode(index + 65)"
                        :labelCol="{ span: 2 }">
                        <div class="question-content">
                            <div class="options">
                                <a-input style="width: 70%;" required="true" v-model:value="answer.answer_content" />

                                <div style="display: flex; align-items: center; justify-content: center;margin-left: 10px;">
                                    <a-checkbox style="margin-top: 12px; margin-right: 10px;"
                                        v-model:checked="isCorrectAnswer[index]">Đáp án đúng
                                    </a-checkbox>
                                    <a-button type="danger" @click.prevent="removeAnswer(index)"
                                        style="margin-top: 7px;">Xóa đáp án
                                    </a-button>
                                </div>
                            </div>
                        </div>
                    </a-form-item>
                </a-form>
            </div>

            <div class="buttons">
                <a-button type="primary" shape="round" size="large"
                    style="margin-right: 10px; background-color: rgb(127, 127, 127); border-color: rgb(127, 127, 127);"
                    @click.prevent="handleCancel">
                    Hủy
                    <StopOutlined />
                </a-button>

                <a-button type="primary" style="margin-right: 10px;" shape="round" size="large" @click.prevent="addAnswer">
                    Thêm đáp án
                    <PlusCircleOutlined />
                </a-button>

                <a-button type="primary" shape="round" size="large" @click.prevent="saveQuestion">
                    Lưu
                    <SaveOutlined />
                </a-button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container
{
    margin-top: 1%;
    border: 5px #000000;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    padding: 10px;
    padding-bottom: 2%;
    margin-left: 2%;
    margin-right: 2%;
    margin-bottom: 2%;
    height: 75vh;
}

h1
{
    font-size: 40px;
    font-weight: bold;
    text-align: center;
    padding-top: 10px;
    margin-bottom: 0px;
}

.buttons
{
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 10px;
    margin-right: 20px;
    margin-bottom: 20px;
}

.spinner
{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    width: 100%;
}

.content
{
    width: 100%;
    padding: 20px;
}

.add-question
{
    display: flex;
    flex-direction: column;
    justify-content: center;
    justify-items: center;
    padding: 40px;
    width: 80%;
    background-color: rgb(243, 243, 243);
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.question-content
{
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.options
{
    display: flex;
    justify-content: space-between;
}

.buttons2
{
    display: flex;
    justify-content: center;
}
</style>