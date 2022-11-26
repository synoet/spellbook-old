import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const detectLanguage = async (text: string) => {
  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt:
      "Which programming language is the following snippet written in?\n\n ```" +
      text +
      "```",
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  return response
};
