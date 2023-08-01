<script setup>
import { ref, onMounted, createVNode, h } from 'vue';
import { UploadOutlined, SaveOutlined, StopOutlined, ExclamationCircleOutlined, FileAddOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios';
import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';

const fileList = ref([]);
const router = useRouter();
const route = useRoute();
const topic_id = route.params.id;
const userStore = useUserStore();
const topicName = ref('');
const isLoading = ref(true);

const { user } = storeToRefs(userStore);

const handleCancel = () =>
{
    router.push('/manage_topic');
}

const handleBeforeUpload = () => false;

const saveTopic = async () =>
{
    const formData = new FormData();

    if (topicName.value == '')
    {
        message.error('Vui lòng nhập tên topic!', 3);
        return;
    }

    formData.append('topic_name', topicName.value);

    if (fileList.value.length > 0)
    {
        const newFile = fileList.value[0].originFileObj;
        formData.append('cover', newFile);

        console.log(newFile);
    }
    else
    {
        message.error('Vui lòng tải lên cover!', 3);
        return;
    }

    if (topic_id == -1)
    {
        const response = await axios.post('topic/add_topic', formData);

        if (response.data.status === 200)
        {
            message.success('Thêm topic thành công!', 3);
            router.push('/manage_topic');
        }
        else
        {
            message.error('Thêm topic thất bại!', 3);
        }
    }
    else
    {
        const response = await axios.put(`topic/${topic_id}`, formData);

        if (response.data.status == 200)
        {
            message.success('Cập nhật topic thành công!', 3);
            router.push('/manage_topic');
        }
        else
        {
            message.error('Cập nhật topic thất bại!', 3);
        }
    }
};

onMounted(async () =>
{
    if (topic_id != -1)
    {
        await axios.get(`topic/${topic_id}`)
            .then((response) =>
            {
                topicName.value = response.data.data.topic_name;
            })
            .catch((error) =>
            {
                console.error(error);
            });

        const coverResponse = await axios.get(`/topic/get_cover/${topic_id}`, {
            responseType: "blob"
        });

        const coverImage = new File([coverResponse.data], "cover.png", {
            type: coverResponse.headers["content-type"],
        });

        fileList.value.push({
            uid: '-1',
            name: `${topic_id}.png`,
            status: 'done',
            originFileObj: coverImage,
        });
    }

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
        <h1 style="font-family: 'Quicksand', sans-serif;">Topic</h1>
        <div class="container">
            <div class="topic-name">
                <label for="topic_name" style="color: black; font-size: 18px;">Tên topic:</label>
                <a-input v-model:value="topicName" name="topic_name" placeholder="Nhập tên topic..." />
            </div>

            <div class="upload-cover">
                <label for="topic_cover" style="color: black; font-size: 18px;">Cover: </label>
                <a-upload name="topic_cover" v-model:file-list="fileList" :before-upload="handleBeforeUpload"
                    list-type="picture">
                    <a-button :disabled="fileList.length > 0">
                        <upload-outlined></upload-outlined>
                        Upload
                    </a-button>
                </a-upload>
            </div>

            <div class="buttons">
                <a-button type="primary" shape="round" size="large"
                    style="margin-right: 10px; background-color: rgb(127, 127, 127); border-color: rgb(127, 127, 127);"
                    @click="handleCancel">
                    Hủy
                    <StopOutlined />
                </a-button>
                <a-button type="primary" shape="round" size="large" @click="saveTopic">
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

.upload-cover
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

.spinner
{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    width: 100%;
}
</style>