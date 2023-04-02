import { Appointment } from './appointment';

export interface Patient {
    mrn: Uint8Array;
    firstName: string;
    lastName: string;
    birthdate: string;
    location: Uint8Array;
}

export interface PatientResponse {
    mrn: string;
    firstName: string;
    lastName: string;
    birthdate: string;
    location: string;
    appointments: Appointment[];
}