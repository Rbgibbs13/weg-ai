const router = require('express').Router();

const apiRoutes = require("./api");
const homeRoutes = require('./homeRoutes');
const storyRoutes = require('./storyRoutes');

//localhost:3001/
router.use('/', homeRoutes);
//localhost:3001/story
router.use('/story', storyRoutes);
//localhost:3001/api
router.use('/api', apiRoutes);

module.exports = router;