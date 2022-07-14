const userModel = require("../DB/model/User");
const jwt = require("jsonwebtoken");

const roles = {
    Admin: "Admin",
    User: 'User'
}

const auth = (accessRoles) => {
    return async (req, res, next) => {
        try {
            const headerToken = req.headers['authorization'];
            if (!headerToken.startsWith(`Bearer `)) {
                res.status(400).json({ message: "in-valid header token" });
            } else {
                const token = headerToken.split(" ")[1];

                const decoded = jwt.verify(token, process.env.LOGIN_TOKEN);
                if (!decoded || !decoded.isLoggedIn) {
                    res.status(400).json({ message: "in-valid token" })
                } else {
                    const findUser = await userModel.findOne({ _id: decoded.id }).select('firstName lastName email role');
                    if (!findUser) {
                        res.status(404).json({ message: "in-valid account" });
                    } else {
                        if (!accessRoles.includes(findUser.role)) {
                            res.status(401).json({ message: "Not authorized account" });
                        } else {
                            req.user = findUser;
                            next();
                        }
                    }
                }
            }
        } catch (error) {
            res.status(500).json({ message: 'CATCH ERROR!', error });
        }
    }
}

module.exports = {
    auth,
    roles
}