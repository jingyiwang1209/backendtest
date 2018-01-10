const Activity = require("../models").Activity;
const User = require("../models").User;
const ActivityLikes = require("../models").ActivityLikes;
const Rating = require("../models").Rating;

module.exports.addActivity = (req, res, next) => {
    try {
        const images = req.body.images;
        const imageURLs = images.map(image => {
            let imageURL = image[0].preview.slice(5);
            return imageURL;
        });

        const {
            theme,
            location,
            departdate,
            finishdate,
            budget,
            services,
            story
        } = req.body;
        const userId = req.user.id;
        // console.log("userId", userId);
        Activity.findOrCreate({
            where: {
                theme,
                location,
                departdate,
                finishdate,
                budget,
                services,
                story,
                images: imageURLs,
                userId
            },
            default: {
                theme,
                location,
                departdate,
                finishdate,
                budget,
                services,
                story,
                images: imageURLs,
                userId
            }
        }).spread((activity, created) => {
            if (!created) {
                res.send("This activity is already created");
            } else {
                res.send("This activity is successfully created!");
            }
        });
    } catch (e) {
        next(e);
    }
};

module.exports.fetchActivity = (req, res, next) => {
    try {
        let response = [];
        Activity.findAll().then(activities => {
            let length = activities.length;
            for (var i = 0; i < length; i++) {
                const data = activities[i].dataValues;
                const activityId = data.id;
                const userId = data.userId;
                ActivityLikes.findOrCreate({
                    where: { activityId },
                    defaults: {
                        numOfLikes: 0,
                        userMarkers: ""
                    }
                })
                    .spread((activity, created) => {
                        data.likes = activity.numOfLikes;
                    })
                    .then(() => {
                        User.findById(userId).then(user => {
                            data.username = user.username;
                            response.push(data);
                            if (response.length == length) {
                                res.send(response);
                            }
                        });
                    });
            }
        });
    } catch (e) {
        next(e);
    }
};

module.exports.fetchOneActivity = (req, res, next) => {
    const activityId = req.params.activityId;
    let data;
    Activity.findById(activityId)
        .then(activity => {
            data = activity.dataValues;
        })
        .then(() => {
            User.findById(data.userId)
                .then(user => {
                    data.username = user.username;
                })
                .then(() => {
                    res.send(data);
                });
        });
};

module.exports.clickLikes = (req, res, next) => {
    const userId = req.user.id;
    const activityId = req.params.activityId;
    const userMarker = userId + ";";

    let result = {};

    ActivityLikes.findOrCreate({
        where: { activityId },
        defaults: {
            userMarkers: "" + userMarker,
            numOfLikes: 1
        }
    }).spread((activity, created) => {
        if (created) {
            result[activityId] = activity.numOfLikes;
            res.send(result);
        } else {
            if (activity.userMarkers.includes(userMarker)) {
                activity
                    .update({
                        userMarkers: activity.userMarkers.replace(
                            userMarker,
                            ""
                        ),
                        numOfLikes: activity.numOfLikes - 1
                    })
                    .then(() => {
                        result[activityId] = activity.numOfLikes;
                        res.send(result);
                    });
            } else {
                activity
                    .update({
                        userMarkers: activity.userMarkers + userMarker,
                        numOfLikes: activity.numOfLikes + 1
                    })
                    .then(() => {
                        result[activityId] = activity.numOfLikes;
                        res.send(result);
                    });
            }
        }
    });
};