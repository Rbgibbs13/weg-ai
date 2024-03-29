const router = require('express').Router();

const promptRoutes = require("./promptRoutes");
const imageRoutes = require('./imageRoutes');
const storyRoutes = require('./storyRoutes');
const userRoutes = require('./userRoutes');

// localhost:3001/api/prompt
router.use('/prompts', promptRoutes);
// localhost:3001/api/image
router.use('/images', imageRoutes);
// localhost:3001/api/story
router.use('/story', storyRoutes);
// localhost:3001/api/user
router.use('/users', userRoutes);

module.exports = router;