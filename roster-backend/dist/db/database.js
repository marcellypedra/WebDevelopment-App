"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collections = void 0;
exports.connectToDatabase = connectToDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = require("./users");
const shifts_1 = require("./shifts");
exports.collections = {
    Users: users_1.UserModel,
    Shifts: shifts_1.ShiftModel,
};
async function connectToDatabase(uri) {
    try {
        await mongoose_1.default.connect(uri);
        await mongoose_1.default.connection.asPromise();
        console.log('✅ Database connected');
        await applySchemaValidation(mongoose_1.default.connection);
        // await collections.Shifts.create({
        //   userId: new mongoose.Types.ObjectId("67f10e16f045b36aeedaa4e7"),
        //   shiftDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        //   startTime: "09:00",
        //   endTime: "17:00"
        // });
    }
    catch (error) {
        console.error('❌ Error connecting to the database:', error);
    }
}
// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
async function applySchemaValidation(db) {
    var _a, _b;
    const collections = await db.listCollections();
    const collectionNames = collections.map((col) => col.name);
    const usersSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "name", "phoneNumber", "email", "address", "DOB",
                "nationality", "idNumber", //profileImage, idFile
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
                    description: "'phoneNumber' is required and must be a string with a minimum of 9.",
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
                    description: "User's date of birth, must be valid and not in the future",
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
                    description: "'idnumber' is required and must be a string with a minimum of 9.",
                },
                roleType: {
                    enum: ["BarStaff", "FloorStaff", "Manager"],
                    description: "'roleType' is required and must be one of the listed options.",
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
    }
    else {
        await ((_a = db.db) === null || _a === void 0 ? void 0 : _a.command({
            collMod: "users",
            validator: usersSchema,
        }).catch((error) => {
            console.warn('⚠️ Warning: Could not modify users collection schema.', error.message);
        }));
    }
    // Ensure "shifts" collection exists before applying schema validation
    if (!collectionNames.includes("shifts")) {
        await db.createCollection("shifts", { validator: shiftsSchema });
    }
    else {
        await ((_b = db.db) === null || _b === void 0 ? void 0 : _b.command({
            collMod: "shifts",
            validator: shiftsSchema,
        }).catch((error) => {
            console.warn('⚠️ Warning: Could not modify shifts collection schema.', error.message);
        }));
    }
    // Create Foreign Key Index for shifts.userId (if not already created)
    await db.collection("shifts").createIndex({ userId: 1 }, { unique: false });
}
