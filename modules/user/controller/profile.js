const userModel = require("../../../DB/model/User");
const bcrypt = require('bcryptjs');

const displayProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        res.status(200).json({ message: 'success', user });
    } catch (error) {
        res.status(500).json({ message: 'CATCH ERROR!', error });
    }
}

const profilePic = async (req, res) => {
    try {
        if (req.fileErr) {
            res.status(400).json({ message: 'in-valid format' });
        } else {
            const imageURL = `${req.finalDestination}/${req.file.filename}`;
            await userModel.findByIdAndUpdate(req.user._id, { profilePic: imageURL }, { new: true });
            res.status(200).json({ message: 'updated successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'CATCH ERROR!', error });
    }
}

const coverPic = async (req, res) => {
    try {
        if (req.fileErr) {
            res.status(400).json({ message: 'in-valid format' });
        } else {
            const imageURL = [];
            req.files.forEach(file => {
                imageURL.push(`${req.finalDestination}/${file.filename}`)
            });
            await userModel.findByIdAndUpdate(req.user._id, { coverPics: imageURL }, { new: true });
            res.status(200).json({ message: 'updated successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'CATCH ERROR!', error });
    }
}

const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (oldPassword == newPassword) {
            res.status(409).json({ message: "no changes happened" })
        } else {
            const user = await userModel.findById(req.user._id);
            // match return boolean
            const match = await bcrypt.compare(oldPassword, user.password);
            if (!match) {
                res.status(400).json({ message: "in-valid old password" });
            } else {
                const hashPassword = await bcrypt.hash(newPassword, parseInt(process.env.SALT));
                await userModel.findByIdAndUpdate(user._id, { password: hashPassword });
                res.status(200).json({ message: "updated successfully" });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'CATCH ERROR!', error });
    }
}

module.exports = {
    displayProfile,
    profilePic,
    coverPic,
    updatePassword
}