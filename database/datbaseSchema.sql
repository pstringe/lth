/*
CREATE TABLE patient (
	first_name TEXT NOT NULL,
 	last_name TEXT NOT NULL,
	birth_date data_type TEXT NOT NULL,
	mrn TEXT NOT NULL, 
	location TEXT NOT NULL
) 

CREATE TABLE appointment (
	appointment_id TEXT NOT NULL,
	mrn TEXT NOT NULL, 
	npi TEXT NOT NULL, 
	appointment_time TEXT NOT NULL
)

CREATE TABLE location (
	location_id TEXT NOT NULL, 
	location_name TEXT NOT NULL
) 

CREATE TABLE physician (
	npi TEXT NOT NULL, 
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL
) 
*/

CREATE TABLE patient (
	mrn UUID PRIMARY KEY,
	first_name VARCHAR(15) NOT NULL,
	last_name VARCHAR(15) NOT NULL,
	birth_date DATE NOT NULL,
	location_id UUID NOT NULL,
	FOREIGN KEY (location_id) REFERENCES location(location_id)
)

CREATE TABLE appointment (
	appointment_id UUID PRIMARY KEY,
	mrn UUID NOT NULL,
	npi UUID NOT NULL,
	appointment_time DATETIME NOT NULL,
	FOREIGN KEY (mrn) REFERENCES patient(mrn),
	FOREIGN KEY (npi) REFERENCES physician(npi)
)

CREATE TABLE location (
	location_id UUID PRIMARY KEY,
	location_name VARCHAR(50) NOT NULL
)

CREATE TABLE physician (
	npi UUID PRIMARY KEY,
	first_name VARCHAR(15) NOT NULL,
	last_name VARCHAR(15) NOT NULL
)

CREATE INDEX appointment_mrn_idx ON appointment(mrn);
CREATE INDEX appointment_npi_idx ON appointment(npi);