const sqlite3 = require('sqlite3').verbose();
const DB_NAME = 'database.db';
const db = new sqlite3.Database(DB_NAME);

/*
** import data from json files
*/

const patients = require('../patients.json');
const physicians = require('../physicians.json');
const appointments = require('../appointments.json');
const locations = require('../locations.json');

console.log(db);
//console.log('Data imported', patients, physicians, appointments, locations);

/*
db schema

CREATE TABLE patient (
	mrn BLOB(16) PRIMARY KEY,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	birth_date DATE NOT NULL,
	location_id BLOB(16) NOT NULL,
	FOREIGN KEY (location_id) REFERENCES location(location_id)
);


CREATE TABLE appointment (
	appointment_id BLOB(16) PRIMARY KEY,
	mrn BLOB(16) NOT NULL,
	npi BLOB(16) NOT NULL,
	appointment_time DATETIME NOT NULL,
	FOREIGN KEY (mrn) REFERENCES patient(mrn),
	FOREIGN KEY (npi) REFERENCES physician(npi)
);


CREATE TABLE location (
	location_id BLOB(16) PRIMARY KEY,
	location_name TEXT NOT NULL
);


CREATE TABLE physician (
	npi BLOB(16) PRIMARY KEY,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL
);
*/
console.log({patients});
const uuidToBlob = (uuid) => {
    const hex = uuid.replace(/-/g, '');
    const bytes = new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    return bytes;
}

db.serialize(() => {
    const sql = `INSERT INTO patient (mrn, first_name, last_name, birth_date, location_id) VALUES (?, ?, ?, ?, ?)`;
    patients.forEach(patient => {
        console.log(uuidToBlob(patient.mrn));
        db.run(sql, [
            uuidToBlob(patient.mrn), 
            patient.firstName, 
            patient.lastName, 
            patient.birthdate, 
            uuidToBlob(patient.location)
        ], function(err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    });
});

db.close();