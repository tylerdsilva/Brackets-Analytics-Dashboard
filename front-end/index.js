const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
// const athenaHandler = require("athena-express.js");

// this is to tell express that static content is available
// on the directory 'public' to render
app.use(express.static(path.join(__dirname, "public/")));
app.use(express.urlencoded({ extended: true }));

// setting the view engine
app.set("view engine", "ejs");

// URL Route mappings
app.get("/", (req, res) => {
    res.render("index"); // index refers to index.ejs
});

app.get("/map", (req, res) => {
    res.render("map"); // index refers to index.ejs
});

app.get("/predictions", (req, res) => {
    res.render("predictions"); // index refers to index.ejs
});

app.get("/event_metrics", (req, res) => {
    res.render("event_metrics"); // index refers to index.ejs
});

//AJAX Request Handling to render the data back
// User Metrics
app.post("/getActiveUsers", (req, res) => {
    res.json({
       labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
       data: [15, 30, 55, 65, 60, 80, 95] 
    });
});

app.post("/getReturningUsers", (req, res) => {
    res.json({
       labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
       data: [15, 30, 55, 45, 70, 65, 85] 
    });
});

app.post("/perPlatformUsers", (req, res) => {
    res.json({
       labels: ["MacOS", "Windows"],
       data: [554567, 234567] 
    });
});

app.post("/getTopCountries", (req, res) => {
    res.json({
       labels: ["Italy", "France", "Spain", "USA", "Argentina"],
       data: [55, 49, 44, 24, 15] 
    });
});




//User Action Metrics

app.post("/getUserAction", (req, res) => {
    console.log("/getUserAction " + req.body.data);
    res.json({
       labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
       data: [15, 30, 55, 65, 60, 80, 95] 
    });
});

app.post("/topProgrammingLanguages", (req, res) => {
    console.log("/topProg " + req.body.data);
    res.json({
       labels: ["HTML", "PHP", "Java"],
       data: [554567, 234567, 234000] 
    });
});

app.post("/getLivePreview", (req, res) => {
    console.log("/live " + req.body.data);
    res.json({
       labels: ["India", "USA", "Canada", "Mexico", "Brazil"],
       data: [15, 30, 55, 65, 60] 
    });
});

// this method calls user's prediction
app.post("/getUsersPrediction", (req, res) => {
    const result = athenaHandler.getting_user_prediction
    console.log("/UsersPrediction " + req.body.data);
    res.json({
       labels: result.labels,
       data: result.data 
    });
});

//Server Listen with Port number
app.listen(port, () => {
  console.log("server started on port 3000");
});