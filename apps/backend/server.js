import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { geminiAIChain, getAnswer, parser } from "./modules/openAI.mjs";
import { lipSync } from "./modules/lip-sync.mjs";
import { sendDefaultMessages, defaultResponse } from "./modules/defaultMessages.mjs";
import { convertAudioToText } from "./modules/whisper.mjs";

dotenv.config();

const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

app.get("/voices", async (req, res) => {
  res.send(await voice.getVoices(elevenLabsApiKey));
});

app.post("/tts", async (req, res) => {
  const userMessage = await req.body.message;
  console.log("User Message", userMessage)
  const defaultMessages = await sendDefaultMessages({ userMessage });
  console.log("Default Message", defaultMessages)
  if (defaultMessages) {
    res.send({ messages: defaultMessages });
    return;
  }
  let openAImessages;
  try {
    openAImessages = await geminiAIChain(userMessage);
  } catch (error) {
    openAImessages = defaultResponse;
  }
  console.log("Open AI messages:", openAImessages);
  openAImessages = await lipSync({ messages: openAImessages.messages });
  res.send({ messages: openAImessages });
});

app.post("/sts", async (req, res) => {
  const base64Audio = req.body.audio;
  const audioData = Buffer.from(base64Audio, "base64");
  const userMessage = await convertAudioToText({ audioData });
  let openAImessages;
  try {
    openAImessages = await geminiAIChain(userMessage);
  } catch (error) {
    openAImessages = defaultResponse;
  }
  console.log("Hello Asia")
  openAImessages = await lipSync({ messages: openAImessages.messages });
  console.log("Hello Africa")
  res.send({ messages: openAImessages });
});

app.listen(port, () => {
  console.log(`Jack are listening on port ${port}`);
});
