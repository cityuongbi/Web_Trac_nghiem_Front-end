<script setup>
import axios from 'axios'
import { h, onMounted, ref, watch, createVNode } from 'vue';
import { useRouter } from 'vue-router';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined, LoadingOutlined, DownOutlined } from '@ant-design/icons-vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/users';

const userStore = useUserStore();

const router = useRouter();
const isAdmin = ref(false);
const { user } = storeToRefs(userStore);
const topicList = ref([]);
const isLoading = ref(true);
const isMenuOpen = ref(false);

const topics = ref([]);

const searchText = ref('')

onMounted(async () =>
{
    await axios.get('topic')
        .then(async (response) =>
        {
            topics.value = response.data.data;
            topicList.value = response.data.data;
        })
        .catch((error) =>
        {
            console.error(error);
        });

    if (user.value)
        isAdmin.value = user.value.role == "Admin";

    isLoading.value = false;
});

const toggleMenu = () =>
{
    isMenuOpen.value = !isMenuOpen.value;
};

watch(searchText, () =>
{
    topics.value = topicList.value.filter(topic => topic.topic_name.toLowerCase().includes(searchText.value.toLowerCase()));
})

const addTopic = () =>
{
    router.push(`/edit_topic/-1`);
}

const handleView = (id) =>
{
    router.push(`edit_topic/${id}`);
}

const handleDelete = async (id) =>
{
    Modal.confirm(
        {
            title: 'Xóa topic',
            icon: createVNode(ExclamationCircleOutlined),
            content: 'Bạn có chắc muốn xóa topic này?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            onOk: async () =>
            {
                const response = await axios.delete(`topic/${id}`);

                if (response.data.status == 200)
                {
                    message.success(
                        'Xóa topic thành công!',
                        3,
                    );
                    location.reload();
                }
                else
                {
                    message.error(
                        'Có lỗi xảy ra khi xóa topic!',
                        3,
                    );
                }
            },
        });
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
        <div class="row, center-obj">
            <h1 style="margin-top: 1%; font-family: 'Quicksand', sans-serif;">Quản lý Topic</h1>
        </div>

        <div class="topic-list">
            <div class="container" v-if="topics">
                <div style="margin-bottom: 20px; margin-top: 10px;">
                    <a-input-search v-model:value="searchText" placeholder="Search..." enter-button />
                </div>

                <div class="add-topic" v-if="isAdmin">
                    <a class="btn btn-success col-lg-12 add-topic" style="color: white; font-size: 22px;"
                        @click.prevent="addTopic">Thêm
                        topic mới</a>
                </div>

                <table class="table table-striped table-bordered">
                    <thead class="table-dark">
                        <tr style="text-align: center;">
                            <th style="text-align: center; vertical-align: middle;">Cover</th>
                            <th style="text-align: center; vertical-align: middle;">Topic</th>
                            <th style="text-align: center; vertical-align: middle;">Số lượng bài test</th>
                            <th style="text-align: center; vertical-align: middle;" v-if="isAdmin">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="topic in topics" :key="topic.topic_id" class="body-content">
                            <td style="border: 0px;" class="center-obj">
                                <div>
                                    <img :src="`http://localhost:9000${topic.topic_image}`" alt="Bìa" class="topicImg">
                                </div>
                            </td>
                            <td style="text-align: center; vertical-align: middle;">{{ topic.topic_name }}</td>
                            <td style="text-align: center; vertical-align: middle;">{{ topic.num_of_test }}</td>
                            <td class="actionButton" v-if="isAdmin">
                                <a-dropdown :trigger="['click']" placement="bottom" v-if="user.role == 'Admin'">
                                    <template #overlay class="center-content">
                                        <a-menu>
                                            <a-menu-item key="1">
                                                <a-button @click.prevent="handleView(topic.topic_id)" type="primary"
                                                    style="width: 150px;">
                                                    Chỉnh sửa topic
                                                </a-button>
                                            </a-menu-item>

                                            <a-menu-item key="2">
                                                <a-button @click.prevent="manageTestView" type="primary"
                                                    style="width: 150px;">
                                                    Chỉnh sửa bài test
                                                </a-button>
                                            </a-menu-item>
                                        </a-menu>
                                    </template>
                                    <a-button id="view-button" type="primary" @click.prevent="toggleMenu">
                                        Sửa
                                        <DownOutlined />
                                    </a-button>
                                </a-dropdown>

                                <a-button type="danger" @click.prevent="handleDelete(topic.topic_id)">Xóa</a-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "../assets/bootstrap.css";

.spinner
{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60vh;
    width: 100%;
}

.topic-list
{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.container
{
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 1%;
    border: 5px #000000;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    padding: 10px;
    width: 95%;
    margin-left: 1%;
    margin-right: 1%;
    margin-bottom: 2%;
}

.center-obj
{
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0px;
}

.actionButton
{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 242px;
    border: 0px;
}

.add-topic
{
    margin-bottom: 1%;
}

.topicImg
{
    width: 15vw;
}

#view-button
{
    margin-right: 4px;
}

@media screen and (max-width: 768px)
{
    .actionButton
    {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 0px;
    }

    button
    {
        margin-bottom: 10px;
        width: 75px;
    }

    #view-button
    {
        margin-right: 0px;
    }
}</style>