import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const filePath = path.resolve('static/questions.txt');
  
  try {
    // Read file content
    const data = await fs.readFile(filePath, 'utf-8');
    
    // Split the data by question numbers (e.g., "1. ", "2. ", etc.)
    const rawQuestions = data.split(/\d+\.\s/).slice(1); // slice(1) to ignore the empty string before the first question
    
    const parsedQuestions = rawQuestions.map((questionBlock) => {
      // Split the question and the answer part by "Odpowiedź:"
      const [q, answer] = questionBlock.split('Odpowiedź:');
      
      // Check if both question and answer exist
      if (!q || !answer) {
        // Skip this entry if the format is incorrect
        return null;
      }
      
      // Extract options (lines starting with "a.", "b.", "c.", or "d.")
      const options = q.split('\n').filter((line) => line.match(/^[a-d]\.\s/));

      // Clean up the question text (remove option lines and trim spaces)
      const questionText = q.replace(/([a-d]\.\s.*)/g, '').trim();

      // Check if the questionText and options are valid before returning
      if (!questionText || options.length === 0) {
        return null; // Skip malformed entries
      }
      
      return {
        question: questionText,
        options: options.map((opt) => opt.trim()), // Trim each option
        correctAnswer: answer.trim(), // Trim the answer
      };
    }).filter(Boolean); // Remove any null entries
    
    return parsedQuestions; // Return the parsed questions
  } catch (error) {
    // Handle file read or parsing errors
    return { error: `Could not load questions. ${error.message}` };
  }
});