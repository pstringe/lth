import sqlite3 from 'sqlite3';
import { Appointment, AppointmentResponse } from '../models/appointment';
import { Patient } from '../models/patient';
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
      this.db.run(query, [patient.mrn, patient.firstName, patient.lastName, patient.birthdate, patient.location]);
    });
  }

/*
  public async findPatients(queryParams: Partial<Patient>): Promise<Patient[]> {
    const { firstName, lastName, birthdate, mrn, location } = queryParams;
    
    const query = `
        SELECT * FROM patient
        WHERE
            first_name LIKE ? OR
            last_name LIKE ? OR
            birth_date LIKE ? OR
            mrn LIKE ? OR
            location_id LIKE ?
    `;
    

    const patientRows = await new Promise<Patient[]>((resolve, reject) => {
        this.db.all<Patient>(query, [firstName, lastName, birthdate, mrn, location], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
    return patientRows;
}
*/

public async findPatients(queryParams: Partial<Patient>): Promise<Patient[]> {
    const { firstName, lastName, birthdate, mrn, location } = queryParams;
      
    const query = `
      SELECT * FROM patient
      WHERE
        first_name LIKE ? OR
        last_name LIKE ? OR
        birth_date LIKE ? OR
        mrn LIKE ? OR
        location_id LIKE ?
    `;
      
    const patientRows = await new Promise<Patient[]>((resolve, reject) => {
      this.db.all<Patient>(query, [firstName, lastName, birthdate, mrn, location], async (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // Loop through each patient record and fetch the associated appointments
          const patientData = await Promise.all(
            rows.map(async (patient) => {
              const appointments = await this.findAppointmentsByMRN(blobToUuid(patient.mrn));
              return { ...patient, appointments };
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
  

public async findPatientsByAppointmentDateRange(startDate: string, endDate: string): Promise<Patient[]> {
    const query = `
      SELECT * FROM patient
      WHERE appointmentDate BETWEEN ? AND ?
    `;

    let patientRows: Patient[] = [];

    const rows = await this.db.all<Patient>(query, [startDate, endDate], (err, rows) => {
        if (err) {
            throw err;
        }
        patientRows = rows.map((row) => {
            return {
                ...row,
                
            };
        });
        return rows;
    });

    return patientRows;
  }

  public async close() {
     await this.db.close();
  }
}

