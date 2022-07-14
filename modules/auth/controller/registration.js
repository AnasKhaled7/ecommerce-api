const userModel = require("../../../DB/model/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require("../../../services/email");

// signup
const signup = async (req, res) => {
    try {
        const { firstName, LastName, email, password } = req.body;
        const newUser = new userModel({ firstName, LastName, email, password });
        // savedUser will contain an object
        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, process.env.EMAIL_TOKEN, { expiresIn: 10 * 60 });
        const link = `${req.protocol}://${req.headers.host}/api/auth/confirmEmail/${token}`;
        const link2 = `${req.protocol}://${req.headers.host}/api/auth/refreshEmail/${savedUser._id}`;
        const message = `<a href='${link}'>Click Here To Confirm Your Email</a> 
        <br>
        <a href='${link2}'>Re-Send Confirmation Link</a>`;
        sendEmail(savedUser.email, message, 'Confirmation Email');
        res.status(201).json({ message: 'user added successfully' });
    } catch (error) {
        // if condition to return customized message if email already exists in DB
        if (error.keyValue?.email) {
            res.status(409).json({ message: 'email exists' });
        } else {
            res.status(500).json({ message: 'CATCH ERROR!', error });
        }
    }
}

// confirm email
const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.EMAIL_TOKEN);
        if (!decoded) {
            res.status(400).json({ message: "In-valid token" });
        } else {
            const user = await userModel.findById(decoded.id).select('isConfirmed');
            if (!user) {
                res.status(404).json({ message: "In-valid token" });
            } else {
                if (user.isConfirmed) {
                    res.status(400).json({ message: "already confirmed" });
                } else {
                    await userModel.findOneAndUpdate({ _id: user._id }, { isConfirmed: true }, { new: true });
                    res.status(200).json({ message: "email confirmed successfully" });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'CATCH ERROR!', error });
    }
}

// refresh email
const refreshEmail = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userModel.findById(id).select("isConfirmed email");
        if (!user) {
            res.status(404).json({ message: "in-valid account" });
        } else {
            if (user.isConfirmed) {
                res.status(400).json({ message: "already confirmed" });
            } else {
                const token = jwt.sign({ id: user._id }, process.env.EMAIL_TOKEN, { expiresIn: 5 * 60 });
                const link = `${req.protocol}://${req.headers.host}/api/auth/confirmEmail/${token}`;
                const link2 = `${req.protocol}://${req.headers.host}/api/auth/refreshEmail/${user._id}`;
                const message = `<a href='${link}'>Click Here To Confirm Your Email</a> 
                <br>
                <a href='${link2}'>Re-Send Confirmation Link</a>`;
                sendEmail(user.email, message, 'Confirmation Email');
                res.status(200).json({ message: "sent successfully" });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'CATCH ERROR!', error });
    }
}

// login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'in-valid email' });
        } else {
            if (!user.isConfirmed) {
                res.status(404).json({ message: 'email is not confirmed' });
            } else {
                if (user.isBlocked) {
                    res.status(400).json({ message: "This account is BLOCKED" })

                } else {
                    // match will be boolean
                    const match = await bcrypt.compare(password, user.password);
                    if (!match) {
                        res.status(400).json({ message: 'password mismatch' });
                    } else {
                        const token = jwt.sign({ id: user._id, isLoggedIn: true }, process.env.LOGIN_TOKEN, { expiresIn: '24h' });
                        res.status(200).json({ message: 'login successfully', token });
                    }
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'CATCH ERROR!', error });
    }
}

// send code 
const sendCode = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'in-valid email' });
        } else {
            // code will be 4 random digits 
            const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
            await userModel.findByIdAndUpdate(user._id, { code });
            sendEmail(user.email, `<p>use this code to update your password: ${code}</p>`, 'Forget Password');
            res.status(200).json({ message: "code sent", code });
        }
    } catch (error) {
        res.status(500).json({ message: 'CATCH ERROR!', error });
    }
}

// forget password
const forgetPassword = async (req, res) => {
    try {
        const { code, email, newPassword } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'in-valid email' })
        } else {
            if (user.code != code) {
                res.status(400).json({ message: "In-valid auth code" })
            } else {
                const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT))
                await userModel.findOneAndUpdate({ _id: user._id }, { password: hashedPassword, code: "" })
                res.status(200).json({ message: "password updated successfully" })
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'CATCH ERROR!', error });
    }
}

module.exports = {
    signup,
    confirmEmail,
    refreshEmail,
    login,
    sendCode,
    forgetPassword
}