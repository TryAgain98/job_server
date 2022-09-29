const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const moment = require("moment");
const config = require("./app/config/config.js")
var admin = require("firebase-admin")

var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

const app = express()

const http = require('http')
const server = http.createServer(app)

const corsOptions = {
  origin: "http://localhost:4200"
}

app.use(cors(corsOptions))

//setup firebase
var serviceAccount = require("./schedule-a4483-firebase-adminsdk-yd7mw-878f756725.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

// parse requests of content-type - application/json
app.use(bodyParser.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// database
const db = require("./app/models")
const Career = db.career;
const Company = db.company;
const Job = db.job;
db.sequelize.sync().then(() => {
  initial() // Just use it in development, at the first time execution!. Delete it in production
})


app.post('/uploads', upload.single('image'), function (req, res, next) {
  const img = req.file
  res.send(img)
})

app.use(express.static('uploads'))
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hi there, welcome to this tutorial" })
})
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

// api routes
require("./app/routes/auth.routes")(app)
require("./app/routes/user.routes")(app)
// require("./app/routes/role.routes")(app)
require("./app/routes/career.routes")(app)
require("./app/routes/job.routes")(app)
require("./app/routes/cv.routes")(app)

// set port, listen for requests
const PORT = config.PORT
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

function initial() {
  // //add data for table career
  // Career.create({
  //   id: 1,
  //   name: "IT",
  //   details: "lập trình IOS"
  // });
  // Career.create({
  //   id: 2,
  //   name: "IT",
  //   details: "lập trình Android",
  // });
  // // add data for table company
  // Company.create({
  //   id: 1,
  //   name: "Ngân Hàng Thương Mại Cổ Phần Quốc Tế Việt Nam",
  //   details: "Ngân hàng TMCP Quốc Tế Việt Nam, tên viết tắt là Ngân hàng Quốc Tế (VIB) được thành lập ngày 18 tháng 9 năm 1996, trụ sở đặt tại 111A Pasteur, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh.​",
  //   address: "Tầng 1, (Tầng trệt) và Tầng 2 Tòa nhà Sailing Tower, số 111A Pasteur, Phường Bến Nghé, Quận 1, Hồ Chí Minh",
  //   scale: "10000+ nhân viên"
  // });
  // Company.create({
  //   id: 2,
  //   name: "Protean Studios Co., Ltd",
  //   details: "Design Real Connections in a Connected World!",
  //   address: "Tòa nhà sông Đà, số 18 ngõ 165 Cầu Giấy, Hà Nội",
  //   scale: "25-99 nhân viên"
  // });
  // // Add data for table job
  // Job.create({
  //   id: 1,
  //   name: "Lập Trình Viên PHP /Laravel (Junior/Middle Level)",
  //   salary: "15-30 triệu",
  //   recruit_quantity: "5 người",
  //   sex: "Không yêu cầu",
  //   age: "Không yêu cầu",
  //   english_level: "đọc hiểu cơ bản",
  //   experience: "<p>- Có ít nhất 1 năm kinh nghiệm với PHP, MySQL và Laravel. </p><p>- Có khả năng làm việc độc lập và hướng dẫn nhóm.</p><p>- Đam mê, nhiệt huyết, dám thử thách, dám thành công.</p><p>- Có khả năng đề xuất, đưa ra giải pháp cho các vấn đề của project.</p><p>- Có khả năng xây dựng kiến trúc hệ thống, tối ưu hệ thống.</p>",
  //   other_requirements: "Biết DevOps là 1 lợi thế.",
  //   contact_info: "Liên hệ số điện thoại để biết thêm thông tin: 0123456789",
  //   area: "Hà Nội",
  //   work_address: "- Hà Nội: Tầng 2, tòa CIC số 2 phố Nguyễn Thị Duệ, Yên Hòa, Cầu Giấy, Hà Nội, Cầu Giấy",
  //   start_time: new Date().getTime(),
  //   end_time: moment(new Date()).add(30, 'd').valueOf(),
  //   careerId: 1,
  //   companyId: 1,
  //   level: "Junior"
  // });
  // Job.create({
  //   id: 2,
  //   name: "Java Developer (All Levels)",
  //   salary: "30 triệu",
  //   recruit_quantity: "50 người",
  //   sex: "Không yêu cầu",
  //   age: "Không yêu cầu",
  //   english_level: "đọc hiểu cơ bản",
  //   experience: "<p>- Có ít nhất 1 năm kinh nghiệm với PHP, MySQL và Laravel. </p><p>- Có khả năng làm việc độc lập và hướng dẫn nhóm.</p><p>- Đam mê, nhiệt huyết, dám thử thách, dám thành công.</p><p>- Có khả năng đề xuất, đưa ra giải pháp cho các vấn đề của project.</p><p>- Có khả năng xây dựng kiến trúc hệ thống, tối ưu hệ thống.</p>",
  //   other_requirements: "Good English communication skill and stakeholder management",
  //   contact_info: "Liên hệ số điện thoại để biết thêm thông tin: 0123456789",
  //   area: "Hà Nội",
  //   work_address: "- Hà Nội: Tầng 2, tòa CIC số 2 phố Nguyễn Thị Duệ, Yên Hòa, Cầu Giấy, Hà Nội, Cầu Giấy",
  //   start_time: new Date().getTime(),
  //   end_time: moment(new Date()).add(30, 'd').valueOf(),
  //   careerId: 2,
  //   companyId: 2,
  //   level: "Senior"
  // });
}
