import sqlite3 from 'sqlite3';
import { Patient } from '../models/patient';

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

  public async findPatients(queryParams: Partial<Patient>): Promise<Patient[]> {
    const { firstName, lastName, birthdate, mrn, location } = queryParams;
    let patientRows: Patient[] = [];
    const query = `
        SELECT * FROM patient
        WHERE
            first_name LIKE ? OR
            last_name LIKE ? OR
            birth_date LIKE ? OR
            mrn LIKE ? OR
            location_id LIKE ?
    `;

    await this.db.all<Patient>(query, [firstName ?? '', lastName ?? '', birthdate ?? '', mrn ?? '', location ?? ''], (err, rows) => {
      if (err) {
        throw err;
      }
      patientRows = rows;
      console.log({rows})
      return rows;
    });
    return patientRows;
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
        patientRows = rows;
        return rows;
    });

    return patientRows;
  }

  public async close() {
     await this.db.close();
  }
}

