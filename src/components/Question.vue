<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps(['question']);

const questions = props.question;

const value = ref([]);

const isChecked = (label) =>
{
    if (value.value.includes(label))
    {
        return { color: "red" };
    }
    else
    {
        return {};
    }
}
</script>

<template>
    <div class="quiz-container" >
        <a-typography-title :level="4">Câu {{ question.id }}: {{ question.text }}</a-typography-title>
        <div class="option-container">
            <a-checkbox-group v-model:value="value" style="width: 100%">
                <a-row v-for="option in question.options">
                    <a-col :span="12">
                        <a-checkbox :style="isChecked(option.label)" :value="option.label"
                            style="font-size: 20px;">{{ option.label }}.
                            {{ option.text }}</a-checkbox>
                    </a-col>
                </a-row>
            </a-checkbox-group>
        </div>
    </div>
</template>

<style scoped>
.quiz-container
{
    margin-top: 20px;
    margin-left: 10px;
    padding: 20px;
    border-radius: 15px;
    background-color: rgb(243, 243, 243);
    overflow: hidden;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
    cursor: pointer;
}

.option-container
{
    display: flex;
    justify-content: space-between;
    padding: 5px;
}

.option
{
    display: flex;
    color: red;
}</style>