import * as mongodb from "mongodb";
import { Users } from "./users";
import { Shifts } from "./shifts";

export const collections: {
    Users?: mongodb.Collection<Users>;
    Shifts?: mongodb.Collection<Shifts>;
} = {};
    

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("RosterApp");
    await applySchemaValidation(db);

    const usersCollection = db.collection<Users>("users");
    collections.Users = usersCollection;

    const shiftsCollection = db.collection<Shifts>("shifts");
    collections.Shifts = shiftsCollection;

}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.

async function applySchemaValidation(db: mongodb.Db) {

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    const usersSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "phoneNumber", "email", "address", "DOB", "nationality", "visaexpirydate", "idnumber", "profileImage", "idFile"],
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
                 enum: [
                    "BarStaff",
                    "FloorStaff",
                    "Management",
                 ],
                 description: "'roleType' is required and must be one of the listed options."

                },
                profileImage: {
                    "bsonType": "binData",
                    "description": "Profile image stored as binary data",
                    
                },

                idFile: {
                    "bsonType": "binData",
                    "description": "ID image stored as binary data",
                    
                },


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
        await db.command({
            collMod: "users",
            validator: usersSchema
        }).catch((error: mongodb.MongoServerError) => {
            console.warn(`⚠️ Warning: Could not modify users collection schema.`, error.message);
        });
    }

    // Ensure "shifts" collection exists before applying schema validation
    if (!collectionNames.includes("shifts")) {
        await db.createCollection("shifts", { validator: shiftsSchema });
    } else {
        await db.command({
            collMod: "shifts",
            validator: shiftsSchema
        }).catch((error: mongodb.MongoServerError) => {
            console.warn(`⚠️ Warning: Could not modify shifts collection schema.`, error.message);
        });
    }

    // Create Foreign Key Index for shifts.userId (if not already created)
    await db.collection("shifts").createIndex({ userId: 1 }, { unique: false });
}