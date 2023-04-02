export interface Appointment {
    id: Uint8Array;
    mrn: Uint8Array;
    appointmentTime: string;
    npi: Uint8Array;
}

export interface AppointmentResponse {
    id: string;
    mrn: string;
    appointmentTime: string;
    npi: string;
}