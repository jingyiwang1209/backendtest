const User = require("../models").user;
// const jwt = require("jwt-simple");
const jsonWebToken = require("jsonwebtoken");

const generateToken = user => {
    const timestamp = new Date().getTime();
    // return jwt.encode({ sub: user.id, iat: timestamp }, "sfasfdsfwegkal");
    return new Promise((resolve, reject) => {
        jsonWebToken.sign(
            { sub: user.id, iat: timestamp },
            "sfasfdsfwegkal",
            function(err, token) {
                console.log("token", token);
                if (err) {
                    return reject(err);
                }
                return resolve(token);
            }
        );
    }).then((res, err) => {
        if (res) {
            console.log("res", res);
            return res;
        } else {
            return err;
        }
    });
};

module.exports.signup = (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const username = req.body.username;
        const sex = req.body.sex;
        const age = req.body.age;
        const city = req.body.city;
        const yearOfLiving = req.body.yearOfLiving;
        const hometown = req.body.hometown;
        const school = req.body.school;
        const major = req.body.major;
        const language = req.body.language;
        const hobby = req.body.hobby;
        const personality = req.body.personality;

        User.findOrCreate({
            where: { mail: email },
            defaults: {
                mail: email,
                password: password,
                username: username,
                sex: sex,
                age: age,
                city: city,
                yearOfLiving: yearOfLiving,
                hometown: hometown,
                school: school,
                major: major,
                language: language,
                hobby: hobby,
                personality: personality
            }
        }).spread((user, created) => {
            // console.log(user.get({plain:true}));
            // console.log(created);
            if (!created) {
                res.status(422).send({ error: "Email already in use!" });
            } else {
                // res.send({ token: generateToken(user) });
            }
        });
    } catch (e) {
        next(e);
    }
};

module.exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ where: { mail: email } }).then(user => {
        if (!user) {
            res.status(422).send({ error: "Cannot find your email!" });
        } else {
            let promise = user.comparePassword(password);
            promise.then((response, err) => {
                if (response) {
                    res.send('correct!');
                } else {
                    res.status(422).send({ error: "Incorret password!" });
                }
            });
        }
    });
};