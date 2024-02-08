const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Images extends Model {}

Images.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: true,
            }
        },
        images_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'story',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'images',
    }
);

module.exports = Images;