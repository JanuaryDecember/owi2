<script setup>
import { ref } from 'vue';

// Fetch questions from API or file
const { data: questions, error } = await useFetch('/api/questions');

// Randomly select 10 questions
const selectedQuestions = ref([]);
if (Array.isArray(questions.value)) {
  selectedQuestions.value = questions.value.sort(() => 0.5 - Math.random()).slice(0, 10);
}

// Store user's selected answers
const selectedAnswers = ref(Array(selectedQuestions.value.length).fill(null));

// Store whether answers were submitted
const isSubmitted = ref(false);

// Function to check answers and highlight correct/incorrect ones
const checkAnswers = () => {
  isSubmitted.value = true;
};

// Function to get background color style for each option
const getOptionStyle = (questionIndex, option) => {
  if (!isSubmitted.value) return {}; // No style if not submitted

  const correctAnswer = selectedQuestions.value[questionIndex].correctAnswer;

  // If user hasn't selected this question, no color
  if (!selectedAnswers.value[questionIndex]) return {};

  // Correct answer - green background
  if (option[0] === correctAnswer) {
    return { backgroundColor: 'lightgreen' };
  }
  // Incorrect answer - red background if user chose it
  if (option[0] === selectedAnswers.value[questionIndex]) {
    return { backgroundColor: 'lightcoral' };
  }

  // No specific color for unselected wrong options
  return {};
};
</script>


<template>
  <div>
    <h1>Quiz</h1>
    <form @submit.prevent="checkAnswers">
      <div v-for="(question, index) in selectedQuestions" :key="index" class="question">
        <p>{{ index + 1 }}. {{ question.question }}</p>

        <!-- Show options -->
        <div v-for="(option, optIndex) in question.options" :key="optIndex" class="option"
          :style="getOptionStyle(index, option)">
          <label>
            <input type="radio" :name="'question' + index" :value="option" v-model="selectedAnswers[index]"
              :disabled="isSubmitted" <!-- Disable inputs after submission -->
            {{ option }}
          </label>
        </div>
      </div>
      <!-- Submit Button -->
      <button type="submit" :disabled="isSubmitted">Submit Answers</button>
    </form>
  </div>
</template>


<style scoped>
.question {
  margin-bottom: 20px;
}

.option {
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

option input[type="radio"]:disabled {
  cursor: not-allowed;
}
</style>
