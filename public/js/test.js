const gameTitleEl = document.querySelector('#game-title');
const promptBtns = document.querySelectorAll(".option-button");
const themeBtns = document.querySelectorAll(".theme-button");
const promptText = document.querySelectorAll(".option-text");

const responseEl = document.querySelector('.response-block');
const responseTextEl = document.querySelector(".response-text");
const responseImageEl = document.querySelector('.response-image');
const optionEl = document.querySelector('.option-block');

const themeEl = document.querySelector(".theme-block");
const themeInputEl = document.querySelector('#custom-theme');

let theme = "";
const charTime = 40;
const startScenario = `"Your scenario is being generated, please wait patiently...."`

let realBody = {
  height: 512,
  width: 512,
  modelId: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3',
  prompt: 'A forest in the mountains',
  alchemy: true,
  photoReal: true,
  photoRealStrength: 0.45,
  presetStyle: 'ENVIRONMENT'
};

let cartoonBody = {
  height: 512,
  width: 512,
  modelId: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3',
  prompt: 'A forest in the mountains',
};

const realisticOptions = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: 'Bearer c767a347-672d-40a2-aa40-5c800d2ee927'
  },
  body: JSON.stringify(realBody)
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
  gameTitleEl.innerHTML = theme + " Adventure!";
  themeEl.style.display = "none";
  responseEl.style.display = "flex";

  //Generate Image and Prompts here
  writeText(startScenario, responseTextEl);
  await generatePrompts(theme);
  //generateImage();

  // await writeText(promptArray[0], responseTextEl).then(() => {
  //   writePrompts();
  // });
};

const setTheme = (input) => {
  theme = input;
  themeEl.style.display = "none";
  responseEl.style.display = "flex";

  writeText(testScenario, responseTextEl).then(() => {
    //Generate Image here and
    
  });
  for(let i = 0; i < promptText.length; i++) {
    writeText(promptText[i].innerHTML, promptText[i]);
  };
};

const selectPrompt = async(index) => {
  //Store the CHOICE data and image here
  //Use CHOICE to generate new SCENARIO, IMAGE, and four PROMPTS
  const postData = await fetch('../api/prompt/save', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data.choices[0].message.content),
  });

  console.log(promptText[index].innerHTML);
};

const generatePrompts = async(themeIN) => {
  const scenario = await fetch(`../api/prompt/generate/${themeIN}`, {
    method: 'POST',
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await scenario.json();
  cartoonBody.prompt = data.choices[0].message.content;
  await generateImage();
  writeText(data.choices[0].message.content, responseTextEl);
  // responseImageEl.src = images[0];

  const answers = await fetch(`/api/prompt/generate`, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      "Content-Type": "application/json",
    },
  });

  const answerData = await answers.json();
  const splitArray = answerData.choices[0].message.content.split("\n").filter((split) => { if(split) return split});
  optionEl.style.display = "flex";
  writePrompts(splitArray);
};

const generateImage = async() => {
    const rawData = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations/', cartoonOptions);
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
    responseImageEl.src = imageArray[0];
};


const writePrompts = async(promptData) => {
  console.log(promptData);
  for(let i = 0; i < promptData.length; i++) {
    console.log(promptText[i]);
    writeText(promptData[i], promptText[i]);
  };
};

const writeText = async(input, target) => {
  let copy = input;
  let build = "";
  let index = 0;
  console.log(copy + " : Target => " + target);

  const printCharacter = async() => {

    const charBuild = setTimeout(() => {
      build += copy.charAt(index);
      index++;
      if(index <= copy.length) { printCharacter(); }
    }, charTime);

    // if(copy[index] === " ") {
    //   const spaceBuild = setInterval(() => {
    //     build += copy.charAt(index);
    //     index++;
    //     if(index <= copy.length) { printCharacter(); }
    //   }, spaceTime);
    // } else if(copy[index] === ".") {
    //   const periodBuild = setInterval(() => {
    //     build += copy.charAt(index);
    //     index++;
    //     if(index <= copy.length) { printCharacter(); }
    //   }, periodTime);
    // } else if(copy[index] === "<") {
    //   setInterval(() => {
    //     build += copy.charAt(index);
    //     index++;
    //     if(index <= copy.length) { printCharacter(); }
    //   }, 2000);
    // } else {
      
    // }

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
  themeBtns[i].addEventListener("click", async (e) => {
    await selectTheme(themeBtns[i].parentElement.children[1]);
  });
};

hideElements();