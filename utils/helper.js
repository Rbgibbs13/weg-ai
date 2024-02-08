const { UUIDV4 } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const generateId = () => {return uuidv4()};