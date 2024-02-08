const sequelize = require('../config/connection');
const {User, Story, Prompts, Images} = require('../models');

const usersData = require('./users.json');
const promptData = require('./promptData.json');
const storyData = require('./storyData.json');
const imageData = require('./images.json');

const seedFunction = async () => {
    await sequelize.sync({ force: true});

    const users = await User.bulkCreate(usersData, {
        individualHooks: true,
        returning: true,

    });
    const prompt = await Prompts.bulkCreate(promptData, {
        individualHooks: true,
        returning: true,
    });

    const images = await Images.bulkCreate(imageData, {
        individualHooks: true,
        returning: true,
    });
    const story = await Story.bulkCreate(storyData, {
        individualHooks: true,
        returning: true,
    });

    process.exit(0);
};

seedFunction();