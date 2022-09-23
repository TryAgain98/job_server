const db = require("../models");
const User = db.user;

checkDuplicatePhoneOrEmail = async (req, res, next) => {
  try {
    const { phone, email, display_name } = req.body;
    var exitPhone = await User.findOne({
      where: { phone },
    });

    if (exitPhone) {
      return res.status(401).send({ message: "Số điện thoại đã tồn tại" });
    }
    var exitEmail = await User.findOne({
      where: { email },
    });

    if (exitEmail) {
      return res.status(401).send({ message: "Email đã tồn tại" });
    }
    if(!!display_name) {
      var exitDisplayName = await User.findOne({
        where: { display_name },
      });
  
      if (exitDisplayName) {
        return res.status(401).send({ message: "Tên đã tồn tại" });
      }
    }
    next()
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
};

const verifySignUp = {
  checkDuplicatePhoneOrEmail,
};

module.exports = verifySignUp;
