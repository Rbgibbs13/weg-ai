const router = require('express').Router();
const { User, Story, Prompts, Images } = require('../models');
const authInput = require('../utils/auth');

router.get('/', async(req, res) => {
    try {
        const storyData = await Story.findAll({

        });

        const stories = storyData.map((data) => data.get({ plain: true}));
        res.render('story', {
            stories
        });
    } catch(error) {
        res.status(500).json(error);
    }
});

router.get('/story:id', async (req, res) => {
    try {
        const storyData = await Project.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    model: Prompts,
                    model: Images,
                },
            ],
        });

        const story = storyData.get({ plain: true });
        res.render('story', {
            story,
            logged_in: req.session.logged_in
        });
    } catch(error) {
        res.status(500).json(error);
    }
});

module.exports = router;