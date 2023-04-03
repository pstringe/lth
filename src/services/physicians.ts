import { Database } from "./database";

const db = new Database();

export async function findPractitionersByLocationName(location: string) {
  try {
    const result = await db.findPractitionersByLocationName(location);

    return result;
  } catch (error) {
    throw new Error("Error retrieving patient records");
  }
}
