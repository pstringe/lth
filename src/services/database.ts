import sqlite3 from 'sqlite3';
import { Appointment, AppointmentResponse } from '../models/appointment';
import { Patient, PatientRequest, PatientResponse } from '../models/patient';
import { blobToUuid, uuidToBlob } from '../utils/blob';

export class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database('./database.db');
}

public async addPatients(patients: Patient[]) {
    const query = `
      INSERT INTO patient (
        mrn,
        first_name,
        last_name,
        birth_date,
        location_id
      ) VALUES (?, ?, ?, ?, ?)
    `;

    patients.forEach((patient) => {
      this.db.run(query, [patient.mrn, patient.first_name, patient.last_name, patient.birth_date, patient.location_id]);
    });
}

public async findPatients(queryParams: Partial<PatientRequest> = {}): Promise<PatientResponse[]> {
  const { first_name, last_name, birth_date, mrn, location_id } = queryParams;
  
  const hasQueryParams = first_name || last_name || birth_date || mrn || location_id;

  const query = hasQueryParams
      ? `
        SELECT * FROM patient
        WHERE
          first_name LIKE ? OR
          last_name LIKE ? OR
          birth_date LIKE ? OR
          mrn LIKE ? OR
          location_id LIKE ?
      `
      : `SELECT * FROM patient`;

  const params = hasQueryParams ? [first_name, last_name, birth_date, mrn, location_id] : [];

  const patientRows = await new Promise<PatientResponse[]>((resolve, reject) => {
    this.db.all<Patient>(query, params, async (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const patientData = await Promise.all(
          rows.map(async (patient) => {
              const appointments = await this.findAppointmentsByMRN(blobToUuid(patient.mrn));
              return { 
                  ...patient, 
                  mrn: blobToUuid(patient.mrn),
                  location_id: blobToUuid(patient.location_id),
                  appointments 
              };
          })
        );
        resolve(patientData);
      }
    });
  });
  return patientRows;
}

private async findAppointmentsByMRN(mrn: string): Promise<AppointmentResponse[]> {
    console.log('mrn: ', mrn)
    const query = `
        SELECT * FROM appointment
        WHERE mrn = ?
    `;

    const appointmentRows = await new Promise<Appointment[]>((resolve, reject) => {
        this.db.all<Appointment>(query, [uuidToBlob(mrn)], (err, rows) => {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
        });
    });

    const appointments: AppointmentResponse[] = appointmentRows.map((row) => {
        return {
            ...row,
            appointment_id: blobToUuid(row.appointment_id),
            mrn: blobToUuid(row.mrn),
            npi: blobToUuid(row.npi),
        };
    });

    return appointments;
  }
  

  public async close() {
      await this.db.close();
  }
}

