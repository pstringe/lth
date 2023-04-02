import { Database } from './database';
import { PatientRequest } from '../models/patient';

const db = new Database();

export async function findPatients(queryParams: Partial<PatientRequest>) {
  const { first_name, last_name, birthdate, mrn, location_id } = queryParams;

  try {
    const result = await db.findPatients({
      first_name,
      last_name,
      birthdate,
      mrn,
      location_id,
    });

    return result;
  } catch (error) {
    throw new Error('Error retrieving patient records');
  }
}

export async function findPatientsByAppointmentDateRange(startDate: string, endDate: string) {
  try {
    const result = await db.findPatientsByAppointmentDateRange(startDate, endDate);
    return result;
  } catch (error) {
    throw new Error('Error retrieving patient records');
  }
}
