// Import necessary packages using ES6 module syntax
import { createClient } from '@supabase/supabase-js';
import { PromptTemplate } from '@langchain/core/prompts';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import axios from 'axios';

dotenv.config();

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Define the prompt template
const standaloneQuestionTemplate = "Given a question convert it to a standalone question.: {question} standalone question: ";
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate);
let masterStandaloneQuestion = ""
// Create a function to generate the standalone question
async function generateStandaloneQuestion(question) {
    const promptText = await standaloneQuestionPrompt.format({ question });
    console.log("Question to be sent to AI model ",promptText)
    const result = await model.generateContent(promptText);
    const response = result.response.text() || 'No response';
    return response;
}

// Example usage
(async () => {
    const question = 'I am currently working on a project at my company where I am leading a team to develop a new software application. There is some internal competition, and a few colleagues are trying to undermine my efforts. The project is critical for my career advancement, and I need to ensure it succeeds while maintaining a strong position within the company.I want to successfully complete the project, gain recognition for my leadership, and strengthen my influence in the company.Please provide strategic advice on how to navigate this situation using principles from the "48 Laws of Power." If possible, focus on laws that pertain to managing internal competition, gaining influence, and ensuring the success of my project.';
    const standaloneQuestion = await generateStandaloneQuestion(question);
    console.log('Standalone Question:', standaloneQuestion);
     masterStandaloneQuestion = standaloneQuestion
    await sendData(standaloneQuestion);
   
})();

async function sendData(standaloneQuestion) {
    try {
        const response = await axios.post('http://127.0.0.1:5000/api/get_embeddings', {
            question: standaloneQuestion
        });
        const text = response.config.data
        const embeddings = response.data.embeddings
        match_documents(text, embeddings);
    } catch (error) {
        console.error('Error sending data:', error);
    }
}



