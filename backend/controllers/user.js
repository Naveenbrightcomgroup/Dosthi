const {
    validateEmail,
    validateLength,
    validateUsername
} = require("../helpers/validate");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const User = require("../models/user");
const { validateToken } = require("../helpers/token");
const { sendVerificationEmail, sendResetCode } = require("../helpers/mailer");
const Code = require("../models/code")
const generateCode = require("../helpers/generatecode")
exports.register = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password,
            username,
            bYear,
            bMonth,
            bDay,
            gender
        } = req.body;
        if (!validateEmail(email)) {
            return res.status(400).json({
                message: "Invalid Email Address"
            });
        }
        const check = await User.findOne({ email });
        if (check) {
            return res.status(400).json({
                message: "Email already exists try with different email address"
            })
        }
        if (!validateLength(first_name, 3, 30)) {
            return res.status(400).json({
                message: "first name between 3 to 30 charectors"
            })
        }
        if (!validateLength(last_name, 3, 10)) {
            return res.status(400).json({
                message: "last name between 3 to 10 charectors"
            })
        }
        if (!validateLength(password, 6, 10)) {
            return res.status(400).json({
                message: "password between 6 charectors"
            })
        }
        const cryptpassword = await bcrypt.hash(password, 12)
        let tempusername = first_name + last_name;
        let newusername = await validateUsername(tempusername);
        const user = await new User({
            first_name,
            last_name,
            email,
            password: cryptpassword,
            username: newusername,
            bYear,
            bMonth,
            bDay,
            gender
        }).save();
        const verificationToken = validateToken({
            id: user._id.toString()
        },
            "30m"
        );
        const url = `${process.env.BASE_URL}/activate/${verificationToken}`;
        sendVerificationEmail(user.email, user.first_name, url);
        const token = validateToken({ id: user._id.toString() }, "7d");
        res.send({
            id: user._id,
            username: user.username,
            picture: user.picture,
            first_name: user.first_name,
            last_name: user.last_name,
            token: token,
            verified: user.verified,
            message: "Register Success ! please activate your email to start",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

exports.activateAccount = async (req, res) => {
    try {
        const validUser = req.user.id;
        const { token } = req.body
        const user = jwt.verify(token, process.env.TOKEN_SCRECT);
        const check = await User.findById(user.id)
        if (validUser !== user.id) {
            return res.status(400).json({ message: "you don't have Authenticated User" })
        }
        if (check.verified == true) {
            return res.status(400).json({ message: "this mail is already exists" })
        } else {
            await User.findByIdAndUpdate(user.id, { verified: true });
            return res
                .status(200)
                .json({ messsage: "Account has been Activated" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "The entered email address not connected to ur account." })
        }
        const check = await bcrypt.compare(password, user.password);
        if (!check) {
            return res.status(400).json({ message: "Invalid credentials, Please try again" })
        }
        const token = validateToken({ id: user._id.toString() }, "7d");
        res.send({
            id: user._id,
            username: user.username,
            picture: user.picture,
            first_name: user.first_name,
            last_name: user.last_name,
            token: token,
            verified: user.verified,
            message: "Register Success ! please activate your email to start",
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.sendVerification = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id);
        if (user.verified === true) {
            return res.status(400).json({
                message: "This account is already activated.",
            });
        }
        const verificationToken = validateToken({
            id: user._id.toString()
        },
            "30m"
        );
        const url = `${process.env.BASE_URL}/activate/${verificationToken}`;
        sendVerificationEmail(user.email, user.first_name, url);
        return res.status(200).json({
            message: "Email verification link has been sent to your email.",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.findUser = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email }).select("-password")
        if (!user) {
            return res.status(400).json({
                message: "Account doesn't exists",
            })
        }
        return res.status(200).json({
            email: user.email,
            picture: user.picture
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.sendResetPasswordCode = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email }).select("-password")
        await Code.findOneAndRemove({ user: user._id })
        const code = generateCode(5)
        const savedcode = await new Code({
            code,
            user: user._id
        }).save();
        sendResetCode(user.email, user.first_name, code)
        return res.status(200).json({
            message: "email Reset code has been send to email"
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.validateResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        console.log(code)
        const user = await User.findOne({ email });
        const Dbcode = await Code.findOne({
            user: user._id,
        });
        console.log(user._id)
        if (Dbcode.code !== code) {
            return res.status(400).json({
                message: "Verfication does't exists",
            })

        }
        return res.status(200).json({ message: "ok" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.changepassword = async (req, res) => {
    const { email, password } = req.body
    const cryptPassword = await bcrypt.hash(password, 12)
    await User.findOneAndUpdate(
        { email },
        {
            password: cryptPassword
        }
    );
    return res.status(200).json({ message: "ok" })
}