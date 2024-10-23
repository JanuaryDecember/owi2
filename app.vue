<script setup>
import { ref, computed } from 'vue';

const { data: allQuestions, error } = await useFetch('/api/questions');

const remainingQuestions = ref([]);
if (Array.isArray(allQuestions.value)) {
  remainingQuestions.value = [...allQuestions.value];
}

const selectedQuestions = ref([]);
const selectedAnswers = ref([]);
const isSubmitted = ref(false);

const shuffleArray = (array) => {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};


const selectRandomQuestions = () => {
  selectedQuestions.value = remainingQuestions.value
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);
  remainingQuestions.value = remainingQuestions.value.filter(
    q => !selectedQuestions.value.includes(q)
  );
  selectedQuestions.value = selectedQuestions.value.map(question => {
    // Shuffle the options and track the correct answer after shuffling
    const shuffledOptions = shuffleArray(question.options);
    return {
      ...question,
      shuffledOptions,  // Store shuffled options
      correctAnswer: question.correctAnswer // Keep track of the correct answer
    }
  })
  selectedAnswers.value = Array(selectedQuestions.value.length).fill(null);
  isSubmitted.value = false;
};

selectRandomQuestions();

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
    if (selectedAnswers.value[index] === correctAnswer) {
      count++;
    }
    return count;
  }, 0);
});

const getOptionStyle = (questionIndex, option) => {
  if (!isSubmitted.value) return {};

  const correctAnswer = selectedQuestions.value[questionIndex].correctAnswer;
  if (!selectedAnswers.value[questionIndex]) return {};

  if (option === correctAnswer) {
    return { backgroundColor: 'darkgreen', color: 'white' };
  }
  if (option === selectedAnswers.value[questionIndex]) {
    return { backgroundColor: 'darkred', color: 'white' };
  }

  return {};
};


const nextSet = () => {
  if (remainingQuestions.value.length > 0) {
    selectRandomQuestions();
    window.scrollTo({ top: true });
  } else {
    alert('Quiz completed! All questions have been answered.');
  }
};
</script>

<template>
  <div style="margin-bottom: 1rem;">
    <h1 style="margin-left: 1rem;">Quiz</h1>
    <form @submit.prevent="checkAnswers" style="display: grid; justify-content: center;">
      <div v-for="(question, index) in selectedQuestions" :key="index" class="question"
        style="border: solid; padding: 2rem; max-width: 80vw; width: 100%; border-radius: 4rem; border-color: beige;">
        <p>{{ index + 1 }}. {{ question.question }}</p>

        <div v-for="(option, optIndex) in question.shuffledOptions" :key="optIndex" class="option"
          :style="getOptionStyle(index, option)">
          <label>
            <input type="radio" :name="'question' + index" :value="option" v-model="selectedAnswers[index]"
              :disabled="isSubmitted" />
            {{ option }}
          </label>
        </div>
      </div>

      <button type="submit" :disabled="isSubmitted">Submit Answers</button>
    </form>

    <div v-if="isSubmitted" style="text-align: center; margin-top: 1rem;">
      <button @click="nextSet" v-if="remainingQuestions.length > 0">Next 10 Questions</button>
      <p v-else>All questions completed! Thanks for playing.</p>
    </div>
  </div>
</template>
