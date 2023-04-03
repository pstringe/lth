import { Database } from "./database";

const db = new Database();

export async function findPhysiciansByLocationName(location: string) {
  try {
    const result = await db.findPhysiciansByLocationName(location);
    return result;
  } catch (error) {
    throw new Error("Error retrieving patient records");
  }
}
