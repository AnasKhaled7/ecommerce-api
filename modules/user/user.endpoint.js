const { roles } = require("../../middleware/auth");

const endpoint = {
    displayProfile: [roles.Admin, roles.User]
}

module.exports = endpoint;