const router = require('express').Router();
const { User, Story, Prompts, Images } = require('../models');
const authInput = require('../utils/auth');

router.get('/', async(req, res) => {
    try {
        const imageData = await Images.findAll({
            include: [
                {
                    model: User,
                },
            ],
        });

        console.log(imageData);

        const images = imageData.map((data) => data.get({ plain: true }));

        res.render('homepage', {
            images,
            logged_in: req.session.logged_in
        });
    } catch(error) {
        res.status(500).json(error);
    }
});