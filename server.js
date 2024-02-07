const OpenAI = require("openai");
require('dotenv').config();
const openai = new OpenAI({ 
    apiKey: process.env['OPENAI_API_KEY'],
});
const fs = require('fs');
console.log(openai.images);

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{"role": "system", "content": "You are a marketing expert."},
        {"role": "user", "content": "Write a jingle for an underwear company."},],
    model: "gpt-3.5-turbo",
  });

  console.log(completion);
  //image_url = response.data.data[0].url;
//   fs.writeFile("/path", "data","utf8", (error) => {
     
//   });
}
main();