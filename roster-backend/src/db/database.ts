import mongoose, { Connection } from "mongoose";

export async function connectToDatabase(uri: string) {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); 
  }
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
async function applySchemaValidation(db: Connection) {
  const collections = await db.listCollections();
  const collectionNames = collections.map((col: { name: string }) => col.name);

  const usersSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "name", "phoneNumber", "email", "address", "DOB", "nationality", "idNumber"
      ],
      additionalProperties: false,
      properties: {
        _id: {},
        name: {
          bsonType: "string",
          description: "'name' is required and is a string",
        },
        phoneNumber: {
          bsonType: "string",
          minimum: 9,
          maximum: 13,
          description:
            "'phoneNumber' is required and must be a string with a minimum of 9.",
        },
        email: {
          bsonType: "string",
          description: "'email' is required and must be a string",
        },
        address: {
          bsonType: "string",
          description: "'address' is required and is a string",
        },
        DOB: {
          bsonType: "date",
          description:
            "User's date of birth, must be valid and not in the future",
        },
        nationality: {
          bsonType: "string",
          description: "'nationality' is required and is a string",
        },
        visaExpiryDate: {
          bsonType: "date",
          description: "'visaexpirydate' must be valid date in the future",
        },
        idNumber: {
          bsonType: "string",
          minimum: 9,
          maximum: 13,
          description:
            "'idnumber' is required and must be a string with a minimum of 9.",
        },
        roleType: {
          enum: ["BarStaff", "FloorStaff", "Manager"],
          description:
            "'roleType' is required and must be one of the listed options.",
        },
        profileImage: {
          bsonType: "object",
          properties: {
              data: { bsonType: "binData" },
              contentType: { bsonType: "string" }
          }
        },
        idFile: {
            bsonType: "object",
            properties: {
                data: { bsonType: "binData" },
                contentType: { bsonType: "string" }
            }
        },
        visaFile: {
            bsonType: "object",
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
    },
  },
};

  const shiftsSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "shiftDate", "startTime", "endTime"],
      additionalProperties: false,
      properties: {
        _id: {},
        userId: {
          bsonType: "objectId",
          description: "Foreign key referencing Users collection",
        },
        shiftDate: {
          bsonType: "date",
          description: "'shiftDate' must be a valid date in the future",
        },
        startTime: { bsonType: "string" },
        endTime: { bsonType: "string" },
      },
    },
  };

  // Ensure "users" collection exists before applying schema validation
  if (!collectionNames.includes("users")) {
    await db.createCollection("users", { validator: usersSchema });
  } else {
    await db.db.command({
        collMod: "users",
        validator: usersSchema,
      }).catch((error) => {
        console.warn('⚠️ Warning: Could not modify users collection schema.', error.message);
      });
  }

  // Ensure "shifts" collection exists before applying schema validation
  if (!collectionNames.includes("shifts")) {
    await db.createCollection("shifts", { validator: shiftsSchema });
  } else {
    await db.db.command({
        collMod: "shifts",
        validator: shiftsSchema,
      }).catch((error) => {
        console.warn('⚠️ Warning: Could not modify shifts collection schema.', error.message);
      });
  }

  // Create Foreign Key Index for shifts.userId (if not already created)
  await db.collection("shifts").createIndex({ userId: 1 }, { unique: false });
}
