const Fact = require('../models/frog_fact');
const User = require('../models/user');

module.exports = (app) => {
    app.post("/add", (req, res) => {
        if (req.user) {
            var fact = new Fact(req.body);
            fact.author = req.user._id;
            fact.save().then(fact => {
                return User.findById(req.user._id);
            }).then(user => {
                user.facts.unshift(fact);
                user.save();
                res.json({
                    status: 200,
                    message: {
                      message: "Your account has been created!"
                    },
                });
            }).catch(err => {
                console.log(err.message);
            });
        } else {
            return res.status(401); // UNAUTHORIZED
        }
    });

};