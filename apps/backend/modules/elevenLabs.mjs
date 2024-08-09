import ElevenLabs from "elevenlabs-node";
import dotenv from "dotenv";
dotenv.config();

const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
const voiceID = process.env.ELEVEN_LABS_VOICE_ID;
const modelID = process.env.ELEVEN_LABS_MODEL_ID;

const elevenLabsClient = new ElevenLabs({
  apiKey: elevenLabsApiKey,
  voiceId: voiceID,
});

async function convertTextToSpeech({ text, fileName }) {
  const response = await elevenLabsClient.textToSpeech({
    fileName: fileName,
    textInput: text,
    voiceId: voiceID,
    stability: 0.5,
    similarityBoost: 0.5,
    modelId: modelID,
    style: 1,
    speakerBoost: true,
  });
  console.log("Voice response: ", response);
  console.log("Text-to-Speech conversion completed");
}

export { convertTextToSpeech };
