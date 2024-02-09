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
        prompts_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            validate : {
                isNumeric: true,
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