const router = require('express').Router();
const OpenAI = require("openai");
require('dotenv').config();
const openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'], });
const { Prompts, Story } = require("../../models");
const { UUIDV4 } = require('sequelize');
const gptModel = "gpt-3.5-turbo";

// ./api/prompts

let storeName = 'John Doe';
let storeScenario = '';
let storeTheme = '';

router.get('/', async(req, res) => {
    try {
        const promptData = await Prompts.findAll({});
        const prompts = promptData.map((data) => data.get({ plain: true }));
        res.json(prompts);
    } catch(error) {
        res.status(500).json(error);
    }
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
          "content": `You are an expert storyteller. Write a one paragraph starting scenario about your ${req.params.theme} adventure with ${storeName} as protagonist. Limit to 200 words.`,
        },
    ];
    const prompt = await openai.chat.completions.create({
            messages: promptMessages,
            model: gptModel,
        });
    
    storeScenario = prompt;
    res.json(prompt);
});


router.post('/generate/next', (async(req, res) => {
    // Use scenario and selected prompt to generate next scenario
    console.log(req.body);
    let promptMessages = [
        {
          "role": "system",
          "content": "You are an expert storyteller."
        },
        {
          "role": "system",
          "content": `You are an expert storyteller. Write the next scenario in my ${storeTheme} adventure using ${req.body.prompt} as the direction the story is headed. Limit scenario to 200 words.`,
        },
    ];
    const prompt = await openai.chat.completions.create({
        messages: promptMessages,
        model: gptModel,
    });

    storeScenario = prompt;
    res.json(prompt);
}));

router.post('/generate/finish', (async(req, res) => {
    //FINISH story or game
}));

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

router.post('/save', async(req, res) => {
    console.log(req.body);
    try {
        const storyData = await Story.create({
            "story_name": req.body.theme,
            "user_id" : req.body.user_id
        });
        console.log(storyData);
        const promptData = await Prompts.create({
            "scenario" : req.body.scenario,
            "prompt_one" : req.body.prompt_one,
            "prompt_two" : req.body.prompt_two,
            "prompt_three" : req.body.prompt_three,
            "prompt_four" : req.body.prompt_four,
            "selected_prompt" : req.body.selected_prompt,
            "story_id" : storyData.id
        });
        res.status(200).json(promptData);
    } catch(error) {
        res.status(400).json(error);
    }
});

router.post('/:name', async (req, res) => {
    storeName = req.params.name;
    res.json(storeName);
    res.status(200);
});

module.exports = router;