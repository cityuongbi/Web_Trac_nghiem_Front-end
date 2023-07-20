<script setup>
import { defineProps, ref, watch } from 'vue'

const props = defineProps(['question', 'index']);

const questions = props.question;
const index = props.index + 1;

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

watch(value, () =>
{
    console.log(value.value);
})
</script>

<template>
    <div class="quiz-container" >
        <a-typography-title :level="4">Câu {{ index }}: {{ question.question_content }}</a-typography-title>
        <div class="option-container">
            <a-checkbox-group v-model:value="value" style="width: 100%">
                <a-row v-for="(option, optionIndex) in question.answers">
                    <a-col :span="12">
                        <a-checkbox :style="isChecked(String.fromCharCode(65 + optionIndex))" :value="String.fromCharCode(65 + optionIndex)"
                            style="font-size: 20px;">{{ String.fromCharCode(65 + optionIndex) }}.
                            {{ option.answer_content }}</a-checkbox>
                    </a-col>
                </a-row>
            </a-checkbox-group>
        </div>
    </div>
</template>

<style scoped>
.quiz-container
{
    margin-top: 2%;
    margin-left: 2%;
    padding: 20px;
    border-radius: 15px;
    background-color: rgb(243, 243, 243);
    overflow: hidden;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    width: 75%;
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
}
</style>