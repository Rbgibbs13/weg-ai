const router = require('express').Router();
const { Story } = require('../../models');
const authInput = require('../../utils/auth');

// http://localhost:3001/api/story
router.get('/', async(req, res) => {
    try {
        const storyData = await Story.findAll({});
        const stories = storyData.map((data) => data.get({ plain: true}));
        res.status(200).json(stories);
    } catch(error) {
        res.status(500).json(error);
    }
});

router.post('/generate', async(req, res) => {
    try {
        const newStory = await Story.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(newStory);
    } catch(error) {
        res.status(400).json(error);
    }
});

router.delete('/:id', authInput, async(req, res) => {
    try {
        const storyData = await Project.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!storyData) {
            res.status(404).json({ message: 'No story found with this id!' });
            return;
          }
    } catch(error) {
        res.status(500).json(err);
    }
});

module.exports = router;