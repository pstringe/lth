CREATE TABLE patient (
	mrn VARCHAR(36) PRIMARY KEY,
	first_name VARCHAR(15) NOT NULL,
	last_name VARCHAR(15) NOT NULL,
	birth_date DATE NOT NULL,
	location_id VARCHAR(36) NOT NULL,
	FOREIGN KEY (location_id) REFERENCES location(location_id)
)

CREATE TABLE appointment (
	appointment_id VARCHAR(36) PRIMARY KEY,
	mrn VARCHAR(36) NOT NULL,
	npi VARCHAR(36) NOT NULL,
	appointment_time DATETIME NOT NULL,
	FOREIGN KEY (mrn) REFERENCES patient(mrn),
	FOREIGN KEY (npi) REFERENCES physician(npi)
)

CREATE TABLE location (
	location_id VARCHAR(36) PRIMARY KEY,
	location_name VARCHAR(50) NOT NULL
)

CREATE TABLE physician (
	npi VARCHAR(36) PRIMARY KEY,
	first_name VARCHAR(15) NOT NULL,
	last_name VARCHAR(15) NOT NULL
)

CREATE INDEX appointment_mrn_idx ON appointment(mrn);
CREATE INDEX appointment_npi_idx ON appointment(npi);