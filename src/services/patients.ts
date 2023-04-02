import { Database } from './database';
import { Patient } from '../models/patient';

const db = new Database();

export async function findPatients(queryParams: Partial<Patient>) {
  const { firstName, lastName, birthdate, mrn, location } = queryParams;

  try {
    const result = await db.findPatients({
      firstName,
      lastName,
      birthdate,
      mrn,
      location,
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
