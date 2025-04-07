import mongoose, { Connection } from "mongoose";

import { UserSchema } from "./users";
import { ShiftsSchema } from "./shifts";

// Define the collections via Mongoose models
const User = mongoose.model("User", UserSchema);
const Shift = mongoose.model("Shift", ShiftsSchema);

export const collections = {
  Users: User,
  Shifts: Shift,
};

export async function connectToDatabase(uri: string) {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
    
    //await applySchemaValidation();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); 
  }
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
async function applySchemaValidation(db: Connection) {
  const collectionsArray = await db.db.listCollections().toArray();
  const collectionNames = collectionsArray.map((col) => col.name);

  const usersSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "name", "phoneNumber", "email", "address", "DOB", "nationality", "idNumber"
      ],
      additionalProperties: false,
      properties: {
        _id: {},
        name: { bsonType: "string" },
        phoneNumber: { bsonType: "string" },
        email: { bsonType: "string" },
        address: { bsonType: "string" },
        DOB: { bsonType: "date" },
        nationality: { bsonType: "string" },
        visaExpiryDate: { bsonType: "date" },
        idNumber: { bsonType: "string" },
        roleType: {
          enum: ["BarStaff", "FloorStaff", "Manager"]
        },
        profileImage: {
          bsonType: ["object", "null"],
          properties: {
            data: { bsonType: "binData" },
            contentType: { bsonType: "string" }
          }
        },
        idFile: {
          bsonType: ["object", "null"],
          properties: {
            data: { bsonType: "binData" },
            contentType: { bsonType: "string" }
          }
        },
        visaFile: {
          bsonType: ["object", "null"],
          properties: {
            data: { bsonType: "binData" },
            contentType: { bsonType: "string" }
          }
        },
        authentication: {
          bsonType: "object",
          required: ["password", "salt"],
          properties: {
            password: { bsonType: "string" },
            salt: { bsonType: "string" },
            sessionToken: { bsonType: "string" }
          }
        }
      }
    }
  };

  const shiftsSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "shiftDate", "startTime", "endTime"],
      additionalProperties: false,
      properties: {
        _id: {},
        userId: { bsonType: "objectId" },
        shiftDate: { bsonType: "date" },
        startTime: { bsonType: "string" },
        endTime: { bsonType: "string" },
      }
    }
  };

  if (!collectionNames.includes("users")) {
    await db.createCollection("users", { validator: usersSchema });
  } else {
    await db.db.command({
      collMod: "users",
      validator: usersSchema,
    }).catch((error) => {
      console.warn("⚠️ Could not modify users schema:", error.message);
    });
  }

  if (!collectionNames.includes("shifts")) {
    await db.createCollection("shifts", { validator: shiftsSchema });
  } else {
    await db.db.command({
      collMod: "shifts",
      validator: shiftsSchema,
    }).catch((error) => {
      console.warn("⚠️ Could not modify shifts schema:", error.message);
    });
  }

  await db.db.collection("shifts").createIndex({ userId: 1 }, { unique: false });
}
