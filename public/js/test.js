const gameTitleEl = document.querySelector('#game-title');
const charTitleEl = document.querySelector("#character-title");
const promptText = document.querySelectorAll(".option-text");
const promptBtns = document.querySelectorAll(".option-button");
const themeBtns = document.querySelectorAll(".theme-button");
const submitBtnEl = document.querySelector('.submit-button');

const responseEl = document.querySelector('.response-block');
const responseTextEl = document.querySelector(".response-text");
const responseImageEl = document.querySelector('.response-image');
const optionEl = document.querySelector('.option-block');

const themeEl = document.querySelector(".theme-block");
const themeInputEl = document.querySelector('#custom-theme');
const nameInputEl = document.querySelector("#custom-name");

let theme;
let charName = "John Doe";
let storeScenario = "";
let storePrompts = [];
let stored = false;
const storyID = Math.floor(Math.random() * 100000);
const charTime = 40;
const startScenario = `"Your scenario is being generated, please wait patiently...."`

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

const startGame = async() => {
  //Generate Image and Prompts here
  if(!theme) { 
    alert("Select a Theme");
    return; }
  themeEl.style.display = "none";
  responseEl.style.display = "flex";
  gameTitleEl.innerHTML = `${charName} ${theme} Adventure!`;
  
  writeText(startScenario, responseTextEl);
  await generatePrompts(theme);
};

const setName = async(input) => {
  let my_name = input.split(" ");
  for(let i = 0; i < my_name.length; i++) {
    my_name[i] = my_name[i].charAt(0).toUpperCase() + my_name[i].slice(1);
  }
  my_name = my_name.join(" ");
  charName = my_name;
  if(charName.length < 1) {
    gameTitleEl.innerHTML = "Character Name!";
    return;
  }
  charTitleEl.innerHTML = charName;
}

const setTheme = async (input) => {
  theme = input;
  theme = theme.charAt(0).toUpperCase() + theme.slice(1);
  if(theme.length < 1) {
    gameTitleEl.innerHTML = "Select a Theme!";
    return;
  }
  gameTitleEl.innerHTML = theme;
};

const selectPrompt = async(index) => {
  //Store the CHOICE data and image here
  //Use CHOICE to generate new SCENARIO, IMAGE, and four PROMPTS
  if(stored) { return; }
  console.log("PROMPT SELECTED");
  let struct = {
    "theme" : theme,
    "scenario" : storeScenario,
    "prompt_one" : storePrompts[0],
    "prompt_two" : storePrompts[1],
    "prompt_three" : storePrompts[2],
    "prompt_four" : storePrompts[3],
    "selected_prompt" : index,
    "user_id" : storyID,
  };
  console.log(struct);
  const postData = await fetch('../api/prompts/save', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(struct),
  });
};

const generatePrompts = async(themeIN) => {
  const scenario = await fetch(`../api/prompts/generate/${themeIN}`, {
    method: 'POST',
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await scenario.json();
  let bodyData = `${theme} environment.`
  bodyData += data.choices[0].message.content.split(". ")[0];

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
      prompt: bodyData
    })
  };
  
  if(charName === "Garrett Gibbs") {
    await generateImage(realisticOptions);
  } else {
    await generateImage(cartoonOptions);
  }

  storeScenario = data.choices[0].message.content;
  writeText(data.choices[0].message.content, responseTextEl);

  const answers = await fetch(`/api/prompts/generate`, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      "Content-Type": "application/json",
    },
  });

  const answerData = await answers.json();
  const splitArray = answerData.choices[0].message.content.split("\n").filter((split) => { if(split) return true});
  setTimeout(() => {
    optionEl.style.display = "flex";
    populateOption(splitArray);
  }, 30000);
};

const generateImage = async(input) => {
    console.log(input);
    const rawData = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations/', input);
    let gID = await rawData.json();
    let generatedID = gID.sdGenerationJob.generationId;
    setTimeout(() => getImage(`${generatedID}`), 10000);
};

const getImage = async(gID) => {
    const imgRaw = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${gID}`, getOptions);
    const convert = await imgRaw.json();

    let imageArray = [];
    const location = convert.generations_by_pk.generated_images;
    for(let i = 0; i < location.length; i++) {
        imageArray.push(location[i].url);
    }

    responseImageEl.src = imageArray[0];
    saveImages(imageArray);
    imageCarousel(imageArray);
};

const saveImages = async(images) => {
  let randInt = Math.floor(Math.random() * 100000);
  for(let i = 0; i < images.length; i++) {
    randInt++;
    const struct = {
      "id": randInt,
      "url": images[i],
      "image_description": `${theme} Adventure`,
      "story_id": 1,
    }
    console.log(struct);
    const postImages = await fetch("../api/images/save", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(struct),
    });
  };
}

const imageCarousel = (images) => {
  let index = 0;
  setInterval(() => {
    responseImageEl.src = images[index];
    index++;
    if(index > images.length - 1) { index = 0; }
  }, 5000);
}

const populateOption = (selections) => {
  storePrompts = selections;
  const optionBlockEl = document.querySelector(".option-block");
  const textArray = [];
  for(let i = 0; i < selections.length; i++) {
    const optionDiv = document.createElement("div");
    const optionButton = document.createElement("button");
    const optionText = document.createElement("p");

    optionDiv.classList.add("option-container");
    optionButton.classList.add("option-button");
    optionText.classList.add("option-text");

    if(i % 2 === 0) { optionText.classList.add("even"); }
    else { optionText.classList.add("odd"); }
    
    optionButton.addEventListener("click", (e) => {
      selectPrompt(i);
    });

    // optionText.textContent = selections[i];
    textArray.push(optionText);
    optionDiv.append(optionButton);
    optionDiv.append(optionText);
    optionBlockEl.append(optionDiv);
  };
  writePrompts(selections, textArray);
};

const writePrompts = async(inputs, targets) => {
  for(let i = 0; i < inputs.length; i++) {
    await writeText(inputs[i], targets[i]);
  };
};

const writeText = async(input, target) => {
  let copy = input;
  let build = "";
  let index = 0;

  const printCharacter = async() => {

    const charBuild = setTimeout(() => {
      build += copy.charAt(index);
      index++;
      if(index <= copy.length) { printCharacter(); }
    }, charTime);

    target.innerHTML = build;
  };

  printCharacter();
};

//PROMPT button listeners
for(let i = 0; i < promptBtns.length; i++) {
  promptBtns[i].addEventListener("click", (e) => {
    selectPrompt(i);
  });
};
//THEME Button Listeners
for(let i = 0; i < themeBtns.length; i++) {
  themeBtns[i].addEventListener("click", async (e) => {
    await setTheme(themeBtns[i].parentElement.children[1].innerHTML);
  });
};
//THEME INPUT listener
themeInputEl.addEventListener("input", (e) => {
  e.preventDefault();
  setTheme(themeInputEl.value);
});
//NAME listener
nameInputEl.addEventListener("input", (e) => {
  e.preventDefault();
  setName(nameInputEl.value);
});
//SUBMIT listener
submitBtnEl.addEventListener("click", (e) => {
  e.preventDefault();
  startGame();
});

hideElements();