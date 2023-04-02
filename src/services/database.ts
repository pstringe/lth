import sqlite3 from 'sqlite3';
import { Appointment, AppointmentResponse } from '../models/appointment';
import { Patient, PatientRequest, PatientResponse } from '../models/patient';
import { blobToUuid, uuidToBlob } from '../utils/blob';
import { parse, isWithinInterval, format } from 'date-fns';

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
  const { first_name, last_name, birth_date, mrn, location_id, start_date, end_date } = queryParams;

  const hasQueryParams = first_name || last_name || birth_date || mrn || location_id;
  const shouldFilterAppointments = start_date && end_date;

  const query = hasQueryParams
    ? `
      SELECT * FROM patient
      WHERE
        (LOWER(first_name) LIKE LOWER(?) OR ? IS NULL) AND
        (LOWER(last_name) LIKE LOWER(?) OR ? IS NULL) AND
        (mrn LIKE ? OR ? IS NULL) AND
        (location_id LIKE ? OR ? IS NULL)
    `
    : `SELECT * FROM patient`;

  const params = hasQueryParams ? [first_name, first_name, last_name, last_name, mrn, mrn, location_id, location_id] : [];

  const patientRows = await new Promise<PatientResponse[]>((resolve, reject) => {
    this.db.all<Patient>(query, params, async (err, rows) => {
      if (err) {
        reject(err);
      } else {
        let patientData = await Promise.all(
          rows.map(async (patient) => {
            const appointments = await this.findAppointmentsByMRN(blobToUuid(patient.mrn));
            return {
              ...patient,
              mrn: blobToUuid(patient.mrn),
              location_id: blobToUuid(patient.location_id),
              appointments,
            };
          })
        );

        if (birth_date) {
          const inputBirthDate = parse(birth_date, 'yyyy-MM-dd', new Date());
          patientData = patientData.filter((patient) => {
            const dbBirthDate = parse(patient.birth_date, 'MMM d, yyyy', new Date());
            return dbBirthDate.getTime() === inputBirthDate.getTime();
          });
        }

        if (shouldFilterAppointments) {
          const startDate = parse(start_date, 'yyyy-MM-dd', new Date());
          const endDate = parse(end_date, 'yyyy-MM-dd', new Date());
          patientData = patientData.filter((patient) =>
            patient.appointments.some((appointment) => {
              const appointmentTime = parse(appointment.appointment_time, 'MM/dd/yyyy HH:mm:ss', new Date());
              const between = isWithinInterval(appointmentTime, { start: startDate, end: endDate });
              return between;
            })
          );
        }

        resolve(patientData);
      }
    });
  });
  return patientRows;
}



private async findAppointmentsByMRN(mrn: string): Promise<AppointmentResponse[]> {
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

