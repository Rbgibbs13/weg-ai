console.log("HELLO GAME WORLD");
// const OpenAI = require("openai");
// const openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'], });
const gameTitleEl = document.querySelector('#game-title');
const responseText = document.querySelector(".response-text");
const promptBtns = document.querySelectorAll(".option-button");
const themeBtns = document.querySelectorAll(".theme-button");
const promptText = document.querySelectorAll(".option-text");
const themeEl = document.querySelector(".theme-block");
const responseEl = document.querySelector('.response-block');
const optionEl = document.querySelector('.option-block');
const themeInputEl = document.querySelector('#custom-theme');

let theme = "";
const periodTime = 2000;
const spaceTime = 250;
const charTime = 100;

const test = `"You fall down the mountain. Then you see a shadow in the distance. <br>Testing line break."`

const gptModel = "gpt-3.5-turbo";
let promptMessages = [
  {
    "role": "system",
    "content": "You are an expert storyteller."
  },
  {
    "role": "system",
    "content": `You write stories about ${theme} adventures.`,
  },
  {
    "role": "user", 
    "content": "Write a jingle for an underwear company."
  },
];

const realisticOptions = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: 'Bearer c767a347-672d-40a2-aa40-5c800d2ee927'
  },
  body: JSON.stringify({
    height: 512,
    width: 512,
    modelId: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3',
    prompt: 'A forest in the mountains',
    alchemy: true,
    photoReal: true,
    photoRealStrength: 0.45,
    presetStyle: 'ENVIRONMENT'
  })
};

const cartoonOptions = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: 'Bearer c767a347-672d-40a2-aa40-5c800d2ee927'
  },
  body: JSON.stringify({
    height: 512,
    width: 512,
    modelId: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3',
    prompt: 'A forest in the mountains',
    alchemy: true,
  })
};

const getOptions = {
  method: 'GET',
  headers: {
      accept: 'application/json',
      authorization: 'Bearer c767a347-672d-40a2-aa40-5c800d2ee927'
  }
};

//Generate Image From Answer => write next question/scenario => populate image => write prompts
const hideElements = () => {
  responseEl.style.display = "none";
  optionEl.style.display = "none";
}

const selectTheme = async (selection) => {
  theme = selection.innerHTML;
  console.log(selection);
  gameTitleEl.innerHTML = theme + " Game!";
  themeEl.style.display = "none";
  responseEl.style.display = "flex";
  optionEl.style.display = "flex";
  //Generate Image and Prompts here
  //generatePrompts();
  //generateImage();

  await writeText(test, responseText).then(() => {
    writePrompts();
  });
};

const writePrompts = async() => {
  for(let i = 0; i < promptText.length; i++) {
    writeText(promptText[i].innerHTML, promptText[i]);
  };
};

const setTheme = (input) => {
  theme = input;
  themeEl.style.display = "none";
  responseEl.style.display = "flex";
  optionEl.style.display = "flex";

  writeText(test, responseText).then(() => {
    //Generate Image here and
    
  });
  for(let i = 0; i < promptText.length; i++) {
    writeText(promptText[i].innerHTML, promptText[i]);
  };
};

const selectPrompt = (index) => {
  //Store the CHOICE data and image here
  //Use CHOICE to generate new SCENARIO, IMAGE, and four PROMPTS
  console.log(promptText[index].innerHTML);
};

const generatePrompts = async() => {
  const prompt = await openai.chat.completions.create({
        messages: promptMessages,
        model: gptModel,
      });
  console.log(prompt);
};

const generateImage = async() => {
    const rawData = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations/', realisticOptions);
    let gID = await rawData.json();
    let generatedID = gID.sdGenerationJob.generationId;
    setTimeout(() => getImage(`${generatedID}`), 10000);
};

const getImage = async(gID) => {
    console.log(typeof(gID));
    const imgRaw = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${gID}`, getOptions);
    const convert = await imgRaw.json();

    let imageArray = [];
    const location = convert.generations_by_pk.generated_images;
    for(let i = 0; i < location.length; i++) {
        imageArray.push(location[i].url);
    }
    console.log(imageArray);
};

const writeText = async(input, target) => {
  let copy = input;
  let build = "";
  let index = 0;
  const printCharacter = async() => {
    if(copy[index] === " ") {
      const spaceBuild = setInterval(() => {
        build += copy.charAt(index);
        index++;
        if(index <= copy.length) { printCharacter(); }
      }, spaceTime);
    } else if(copy[index] === ".") {
      const periodBuild = setInterval(() => {
        build += copy.charAt(index);
        index++;
        if(index <= copy.length) { printCharacter(); }
      }, periodTime);
    } else if(copy[index] === "<") {
      setInterval(() => {
        build += copy.charAt(index);
        index++;
        if(index <= copy.length) { printCharacter(); }
      }, 2000);
    } else {
      const charBuild = setTimeout(() => {
        build += copy.charAt(index);
        index++;
        if(index <= copy.length) { printCharacter(); }
      }, charTime);
    }

    target.innerHTML = build;
  };

  printCharacter();
};


for(let i = 0; i < promptBtns.length; i++) {
  promptBtns[i].addEventListener("click", (e) => {
    selectPrompt(i);
  });
};
themeInputEl.addEventListener("submit", (e) => {
  e.preventDefault();
  selectTheme(themeInputEl.parentElement.children[1]);
});
for(let i = 0; i < themeBtns.length; i++) {
  themeBtns[i].addEventListener("click", (e) => {
    selectTheme(themeBtns[i].parentElement.children[1]);
  });
};

hideElements();