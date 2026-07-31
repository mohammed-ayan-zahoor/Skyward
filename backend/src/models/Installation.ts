import { Schema, model, Document } from 'mongoose';

export interface IPhoto {
  id: string;
  imageUrl: string;
  caption?: string;
  sortOrder: number;
  isCover: boolean;
}

export interface IInstallation extends Document {
  id: string;
  title: string;
  slug: string;
  location: string;
  canopyType: string;
  yearCompleted: number;
  description: string;
  coverImageId?: string;
  brand?: string;
  isFeatured: boolean;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
  photos: IPhoto[];
}

const photoSchema = new Schema<IPhoto>(
  {
    imageUrl: { type: String, required: true },
    caption: { type: String },
    sortOrder: { type: Number, default: 0 },
    isCover: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret: Record<string, any>) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        return ret;
      },
    },
  }
);

const installationSchema = new Schema<IInstallation>(
  {
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret: Record<string, any>) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        if (Array.isArray(ret.photos)) {
          ret.photos = ret.photos.map((p: any) => {
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
  }
);

export const Installation = model<IInstallation>('Installation', installationSchema);
