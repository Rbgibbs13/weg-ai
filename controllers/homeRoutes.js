const router = require('express').Router();
const { User, Story, Prompts, Images } = require('../models');
const authInput = require('../utils/auth');

router.get('/', async(req, res) => {
    try {
        console.log("homeRoutes");
        const imageData = await Images.findAll({
            // include: [
            //     {
            //         model: User,
            //     },
            // ],
        });

        const images = imageData.map((data) => data.get({ plain: true }));
        console.log(images);

        res.render('homepage', {
            images
            // logged_in: req.session.logged_in
        });
    } catch(error) {
        res.status(500).json(error);
    }
});

router.get('/login', authInput, (req, res) => {
    if(req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

module.exports = router;