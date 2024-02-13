const router = require('express').Router();
const OpenAI = require("openai");
require('dotenv').config();
const openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'], });
const { Prompt } = require("../../models");
const { UUIDV4 } = require('sequelize');
const gptModel = "gpt-3.5-turbo";

// ./api/prompt/generate

let storeScenario = '';
let storeTheme = '';

router.post('/generate', async(req, res) => {
    let promptMessages = [
        {
          "role": "system",
          "content": "You are an expert storyteller."
        },
        {
          "role": "system",
          "content": `You are an expert storyteller. Give me four options on what to do next in my ${storeTheme} adventure using this text ${storeScenario} as a prompt. Limit each option to 20 words.`,
        },
    ];

    const responses = await openai.chat.completions.create({
        messages: promptMessages,
        model: gptModel,
    });
    res.json(responses);
});

router.post('/generate/:theme', async (req, res) => {
    storeTheme = req.params.theme;
    let promptMessages = [
        {
          "role": "system",
          "content": "You are an expert storyteller."
        },
        {
          "role": "system",
          "content": `You are an expert storyteller. Write a one paragraph starting scenario about your ${req.params.theme} adventure. Limit to 200 words.`,
        },
        // {
        //   "role": "user", 
        //   "content": `Write a one paragraph opening scenario about your ${req.params.theme} adventure. Limit to 200 words.`
        // },
    ];
    const prompt = await openai.chat.completions.create({
            messages: promptMessages,
            model: gptModel,
        });
    
    storeScenario = prompt;
    res.json(prompt);
});

router.post('/save', async(req, res) => {
    try {
        const promptData = await Prompt.create({
            prompt_one : req.body,
            prompt_two : req.body,
            prompt_three : req.body,
            prompt_four : req.body,
            selected_prompt : req.body,
            prompts_id : UUIDV4(),
        });
        res.status(200).json(promptData);
    } catch(error) {
        res.status(400).json(error);
    }

    console.log(req.body);
    return req.body;
});

module.exports = router;