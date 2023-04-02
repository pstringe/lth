import { AppointmentResponse } from './appointment';

export interface Patient {
    mrn: Uint8Array;
    first_name: string;
    last_name: string;
    birth_date: string;
    location_id: Uint8Array;
}

export interface PatientRequest {
    mrn: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    location_id: string;
}

export interface PatientResponse extends PatientRequest{
    appointments: AppointmentResponse[];
}