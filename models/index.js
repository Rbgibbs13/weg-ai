const User = require('./User');
const Story = require('./Story');
const Images = require('./Images');
const Prompts = require('./Prompts');

User.hasMany(Story, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Story.belongsTo(User, {
    foreignKey: 'user_id'
});

Story.hasOne(Images, {
    foreignKey: 'story_id',
    onDelete: 'CASCADE'
});

Images.belongsTo(Story, {
    foreignKey: 'story_id'
});

Story.hasOne(Prompts, {
    foreignKey: 'story_id',
    onDelete: 'CASCADE'
});

Prompts.belongsTo(Story, {
    foreignKey: 'story_id'
});

module.exports = { User, Story, Prompts, Images};