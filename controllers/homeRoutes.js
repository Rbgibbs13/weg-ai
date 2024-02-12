const router = require('express').Router();
const { User, Story, Prompts, Images } = require('../models');
const authInput = require('../utils/auth');

router.get('/', async(req, res) => {
    try {
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

router.get('/game', (req, res) => {
    try {
        const gameData = "";
        res.render('game', {});
    } catch(error) {
        res.status(500).json(error);
    }
});

router.get('/quiz', (req, res) => {
    try {
        res.render('quiz', {});
    } catch(error) {
        res.status(500).json(error);
    }
});

router.get('/profile', authInput, async (req, res) => {
    try {
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Story }],
      });
  
      const user = userData.get({ plain: true });
  
      res.render('profile', {
        ...user,
        logged_in: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

router.get('/login', authInput, (req, res) => {
    if(req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/logout', authInput, (req, res) => {
    if(!req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('logout');
})

module.exports = router;