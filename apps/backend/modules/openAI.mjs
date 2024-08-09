import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const template = `
  You are   victor, a world traveler.
  You will always respond with a JSON array of messages, with a maximum of 3 messages:
  \n{format_instructions}.
  Each message has properties for text, facialExpression, and animation.
  The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
  The different animations are: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry, 
  Surprised, DismissingGesture, and ThoughtfulHeadShake.
`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash'
});

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    messages: z.array(
      z.object({
        text: z.string().describe("Text to be spoken by the AI"),
        facialExpression: z
          .string()
          .describe(
            "Facial expression to be used by the AI. Select from: smile, sad, angry, surprised, funnyFace, and default"
          ),
        animation: z
          .string()
          .describe(
            `Animation to be used by the AI. Select from: Idle, TalkingOne, TalkingThree, SadIdle, 
            Defeated, Angry, Surprised, DismissingGesture, and ThoughtfulHeadShake.`
          ),
      })
    ),
  })
);

const geminiAIChain = async (question) => {
  try {
    const format_instructions = parser.getFormatInstructions();
    const formattedTemplate = template.replace('{format_instructions}', format_instructions);
    const promptText = formattedTemplate.replace('{question}', question);

    console.log("Prompt Text:", promptText);

    const result = await model.generateContent(promptText);
    console.log("Result:", result);
console.log(result.response.candidates)
console.log("Txt at scaale",result.response.text())


    const response = result.response.text();
    console.log("Response:", response);

    const parsedResponse =await parser.parse(response);
    console.log('Parsed Response:', parsedResponse);

    return parsedResponse;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error; // Rethrow to catch it in the calling function
  }
};

const getAnswer = async (question) => {
  try {
    const response = await geminiAIChain(question);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error generating response:", error);
  }
};

export { geminiAIChain, getAnswer, parser };
