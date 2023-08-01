<script setup>
import { defineProps, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/users';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';

const props = defineProps(['topic']);
const router = useRouter();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const navigateToTests = (id) =>
{
    if (user.value && user.value.role)
    {
        router.push(`/tests/${id}`);
    }
    else
    {
        message.error("Vui lòng đăng nhập để tiếp tục!");
    }
};

onMounted(() =>
{
    
});
</script>

<template>
    <a-card hoverable :style="{ width: '260px' }" class="card" @click="navigateToTests(topic.topic_id)">
        <template class="cover_img" #cover>
            <img alt="Subject" :src="`http://localhost:9000${topic.topic_image}`" />
        </template>
        <h3 style="text-align: center; font-weight: bold; word-wrap: break-word;">{{ topic.topic_name }}</h3>
        <a-card-meta style="text-align: center;" :description="`Số lượng bài test: ${topic.num_of_test}`" />
    </a-card>
</template>
  
<style scoped>
.card
{
    margin-left: 20px;
    margin-bottom: 20px;
}</style>