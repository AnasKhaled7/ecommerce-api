const userModel = require("../../../DB/model/User");
const sendEmail = require("../../../services/email");


const getAllUsers = async (req, res) => {
    const users = await userModel.find({ role: { $nin: ['Admin'] } });
    res.json({ users })
}

const blockUser = async (req, res) => {
    const { id } = req.params;
    const user = await userModel.findOne({ _id: id });
    // if condition means admin blocking admin and this is not allowed
    if (user.role == req.user.role) {
        res.status(401).json({ message: "you can't block user of with same role" })
    } else {
        await userModel.findByIdAndUpdate(user._id, { isBlocked: true })
        sendEmail(user.email, `<p>Your account hase been blocked, please contact us to re-open your account</p>`, 'Account Blocked')
        res.json({ message: "user blocked" })
    }
}

module.exports = {
    getAllUsers,
    blockUser
}