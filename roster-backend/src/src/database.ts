import * as mongodb from "mongodb";
import { Users } from "./users";

export const collections: {
    Users?: mongodb.Collection<Users>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("RosterApp");
    await applySchemaValidation(db);

    const usersCollection = db.collection<Users>("users");
    collections.Users = usersCollection;
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
    const jsonSchema = {
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
                    bsonType: ["int", "double"],
                    minimum: 9,
                    maximum: 10,
                    description: "'phoneNumber' is required and must be an integer with a minimum of 9.",
                    
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
                visaexpirydate: {
                    bsonType: "date",
                    description: "'visaexpirydate' must be valid in the future",
                    
                }, 
                idnumber: {
                    bsonType: ["int", "double"],
                    minimum: 9,
                    maximum: 10,
                    description: "'idnumber' is required and must be an integer with a minimum of 9.",
                    
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

    // Try applying the modification to the collection, if the collection doesn't exist, create it 
   await db.command({
        collMod: "employees",
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("employees", {validator: jsonSchema});
        }
    });
}