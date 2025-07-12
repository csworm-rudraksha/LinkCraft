const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
    {
        shortId: {
            type: String,
            required: true,
            unique: true,
        },
        redirectURL: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^https?:\/\/.+/.test(v);
                },
                message: 'URL must start with http:// or https://'
            }
        },
        visitHistory: [{
            timestamp: { type: Number },
            ip: { type: String },
            userAgent: { type: String }
        }],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        title: {
            type: String,
            default: 'Untitled URL'
        },
        isActive: {
            type: Boolean,
            default: true
        },
        expiresAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

const URL = mongoose.model('url', urlSchema);

module.exports = URL;
