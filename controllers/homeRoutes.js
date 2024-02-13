const router = require('express').Router();
const { User, Story, Prompts, Images } = require('../models');
const authInput = require('../utils/auth');

//localhost:3001/
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

//localhost:3001/game
router.get('/game', (req, res) => {
    try {
        const gameData = "";
        res.render('game', {});
    } catch(error) {
        res.status(500).json(error);
    }
});

//localhost:3001/quiz
router.get('/quiz', (req, res) => {
    try {
        res.render('quiz', {});
    } catch(error) {
        res.status(500).json(error);
    }
});

//localhost:3001/profile
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

//localhost:3001/login
//needs authInput to function correctly once login and profile are set up
router.get('/login', (req, res) => {
    res.render('login');

    if(req.session.logged_in) {
        res.redirect('/profile');
        return;
    }

    // res.render('login');
});

//localhost:3001/logout
router.get('/logout', authInput, (req, res) => {
    if(!req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('logout');
});

module.exports = router;