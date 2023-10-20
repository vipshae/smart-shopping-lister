import mongoose, { Schema, Types } from 'mongoose';
import type { ShoppingListInterface } from '../interfaces/db.interfaces';

const ShoppingListSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        
        isFinished: {
            type: Boolean,
            default: false,
        },
        items: [
            {
                type: Types.ObjectId,
                ref: 'Items'
            },
        ]
        
    },
    {
        timestamps: true,
    }
);

export const ShoppingListModel = mongoose.model<ShoppingListInterface>("ShoppingList", ShoppingListSchema)