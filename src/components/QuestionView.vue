<script setup>
import QuestionDetail from './QuestionDetail.vue'
import { defineProps, reactive, onMounted } from 'vue'
import axios from 'axios';

const props = defineProps(['id', 'hasAdmin']);
const id = props.id;
const data = reactive(
    {
        test: [],
    });

onMounted(async () =>
{
    await axios.get('http://127.0.0.1:8000/test/' + id)
        .then((response) =>
        {
            data.test = response.data;
        })
        .catch((error) =>
        {
            console.error(error);
        });
})

</script>

<template>
    <div class="quiz-container">
        <QuestionDetail :id="id" />
    </div>
</template>

<style scoped>
.quiz-container
{
    align-items: space-between;
    padding: 20px 0;
}
</style>