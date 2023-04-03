import sqlite3 from "sqlite3";
import { Appointment, AppointmentResponse } from "../models/appointment";
import { Patient, PatientRequest, PatientResponse } from "../models/patient";
import { blobToUuid, uuidToBlob } from "../utils/blob";
import { parse, isWithinInterval, format } from "date-fns";

// Database class for handling SQLite database interactions
export class Database {
  private db: sqlite3.Database;

  constructor() {
    // Initialize the SQLite database connection
    this.db = new sqlite3.Database("./database.db");
  }

  // Get patient data and appointments for each patient in the provided rows
  private async getPatientData(rows: Patient[]): Promise<PatientResponse[]> {
    return await Promise.all(
      rows.map(async (patient) => {
        // Find appointments for the patient
        const appointments = await this.findAppointmentsByMRN(
          blobToUuid(patient.mrn)
        );
        // Return the patient data with converted UUIDs and appointment data
        return {
          ...patient,
          mrn: blobToUuid(patient.mrn),
          location_id: blobToUuid(patient.location_id),
          appointments,
        };
      })
    );
  }

  // Filter patient data by birth_date
  private filterByBirthDate(
    patientData: PatientResponse[],
    birth_date: string
  ): PatientResponse[] {
    const inputBirthDate = parse(birth_date, "yyyy-MM-dd", new Date());
    return patientData.filter((patient) => {
      const dbBirthDate = parse(patient.birth_date, "MMM d, yyyy", new Date());
      return dbBirthDate.getTime() === inputBirthDate.getTime();
    });
  }

  // Filter patient data by appointment date range
  private filterByAppointmentDate(
    patientData: PatientResponse[],
    start_date: string,
    end_date: string
  ): PatientResponse[] {
    const startDate = parse(start_date, "yyyy-MM-dd", new Date());
    const endDate = parse(end_date, "yyyy-MM-dd", new Date());
    return patientData.filter((patient) =>
      patient.appointments.some((appointment) => {
        const appointmentTime = parse(
          appointment.appointment_time,
          "MM/dd/yyyy HH:mm:ss",
          new Date()
        );
        const between = isWithinInterval(appointmentTime, {
          start: startDate,
          end: endDate,
        });
        return between;
      })
    );
  }

  // Find patients based on query parameters
  public async findPatients(
    queryParams: Partial<PatientRequest> = {}
  ): Promise<PatientResponse[]> {
    const {
      first_name,
      last_name,
      birth_date,
      mrn,
      location_id,
      start_date,
      end_date,
    } = queryParams;

    const hasQueryParams =
      first_name || last_name || birth_date || mrn || location_id;
    const shouldFilterAppointments = start_date && end_date;

    // SQL query for filtering patients based on provided query parameters
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

    const params = hasQueryParams
      ? [
          first_name,
          first_name,
          last_name,
          last_name,
          mrn,
          mrn,
          location_id,
          location_id,
        ]
      : [];

    // Execute the SQL query and process the results
    const patientRows = await new Promise<PatientResponse[]>(
      (resolve, reject) => {
        this.db.all<Patient>(query, params, async (err, rows) => {
          if (err) {
            reject(err);
          } else {
            // Get patient data with appointments for each patient
            let patientData = await this.getPatientData(rows);

            // Filter patient data by birth_date if provided
            if (birth_date) {
              patientData = this.filterByBirthDate(patientData, birth_date);
            }

            // Filter patient data by appointment date range if provided
            if (shouldFilterAppointments) {
              patientData = this.filterByAppointmentDate(
                patientData,
                start_date,
                end_date
              );
            }

            resolve(patientData);
          }
        });
      }
    );
    return patientRows;
  }

  // Find appointments for a patient by MRN
  private async findAppointmentsByMRN(
    mrn: string
  ): Promise<AppointmentResponse[]> {
    const query = `SELECT * FROM appointment WHERE mrn = ?`;
    // Execute the SQL query and process the results
    const appointmentRows = await new Promise<Appointment[]>(
      (resolve, reject) => {
        this.db.all<Appointment>(query, [uuidToBlob(mrn)], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      }
    );

    // Convert appointment data to AppointmentResponse format
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

  public async findPhysiciansByLocationName(locationName: string): Promise<PhysicianResponse[]> {
    const query = `
      SELECT DISTINCT p.npi, p.first_name, p.last_name
      FROM physician p
      JOIN appointment a ON p.npi = a.npi
      JOIN patient pt ON a.mrn = pt.mrn
      JOIN location l ON pt.location_id = l.location_id
      WHERE LOWER(l.location_name) = LOWER(?)
    `;
  
    const physicianRows = await new Promise<Physician[]>((resolve, reject) => {

      this.db.all(query, [locationName], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Physician[]);
        }
      });
    });
  
    const physicians = physicianRows.map(row => ({
      npi: blobToUuid(row.npi),
      first_name: row.first_name,
      last_name: row.last_name
    }));
  
    return physicians;
  }

  // Close the SQLite database connection
  public async close() {
    await this.db.close();
  }
}
