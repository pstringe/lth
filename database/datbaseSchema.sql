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

CREATE INDEX appointment_mrn_idx ON appointment(mrn);
CREATE INDEX appointment_npi_idx ON appointment(npi);