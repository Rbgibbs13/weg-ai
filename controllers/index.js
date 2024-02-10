const router = require('express').Router();

// const apiRoutes = require("./api");
const homeRoutes = require('./homeRoutes');
// const storyRoutes = require('./storyRoutes');

router.use('/', homeRoutes);
// router.use('/story', storyRoutes);
// router.use('/api', apiRoutes);

module.exports = router;