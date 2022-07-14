const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'User'
    },
    phone: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    profilePic: {
        type: String
    },
    coverPics: {
        type: Array
    },
    QrCode: {
        type: String
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    whishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    code: {
        type: String
    }
}, {
    timestamps: true
});

// hashing password when signup
userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, parseInt(process.env.SALT));
    next();
});

// increament the version of the user on any update
userSchema.pre('findOneAndUpdate', async function (next) {
    // this.model returns the model (User)
    // this.getQuery() returns the _id of the user
    const hookData = await this.model.findOne(this.getQuery()).select('__v');
    this.set({ __v: hookData.__v + 1 })
    next();
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;