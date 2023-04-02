import { Database } from "./database";
import { PatientRequest } from "../models/patient";

const db = new Database();

export async function findPatients(queryParams: Partial<PatientRequest>) {
  const {
    first_name,
    last_name,
    birth_date,
    mrn,
    location_id,
    start_date,
    end_date,
  } = queryParams;

  try {
    const result = await db.findPatients({
      first_name,
      last_name,
      birth_date,
      mrn,
      location_id,
      start_date,
      end_date,
    });

    return result;
  } catch (error) {
    throw new Error("Error retrieving patient records");
  }
}
