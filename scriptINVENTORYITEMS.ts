/** @format */

import mongoose from "mongoose";
import inventoryModel from "./src/models/inventoryModel";
import { faker } from "@faker-js/faker";
function generateMockInventoryItems() {
  return {
    createdAt: faker.date.recent(),
    amountType: faker.helpers.arrayElement(["kg", "g", "ltr", "pcs"]),
    images: [faker.image.urlLoremFlickr()],
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    expectedExpiryDate: faker.date.future(),
    inPrice: faker.number.int({ min: 1, max: 500 }),
    outPrice: faker.number.int({ min: 501, max: 1000 }),
    label: faker.commerce.department(),
    phoneNumber: [faker.phone.number()],
  };
}

async function seedDataBase(amount = 100) {
  try {
    mongoose.connect(
      "mongodb+srv://bilalaney084:I4i8XjNWiLQDyHWI@bigcluster.ugwvf.mongodb.net/?retryWrites=true&w=majority&appName=BigCluster"
    );
    const mockData = [];
    for (let i = 0; i < amount; i++) {
      mockData.push(generateMockInventoryItems());
    }

    await inventoryModel.insertMany(mockData);
    console.log(`DATABASE SEEDED SUCCESSFULLY WITH ${amount} DOCUMENT`);
  } catch (e) {
    if (e instanceof Error)
      console.error("ERROR DURING INSERTING MOCK DATA", e.message);
  }
}

seedDataBase(1000);
