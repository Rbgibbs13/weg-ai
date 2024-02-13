const router = require('express').Router();
const { Images } = require("../../models");

router.get('/', async(req, res) => {
    try {
        const imageData = await Images.findAll({});
        const images = imageData.map((data) => data.get({ plain: true }));
        console.log(images);
        res.json(images);
    } catch(error) {
        res.status(500).json(error);
    }
});

router.post('/save', async(req, res) => {
    console.log(req.body);
    try {
        const imageData = await Images.create({
            ...req.body
        });
        const images = imageData.map((data) => data.get({ plain: true }));
        res.status(200).json(images);
    } catch(error) {
        res.status(500).json(error);
    }
});

module.exports = router;