const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Prompts extends Model {}

Prompts.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        scenario: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        prompt_one: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prompt_two: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prompt_three: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prompt_four: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        selected_prompt: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 3,
            },
        },
        story_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: "story",
                key: "id"
            }
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'prompts',
    }
);

module.exports = Prompts;