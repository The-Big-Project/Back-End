/** @format */

import { model, Schema } from "mongoose";

interface inventoryItem {
  createdAt: Date;
  amountType: "quantity" | "weight";
  specialCalculation: (inPrice: number, outPrice: number) => number;
  images?: Array<string>;
  name: object;
  label: string;
  description: string;
  inPrice: number;
  outPrice: number;
  expectedExpiryDate: Date;
  origin: string;
  phoneNumber: Array<string>;
  quantity: number;
  sold: number;
}

const inventorySchema = new Schema<inventoryItem>({
  createdAt: { type: Date, default: new Date() },
  amountType: {
    type: String,
    required: [true, "No Type | each item must have an amount type"],
  },
  images: Array,
  name: {
    type: String,
    unique: [true, "Duplicate Name | Each item must have a unique name"],
    required: [true, "No Name | each item must have a name"],
  },
  description: String,
  expectedExpiryDate: Date,
  inPrice: {
    type: Number,
    min: [
      1,
      "In Price is incorrect | The buying price must not be less than 1",
    ],
  },
  outPrice: {
    type: Number,
    validate: {
      validator: function (value: number): boolean {
        return value > this.inPrice;
      },
      message:
        "Out Price is incorrect | The selling price must be higher than the buying price",
    },
  },
  label: {
    type: String,
    required: [true, "No Label | each item must have a label"],
  },
  phoneNumber: Array,
  quantity: { type: Number, required: [true, "No quantity | It is required"] },
  sold: { type: Number, default: 0 },
});

const inventoryModel = model<inventoryItem>("inventory", inventorySchema);

export default inventoryModel;
