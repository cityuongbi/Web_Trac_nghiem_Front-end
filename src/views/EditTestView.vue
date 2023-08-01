<script setup>
import axios from 'axios';
import { ref, onMounted, h, createVNode, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';
import { message, Modal } from 'ant-design-vue';
import { UploadOutlined, SaveOutlined, StopOutlined, ExclamationCircleOutlined, FileAddOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons-vue';

const route = useRoute();
const router = useRouter();
const tests = ref([]);
const testID = route.params.id;
const isLoading = ref(true);
const testName = ref('');
const dateStart = ref('');
const dateEnd = ref('');
const hourStart = ref('');
const hourEnd = ref('');
const timeDuration = ref(0);
const topicName = ref('');
const topics = ref([]);
const topicID = ref(-1);
const visible = ref(false);
const questionList = ref([]);
const selectedQuestions = ref([]);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

onMounted(async () =>
{
    topics.value = (await axios.get('topic')).data.data;
    const response = await axios.get('question');

    if (response.data.status == 200)
        questionList.value = response.data.data;

    if (testID != -1)
    {
        tests.value = (await axios.get(`test/detail/${testID}`)).data.data;
        timeDuration.value = tests.value.duration;
        testName.value = tests.value.test_name;
        dateStart.value = convertDateToISOFormat(tests.value.start_date);
        dateEnd.value = convertDateToISOFormat(tests.value.end_date);
        hourStart.value = tests.value.start_time;
        hourEnd.value = tests.value.end_time;
        topicID.value = tests.value.topic_id;
        for (let i = 0; i < topics.value.length; i++)
        {
            if (topics.value[i].topic_id == topicID.value)
            {
                topicName.value = topics.value[i].topic_name;
                break;
            }
        }

        const res = await axios.get('test/get_question_ids/' + testID);
        if (res.data.status == 200)
            selectedQuestions.value = res.data.data;
    }
    isLoading.value = false;
});


const formatDate = (date) =>
{
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
};

const convertDateToISOFormat = (dateString) =>
{
    const parts = dateString.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}


const handleCancel = () =>
{
    router.push('/manage_test');
}

const handleSave = async () =>
{
    if (testName.value == '' || dateStart.value == '' || dateEnd.value == '' || hourStart.value == '' || hourEnd.value == '' || topicID.value == -1)
    {
        message.error(
            'Vui lòng nhập đầy đủ thông tin!',
            3,
        );
        return;
    }

    if (timeDuration.value == 0)
    {
        message.error(
            'Thời gian bắt đầu phải trước thời gian kết thúc!',
            3,
        );
        return;
    }

    if (dateStart.value >= dateEnd.value)
    {
        message.error(
            'Thời gian bắt đầu phải trước thời gian kết thúc!',
            3,
        );
        return;
    }

    if (dateStart.value == dateEnd.value && hourStart.value >= hourEnd.value)
    {
        message.error(
            'Thời gian bắt đầu phải trước thời gian kết thúc!',
            3,
        );
        return;
    }

    const data =
    {
        test_name: testName.value,
        start_date: formatDate(dateStart.value),
        end_date: formatDate(dateEnd.value),
        start_time: hourStart.value,
        end_time: hourEnd.value,
        duration: timeDuration.value,
        topic_id: topicID.value,
        selected_questions: selectedQuestions.value
    }

    if (testID == -1)
    {
        Modal.confirm(
            {
                title: 'Thêm bài test',
                icon: createVNode(ExclamationCircleOutlined),
                content: 'Bạn có chắc muốn thêm bài test này?',
                okText: 'Thêm',
                cancelText: 'Hủy',
                onOk: async () =>
                {
                    await axios.post('test/add_test', data)
                        .then((response) =>
                        {
                            if (response.data.status == 200)
                            {
                                message.success(
                                    'Thêm bài test thành công!',
                                    3,
                                );
                                router.push('/manage_test');
                            }
                            else
                            {
                                message.error(
                                    'Thêm bài test thất bại!',
                                    3,
                                );
                            }
                        })
                        .catch((error) =>
                        {
                            console.error(error);
                        });
                },
            });
    }
    else
    {
        Modal.confirm(
            {
                title: 'Cập nhật thông tin bài test',
                icon: createVNode(ExclamationCircleOutlined),
                content: 'Bạn có chắc muốn cập nhật thông tin bài test này?',
                okText: 'Cập nhật',
                cancelText: 'Hủy',
                onOk: async () =>
                {
                    await axios.put(`test/update_test/${testID}`, data)
                        .then((response) =>
                        {
                            if (response.data.status == 200)
                            {
                                message.success(
                                    'Cập nhật thông tin bài test thành công!',
                                    3,
                                );
                                router.push('/manage_test');
                            }
                            else
                            {
                                message.error(
                                    'Cập nhật thông tin bài test thất bại!',
                                    3,
                                );
                            }
                        })
                        .catch((error) =>
                        {
                            console.error(error);
                        });
                },
            });
    }
}

const handleChange = () =>
{
    for (let i = 0; i < topics.value.length; i++)
    {
        if (topics.value[i].topic_name == topicName.value)
        {
            topicID.value = topics.value[i].topic_id;
            break;
        }
    }
}

const indicator = h(LoadingOutlined,
    {
        style:
        {
            fontSize: '48px',
        },
        spin: true,
    });

const showModal = () =>
{
    visible.value = true;
}

const handleOk = () =>
{
    visible.value = false;
}

const isChecked = (id) =>
{
    if (isSelected(id))
    {
        return { color: "red" };
    }
    else
    {
        return {};
    }
}
const isSelected = (id) =>
{
    return selectedQuestions.value.includes(id);
}
</script>

<template>
    <div class="spinner" v-if="isLoading">
        <a-spin :indicator="indicator" />
    </div>

    <div v-else>
        <div class="page-title">
            <h1>Test</h1>
        </div>

        <div class="container">
            <div>
                <label for="test_name" style="color: black; font-size: 18px;">Tên bài test:</label>
                <a-input v-model:value="testName" name="test_name" placeholder="Nhập tên bài test..." />
            </div>

            <div class="time-container">
                <label for="time-start" style="color: black; font-size: 18px;">Thời gian bắt đầu: </label>
                <a-time-picker v-model:value="hourStart" name="time-start" format="HH:mm" value-format="HH:mm" />
                <a-input v-model:value="dateStart" type="date" style="margin-top: 10px; margin-bottom: 20px;" />

                <label for="time-end" style="color: black; font-size: 18px;">Thời gian kết thúc: </label>
                <a-time-picker v-model:value="hourEnd" name="time-end" format="HH:mm" value-format="HH:mm" />
                <a-input v-model:value="dateEnd" type="date" style="margin-top: 10px; margin-bottom: 20px;" />

                <label for="time-duration" style="color: black; font-size: 18px;">Thời gian làm bài (phút):</label>
                <a-input v-model:value="timeDuration" name="time-duration" type="number" />

                <label for="select-topic" style="color: black; font-size: 18px;">Topic: </label>
                <a-select name="select-topic" ref="select" v-model:value="topicName"
                    style="width: 40%; margin-top: 20px; margin-bottom: 20px;" @change="handleChange">
                    <a-select-option v-for="topic in topics" :key="topic.topic_id"
                        :value="topic.topic_name">{{ topic.topic_name }}</a-select-option>
                </a-select>

                <div>
                    <a-button type="primary" @click="showModal">Bộ câu hỏi</a-button>
                    <a-modal v-model:visible="visible" style="width: 75%;" title="Bộ câu hỏi" @ok="handleOk">
                        <div>
                            <a-checkbox-group v-model:value="selectedQuestions" style="width: 100%" class="questions">
                                <a-row class="quiz-container" v-for="(question, index) in questionList" :key="index">
                                    <a-col :span="24">
                                        <a-checkbox :checked="isSelected(question.question_id)" :style="isChecked(question.question_id)" :value="question.question_id">
                                            <p style="font-size: 14px; font-weight: bold;">{{ question.question_content }}</p>
                                            <div class="option-container">
                                                <p v-for="(answer, idx) in question.answers" :key="answer.answer_id">
                                                    {{ String.fromCharCode(65 + idx) }}. {{ answer.answer_content }}</p>
                                            </div>
                                        </a-checkbox>
                                    </a-col>
                                </a-row>
                            </a-checkbox-group>
                        </div>
                    </a-modal>
                </div>
            </div>

            <div class="buttons">
                <a-button type="primary" shape="round" size="large"
                    style="margin-right: 10px; background-color: rgb(127, 127, 127); border-color: rgb(127, 127, 127);"
                    @click="handleCancel">
                    Hủy
                    <StopOutlined />
                </a-button>
                <a-button type="primary" shape="round" size="large" @click="handleSave">
                    Lưu
                    <SaveOutlined />
                </a-button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.spinner
{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    width: 100%;
}

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

.page-title
{
    text-align: center;
    margin-top: 20px;
    font-family: 'Quicksand', sans-serif;
    font-size: 125%;
}

.time-container
{
    margin-top: 20px;
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

.quiz-container
{
    margin-top: 2%;
    margin-left: 2%;
    padding: 10px;
    border-radius: 15px;
    background-color: rgb(246, 246, 246);
    overflow: hidden;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    width: 90%;
}

.option-container
{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px;
}

.questions
{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>