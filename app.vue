<script setup>
import { ref, computed } from 'vue';

const { data: questions, error } = await useFetch('/api/questions');

const selectedQuestions = ref([]);
if (Array.isArray(questions.value)) {
  selectedQuestions.value = questions.value.sort(() => 0.5 - Math.random()).slice(0, 10);
}

const selectedAnswers = ref(Array(selectedQuestions.value.length).fill(null));

const isSubmitted = ref(false);

const checkAnswers = () => {
  isSubmitted.value = true;
  const correctCount = correctAnswersCount.value;
  const totalQuestions = selectedQuestions.value.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  alert(`You got ${correctCount} out of ${totalQuestions} questions correct (${percentage}%)`);
};

const correctAnswersCount = computed(() => {
  return selectedQuestions.value.reduce((count, question, index) => {
    const correctAnswer = question.correctAnswer;
    if (selectedAnswers.value[index][0] === correctAnswer) {
      count++;
    }
    return count;
  }, 0);
});

const getOptionStyle = (questionIndex, option) => {
  if (!isSubmitted.value) return {};

  const correctAnswer = selectedQuestions.value[questionIndex].correctAnswer;
  if (!selectedAnswers.value[questionIndex]) return {};

  if (option[0] === correctAnswer) {
    return { backgroundColor: 'darkgreen', color:"black" };
  }
  if (option === selectedAnswers.value[questionIndex]) {
    return { backgroundColor: 'darkred', color:"black" };
  }

  return {};
};
</script>

<template>
  <div style="margin-bottom: 1rem;">
    <h1 style="margin-left: 1rem;">Quiz</h1>
    <form @submit.prevent="checkAnswers" style="display: grid; justify-content: center;">
      <div style="border: solid; padding: 2rem; width: 100%; border-radius: 4rem; border-color: beige;"
        v-for="(question, index) in selectedQuestions" :key="index" class="question">
        <p>{{ index + 1 }}. {{ question.question }}</p>

        <div v-for="(option, optIndex) in question.options" :key="optIndex" class="option"
          :style="getOptionStyle(index, option)">
          <label>
            <input type="radio" :name="'question' + index" :value="option" v-model="selectedAnswers[index]"
              :disabled="isSubmitted">
            {{ option }}
          </label>
        </div>
      </div>
      <!-- Submit Button -->
      <button type="submit" :disabled="isSubmitted">Submit Answers</button>
    </form>
  </div>
</template>
