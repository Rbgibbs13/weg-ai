const options = {
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
  
const optionsTwo = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        authorization: 'Bearer c767a347-672d-40a2-aa40-5c800d2ee927'
    }
};

const generateImage = async() => {
    const rawData = await fetch('https://cloud.leonardo.ai/api/rest/v1/generations/', options);
    let gID = await rawData.json();
    let generatedID = gID.sdGenerationJob.generationId;
    setTimeout(() => getImage(`${generatedID}`), 10000);
};

const getImage = async(gID) => {
    console.log(typeof(gID));
    const imgRaw = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${gID}`, optionsTwo);
    const convert = await imgRaw.json();

    let imageArray = [];
    const location = convert.generations_by_pk.generated_images;
    for(let i = 0; i < location.length; i++) {
        imageArray.push(location[i].url);
    }
    console.log(imageArray);
};
 
//generateImage();