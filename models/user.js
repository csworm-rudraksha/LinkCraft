const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: function(v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: 'Please enter a valid email address'
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        lastLogin: {
            type: Date,
            default: null
        },
        urlCount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

const User = mongoose.model('user', userSchema);

module.exports = User;