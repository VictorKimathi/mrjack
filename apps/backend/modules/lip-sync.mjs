import { convertTextToSpeech } from "./elevenLabs.mjs";
import { getPhonemes } from "./rhubarbLipSync.mjs";
import { readJsonTranscript, audioFileToBase64 } from "../utils/files.mjs";

const MAX_RETRIES = 10;
const RETRY_DELAY = 0;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const lipSync = async ({ messages }) => {
console.log("Messages at lymp syc", messages)
  await Promise.all(
    messages.map(async (message, index) => {
      const fileName = './message.mp3';

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          console.log("Convert text to speech initial")
          console.log("Message to speech", message.text)
          await convertTextToSpeech({ text: message.text, fileName });
          console.log("After chaos"      )
          await delay(RETRY_DELAY);
          console.log("Convert text to speech final")

          break;
        } catch (error) {
          if (error.response && error.response.status === 429 && attempt < MAX_RETRIES - 1) {
            console.log("Beauty when there is an error converting tts")
            await delay(RETRY_DELAY);
          } else {
            console.log("Beauty of the west ")
            console.log("Beauty ",error)
            throw error;
          }
        }
      }
      console.log(`Message ${index} converted to speech`);
    })
  );

  await Promise.all(
    messages.map(async (message, index) => {
      const fileName = `audios/message_${index}.mp3`;
      try {
        console.log("Phones     111")
        await getPhonemes({ message: index });
        console.log("Phones     222")

        message.audio = await audioFileToBase64({ fileName });
        console.log("Phones     333")

        message.lipsync = await readJsonTranscript({ fileName: `audios/message_${index}.json` });
        console.log("Phones     444")

      } catch (error) {
        console.error(`Error while getting phonemes for message ${index}:`, error);
      }
    })
  );
console.log("Success")
  return messages;
};

export { lipSync };
