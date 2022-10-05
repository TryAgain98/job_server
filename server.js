const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./app/config/config.js");
var admin = require("firebase-admin");
const mockCareer =  require("./app/constants/mockCareer.js");
const mockJob =  require("./app/constants/mockJob.js");
const mockCompany =  require("./app/constants/mockCompany.js");

var multer = require("multer");
var upload = multer({ dest: "uploads/" });

const app = express();

const http = require("http");
const server = http.createServer(app);

const corsOptions = {
  origin: "http://localhost:4200",
};

app.use(cors(corsOptions));

//setup firebase
var serviceAccount = require("./schedule-a4483-firebase-adminsdk-yd7mw-878f756725.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Career = db.career;
const Company = db.company;
const Job = db.job;
db.sequelize.sync().then(() => {
  initial();
});

app.post("/uploads", upload.single("image"), function (req, res, next) {
  const img = req.file;
  res.send(img);
});

app.use(express.static("uploads"));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hi there, welcome to this tutorial" });
});
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// api routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
// require("./app/routes/role.routes")(app)
require("./app/routes/career.routes")(app);
require("./app/routes/job.routes")(app);
require("./app/routes/cv.routes")(app);

// set port, listen for requests
const PORT = config.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function initial() {
  // //add data for table career
  mockCareer.careers.forEach((element) => {
    Career.create(element);
  });
 
  // // add data for table company
  mockCompany.companies.forEach((element) => {
    Company.create(element);
  });

  // // Add data for table job
  mockJob.jobs.forEach((element) => {
    Job.create(element);
  });
}
