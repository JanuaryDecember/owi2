import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const filePath = path.resolve('static/questions.txt');


  try {
    const data = await fs.readFile(filePath, 'utf-8');

    const rawQuestions = data.split(/\d+\.\s/).slice(1); // slice(1) to ignore the empty string before the first question

    const parsedQuestions = rawQuestions.map((questionBlock) => {
      const [q, answer] = questionBlock.split('Odpowiedź:');
      if (!q || !answer) {
        return null;
      }

      const options = q.split('\n').filter((line) => line.match(/^[a-d]\.\s/));

      const questionText = q.replace(/([a-d]\.\s.*)/g, '').trim();

      if (!questionText || options.length === 0) {
        return null;
      }

      return {
        question: questionText,
        options: options.map((opt) => opt.trim()), // Trim each option
        correctAnswer: answer.trim(), // Trim the answer
      };
    }).filter(Boolean);

    return parsedQuestions;
  } catch (error) {
    return { error: `Could not load questions. ${error.message}` };
  }
});