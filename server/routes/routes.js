const passportService = require("../middleware/passport");
const passport = require("passport");

const signupController = require("../controllers/authenticate").signup;
const loginController = require("../controllers/authenticate").login;
const addWish = require("../controllers/wish").addWish;
const fetchWish = require("../controllers/wish").fetchWish;

const addActivity = require("../controllers/activity").addActivity;
const fetchActivity = require("../controllers/activity").fetchActivity;
const clickLikes = require("../controllers/activity").clickLikes;
const fetchOneActivity = require("../controllers/activity").fetchOneActivity;
const fetchUser = require("../controllers/user").fetchUser;



const requireAuth = passport.authenticate("jwt", { session: false });
const requireLogin = passport.authenticate("local", { session: false });

module.exports = app => {
    app.post("/api/signup", signupController);
    app.post("/api/login", requireLogin, loginController);
    app.post("/api/addWish", requireAuth, addWish);
    app.get("/api/fetchWish", requireAuth, fetchWish);
    app.post("/api/addActivity", requireAuth, addActivity);
    app.get("/api/fetchActivity", fetchActivity);
    app.post("/api/clickLikes/:activityId", requireAuth, clickLikes);
    app.get("/api/activity/:activityId", fetchOneActivity);
    app.get("/api/user/:userId", fetchUser);
};