const sqlite3 = require("sqlite3").verbose();
const DB_NAME = "database.db";
const db = new sqlite3.Database(DB_NAME);

/*
 ** import data from json files
 */

const patients = require("../patients.json");
const physicians = require("../physicians.json");
const appointments = require("../appointments.json");
const locations = require("../locations.json");

/*
 ** Utility function for converting UUID to Blob type for more efficient storage
 */

const uuidToBlob = (uuid) => {
  const hex = uuid?.replace(/-/g, "");
  const match = hex?.match(/.{1,2}/g);
  if (!uuid || !match || match.length !== 16 || !hex) {
    throw new Error("Invalid UUID");
  }
  const bytes = new Uint8Array(match.map((byte) => parseInt(byte, 16)));
  return bytes;
};

db.serialize(() => {
  const sql = `INSERT INTO patient (mrn, first_name, last_name, birth_date, location_id) VALUES (?, ?, ?, ?, ?)`;
  patients.forEach((patient) => {
    console.log(uuidToBlob(patient.mrn));
    db.run(
      sql,
      [
        uuidToBlob(patient.mrn),
        patient.firstName,
        patient.lastName,
        patient.birthdate,
        uuidToBlob(patient.location),
      ],
      function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      }
    );
  });
});

db.serialize(() => {
  const sql = `INSERT INTO physician (npi, first_name, last_name) VALUES (?, ?, ?)`;
  physicians.forEach((physician) => {
    db.run(
      sql,
      [uuidToBlob(physician.npi), physician.firstName, physician.lastName],
      function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      }
    );
  });
});

db.serialize(() => {
  const sql = `INSERT INTO location (location_id, location_name) VALUES (?, ?)`;
  locations.forEach((location) => {
    db.run(
      sql,
      [uuidToBlob(location.locationId), location.locationName],
      function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      }
    );
  });
});

db.serialize(() => {
  const sql = `INSERT INTO appointment (appointment_id, mrn, npi, appointment_time) VALUES (?, ?, ?, ?)`;
  appointments.forEach((appointment) => {
    db.run(
      sql,
      [
        uuidToBlob(appointment.appointmentId),
        uuidToBlob(appointment.mrn),
        uuidToBlob(appointment.npi),
        appointment.time,
      ],
      function (err) {
        if (err) {
          return console.log(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      }
    );
  });
});

db.close();
