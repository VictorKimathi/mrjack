import  { exec } from 'child_process'
function textToSpeech(text, outputFile) {
  exec(`espeak "${text}" --stdout > ${outputFile}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Audio saved to ${outputFile}`);
  });
}
textToSpeech('ChatGPT It appears you are using Fedora, which uses dnf instead of apt for package managem', 'output.wav');


//#endregion
//A house is a good place to start 