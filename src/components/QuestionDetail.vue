<script setup>
import { defineProps, ref, onMounted, reactive } from 'vue'
import Question from './Question.vue'
import { ClockCircleOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import axios from 'axios'
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/users';

const userStore = useUserStore();

const { user } = storeToRefs(userStore);

const props = defineProps(['id']);
let hasAdmin = false;
const isLoading = ref(true);

const deadline = ref(0);
const format = ref('HH:mm:ss');
const visible = ref(false);
const questions = ref([]);

const data = reactive(
    {
        test: [],
    });

const onFinish = () =>
{
    message.success('Time is up!');
    localStorage.removeItem('deadline' + data.test.subject + props.id);
}

const setDeadline = () =>
{
    const savedDeadline = localStorage.getItem('deadline' + data.test.subject + props.id);
    if (savedDeadline)
    {
        deadline.value = parseInt(savedDeadline, 10);
    }
    else
    {
        deadline.value = Date.now() + 1000 * 60 * parseInt(data.test.time);
        localStorage.setItem('deadline' + data.test.subject + props.id, deadline.value.toString());
    }
}

const showModal = () =>
{
    visible.value = true;
}

// Thêm câu hỏi và đáp án
const form = ref();
const question = ref('');
const numAnswers = ref(1);
const answers = reactive([{ text: '' }]);
const isCorrectAnswer = ref([false, false, false, false, false, false, false, false, false, false]);

const resetFields = () =>
{
    question.value = '';
    for (var i = numAnswers.value - 1; i >= 0; --i)
    {
        answers.splice(i, 1);
        isCorrectAnswer.value[i] = false;
    }
    answers.push({ text: '' });
    numAnswers.value = 1;
}

const onSubmit = async () =>
{
    console.log('Question:', question.value);
    answers.forEach(answer => console.log(answer));
    console.log(isCorrectAnswer.value)

    const length = questions.value.questions.length;

    questions.value.questions.push(
        {
            "id": length + 1,
            "text": question.value + ':',
            "options": []
        }
    )

    answers.forEach((answer, index) =>
    {
        const option = {
            id: index + 1,
            label: String.fromCharCode(index + 65),
            text: answer.text,
            isCorrect: isCorrectAnswer.value[index]
        };

        const lastQuestion = questions.value.questions[questions.value.questions.length - 1];
        lastQuestion.options.push(option);
    });

    await axios.put('http://127.0.0.1:8000/test/update_questions',
        {
            id: props.id,
            questions: JSON.stringify(questions.value)
        })

    visible.value = false;
    resetFields();

    location.reload();
}

const addAnswer = () =>
{
    if (answers.length < 10)
    {
        answers.push({ text: '' });
        numAnswers.value++;
    }
}

const removeAnswer = (index) =>
{
    answers.splice(index, 1);
    numAnswers.value--;
}

const cancelHandle = () =>
{
    visible.value = false;
    resetFields();
}

onMounted(async () =>
{
    await axios.get('test/detail/' + props.id)
        .then((response) =>
        {
            data.test = response.data;
        })
        .catch((error) =>
        {
            console.error(error);
        });

    if (!hasAdmin)
        setDeadline();

    questions.value = JSON.parse(data.test.questions);

    console.log(questions.value)

    isLoading.value = false;
});
</script>

<template>
    <div class="quizbar-container">
        <div class="quiz-content">
            <a-typography-title :level="1">Bài kiểm tra: {{ data.test.subject }}</a-typography-title>
            {{ test }}
        </div>

        <div class="bottom-content">
            <a-typography-title :level="5">Số lượng câu: {{ data.test.num }}.</a-typography-title>
            <a-typography-title :level="5">Thời gian: {{ data.test.time }} phút.</a-typography-title>
        </div>

        <div v-if="!isLoading">
            <div v-if="hasAdmin">
                <a-button class="add-question-button" type="primary" @click="showModal">+</a-button>
                <modal v-if="visible" class="overlay">
                    <div class="content">
                        <div class="add-question">
                            <a-form :form="form" @submit="onSubmit">
                                <a-form-item label="Câu hỏi" :labelCol="{ span: 2 }">
                                    <a-textarea required="true" v-model:value="question" placeholder="Nhập câu hỏi..."
                                        :auto-size="{ minRows: 2 }" />
                                </a-form-item>
                                <a-form-item v-for="(answer, index) in answers" :key="index"
                                    :label="String.fromCharCode(index + 65)" :labelCol="{ span: 2 }">
                                    <div class="question-content">
                                        <div class="options">
                                            <a-input style="width: 70%;" required="true" v-model:value="answer.text" />

                                            <div>
                                                <a-checkbox style="margin-top: 12px; margin-right: 10px;"
                                                    v-model:checked="isCorrectAnswer[index]">Đáp án đúng
                                                </a-checkbox>
                                                <a-button type="danger" @click="removeAnswer(index)"
                                                    style="margin-top: 7px;">Xóa đáp án
                                                </a-button>
                                            </div>
                                        </div>
                                    </div>
                                </a-form-item>
                                <div class="buttons">
                                    <a-form-item>
                                        <a-button style="border-radius: 5px;" @click="cancelHandle">Hủy</a-button>
                                    </a-form-item>
                                    <a-form-item>
                                        <a-button style="margin-left: 10px; border-radius: 5px;" @click="addAnswer"
                                            :disabled="answers.length >= 10">Thêm đáp án</a-button>
                                    </a-form-item>
                                    <a-form-item style="margin-left: 10px">
                                        <a-button style="border-radius: 5px;" type="primary"
                                            html-type="submit">Lưu</a-button>
                                    </a-form-item>
                                </div>
                            </a-form>
                        </div>
                    </div>
                </modal>
            </div>

            <a-affix v-else>
                <div class="countdown">
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
            </a-affix>
        </div>

        <div class="quiz-container" v-for="question in questions.questions">
            <Question :question="question" />
        </div>
    </div>
</template>

<style scoped>
.quizbar-container
{
    padding-bottom: 75px;
}

.bottom-content
{
    display: flex;
    justify-content: center;
    width: 100%;
    padding-bottom: 10px;
}

.bottom-content h5
{
    margin: 0 !important;
    padding: 0;
    margin-right: 30px !important;
    align-items: center;
}

.quiz-content
{
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 0px;
}

.countdown
{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 10%;
    left: 92.5%;
    transform: translateX(-50%);
    background-color: #fffafa;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
}

.add-question-button
{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 12%;
    left: 92.5%;
    transform: translateX(-50%);
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    border-radius: 35px;
    font-size: 35px;
    width: 65px;
    height: 65px;
    text-align: center;
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

.buttons
{
    display: flex;
    justify-content: center;
}

.content
{
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 20px;
}

.overlay
{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
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
</style>