const UserModel = require("../Model/UserModel");
const emailSender = require("../utility/DynamicEmailSender");
const jwt = require("jsonwebtoken");
const promisify = require("util").promisify;
const promisifiedJWTSign = promisify(jwt.sign);
const promisifiedJWTVerify = promisify(jwt.verify);
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET_KEY =
  process.env.JWT_SECRET_KEY || "fallback-secret-change-me";
const isProduction = process.env.NODE_ENV === "production";

async function forgetPasswordHandler(req, res) {
  try {
    /****
     * 1. user send the email : extract email
     * 2. check if email is present in DB (user)
     * if email is not present -> send a response to the user(user not found)
     * *  if email is present ->
     * 3. create basic otp ->
     *        * user  ke saath token map krdo
     *        *  send to the email
     * 4. url -> reset url -> id
     *
     * ***/
    //1.
    if (req.body.email == undefined) {
      return res.status(401).json({
        status: "failure",
        message: "Please enter the email for forget Password",
      });
    }
    //2.
    const user = await UserModel.findOne({ email: req.body.email });
    if (user == null) {
      return res.status(404).json({
        status: "failure",
        message: "user not found for this email",
      });
    }
    //3.
    const otp = otpGenerator();
    user.otp = otp;
    user.otpExpiry = Date.now() + 1000 * 60 * 10;

    await user.save({ validateBeforeSave: false });
    //  send email
    // email -> req.body.email
    // otp -> add

    const templateData = { name: user.name, otp: user.otp };
    // Email sending won't throw errors anymore - it logs them internally
    await emailSender("../templates/otp.html", user.email, templateData);

    res.status(200).json({
      message: "otp is send successfully",
      status: "success",
      otp: otp,
      user: user,
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.message,
      status: "failure",
    });
  }
}

async function resetPasswordHandler(req, res) {
  try {
    /**
     * 1. id ,  id
     * 2. if otp , password , confirmPassword are present
     *      *  otp should n't be expires
     *      * otp compare -> if matches
     *      *  password update
     *      *  re-route them to login page
     * ***/
    let resetDetails = req.body;
    // required fields are there or not
    if (
      !resetDetails.password ||
      !resetDetails.confirmPassword ||
      !resetDetails.otp ||
      resetDetails.password != resetDetails.confirmPassword
    ) {
      return res.status(401).json({
        status: "failure",
        message: "invalid request",
      });
    }
    const user = await UserModel.findOne({ email: req.body.email });
    // if user is not present
    if (user == null) {
      return res.status(404).json({
        status: "failure",
        message: "user not found",
      });
    }
    // if otp is not present  in db user
    if (user.otp == undefined) {
      return res.status(401).json({
        status: "failure",
        message: "unauthorized acces to reset Password",
      });
    }

    // if otp is expired
    if (Date.now() > user.otpExpiry) {
      return res.status(401).json({
        status: "failure",
        message: "otp expired",
      });
    }
    // if otp is incorrect
    if (user.otp != resetDetails.otp) {
      return res.status(401).json({
        status: "failure",
        message: "otp is incorrect",
      });
    }
    user.password = resetDetails.password;
    user.confirmPassword = resetDetails.confirmPassword;
    // remove the otp from the user
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    res
      .clearCookie("jwt", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
      })
      .status(200)
      .json({
        status: "success",
        message: "password reset successfully",
      });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.message,
      status: "failure",
    });
  }
}

async function signupHandler(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // 1. Validate required fields
    if (!email || !password || !name || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Email and password required", status: "failure" });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Passwords do not match", status: "failure" });
    }

    // 2. Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already signed up", status: "failure" });
    }
    // 5. Create new user
    const newUser = await UserModel.create({
      name,
      email,
      password,
      confirmPassword,
      // other optional fields can be added here
    });

    // 6. Generate JWT token
    const authToken = await promisifiedJWTSign(
      { id: newUser._id },
      process.env.JWT_SECRET_KEY,
    );

    // 7. Option A: Send token in cookie
    res.cookie("jwt", authToken, {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: isProduction,
      httpOnly: true,
      sameSite: "lax",
    });
    // TODO: send welcome email (must be before sending HTTP response)
    const templateData = { name: newUser.name, email: newUser.email };
    // Email sending won't throw errors anymore - it logs them internally
    await emailSender("../templates/welcome.html", newUser.email, templateData);

    // Send successful signup response
    res.status(201).json({
      message: "User signed up successfully",
      user: newUser,
      status: "success",
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(501).json({ messages: err.message, status: "failure" });
  }
}
async function loginHandler(req, res) {
  // email,password -> if exist -> allow login
  //  cookies -> JWT -> they will bring back the token -> protected Route
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Invalid email or password",
        status: "failure",
      });
    }
    // hash the password
    {
      /*console.log(password, user.password);*/
    }
    const areEqual = await bcrypt.compare(password, user.password);
    if (!areEqual) {
      return res.status(400).json({
        message: "Invalid email or password",
        status: "failure",
      });
    }

    // token create
    const authToken = await promisifiedJWTSign(
      { id: user["_id"] },
      JWT_SECRET_KEY,
    );
    // // token -> cookies
    res.cookie("jwt", authToken, {
      maxAge: 1000 * 60 * 60 * 24,
      secure: isProduction,
      httpOnly: true,
      sameSite: "lax",
    });
    // // res send
    res.status(200).json({
      message: "login successfully",
      status: "success",
      user: user,
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: err.message,
      status: "failure",
    });
  }
}

const otpGenerator = function () {
  return Math.floor(100000 + Math.random() * 900000);
};
const protectRouteMiddleWare = async function (req, res, next) {
  try {
    const jwttoken = req.cookies?.jwt;
    if (!jwttoken) {
      return res.status(401).json({
        message: "UnAuthorized!",
        status: "failure",
      });
    }

    const decryptedToken = await promisifiedJWTVerify(
      jwttoken,
      process.env.JWT_SECRET_KEY,
    );
    if (!decryptedToken?.id) {
      return res.status(401).json({
        message: "Invalid token",
        status: "failure",
      });
    }

    req.userId = decryptedToken.id;
    console.log("authenticated");

    if (typeof next === "function") {
      return next();
    }

    return res.status(500).json({
      message: "Auth middleware misconfigured",
      status: "failure",
    });
  } catch (err) {
    return res.status(401).json({
      message: err.message,
      status: "failure",
    });
  }
};
const logoutController = function (req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
  });

  res.status(200).json({
    status: "success",
    message: "user logged out ",
  });
};
module.exports = {
  forgetPasswordHandler,
  resetPasswordHandler,
  signupHandler,
  loginHandler,
  logoutController,
  protectRouteMiddleWare,
};
