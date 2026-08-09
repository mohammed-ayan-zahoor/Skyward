import { Schema, model, Document } from 'mongoose';

export interface IProductPhoto {
  id: string;
  imageUrl: string;
  caption?: string;
  sortOrder: number;
  isCover: boolean;
}

export interface IProduct extends Document {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  specifications?: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
  photos: IProductPhoto[];
}

const productPhotoSchema = new Schema<IProductPhoto>(
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

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    specifications: { type: String },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    photos: [productPhotoSchema],
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

export const Product = model<IProduct>('Product', productSchema);
