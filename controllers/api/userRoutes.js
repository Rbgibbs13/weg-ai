const router = require('express').Router();
const { User } = require('../../models');

// http://localhost:3001/api/user
router.post('/user', async(req, res) => {
    try {
        const userData = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.status(200).json(userData);
        });
    } catch(error) {
        res.status(400).json(error);
    }
});

// http://localhost:3001/api/login
router.post('/login', async(req, res) => {
    try {
        const userData = User.findOne({
            where: {
                email: req.body.email,
                user_name: req.body.user_name
            }
        });

        if (!userData) {
            res.status(400).json({ message: 'No user found, please set up an account' });
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);
        if(!validPassword) {
            res.status(400).json({ message: "Incorrect password, please try again" });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            req.json({ user: userData, message: 'Logged in successfully!'});
        });
    } catch(error) {
        res.status(400).json(error);
    }
});

// http://localhost:3001/api/logout
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
});

module.exports = router;