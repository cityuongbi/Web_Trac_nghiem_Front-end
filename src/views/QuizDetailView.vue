<script setup>
import QuestionView from '../components/QuestionView.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute();

const quizzID = parseInt(route.params.id);

const hasAdmin = computed(() => !!route.params.admin);
</script>

<template>
    <main>
        <QuestionView :id="quizzID" :hasAdmin="hasAdmin" />
    </main>
</template>
