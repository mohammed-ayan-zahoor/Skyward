"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Installation = void 0;
const mongoose_1 = require("mongoose");
const photoSchema = new mongoose_1.Schema({
    imageUrl: { type: String, required: true },
    caption: { type: String },
    sortOrder: { type: Number, default: 0 },
    isCover: { type: Boolean, default: false },
}, {
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id ? ret._id.toString() : ret.id;
            delete ret._id;
            return ret;
        },
    },
});
const installationSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    location: { type: String, required: true },
    canopyType: { type: String, required: true },
    yearCompleted: { type: Number, required: true },
    description: { type: String, required: true },
    coverImageId: { type: String },
    brand: { type: String },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    photos: [photoSchema],
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id ? ret._id.toString() : ret.id;
            delete ret._id;
            delete ret.__v;
            if (Array.isArray(ret.photos)) {
                ret.photos = ret.photos.map((p) => {
                    if (p._id) {
                        p.id = p._id.toString();
                        delete p._id;
                    }
                    return p;
                });
            }
            return ret;
        },
    },
});
exports.Installation = (0, mongoose_1.model)('Installation', installationSchema);
