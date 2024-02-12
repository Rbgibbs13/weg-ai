const OpenAI = require("openai");
require('dotenv').config();
const openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'], });
const path = require('path')
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const helpers = require('./utils/helper');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });

const sess = {
  secret: process.env.SECRET,
  cookie: {
    maxAge: 3600,
    httpOnly: false,
    secure: true,
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then( async() => {
    // await openai.chat.completions.create({
    //     messages: [{"role": "system", "content": "You are a marketing expert."},
    //         {"role": "user", "content": "Write a jingle for an underwear company."},],
    //     model: "gpt-3.5-turbo",});
    app.listen(PORT, () => console.log('Now listening http://localhost:3001'));
});

module.exports = OpenAI;