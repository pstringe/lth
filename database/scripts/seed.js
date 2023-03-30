const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

/*
** import data from json files
*/

const patients = require('../patients.json');
const physicians = require('../physicians.json');
const appointments = require('../appointments.json');
const locations = require('../locations.json');

console.log('Data imported', patients, physicians, appointments, locations);