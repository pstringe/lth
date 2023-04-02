export interface Appointment {
    appointment_id: Uint8Array;
    mrn: Uint8Array;
    appointmentTime: string;
    npi: Uint8Array;
}

export interface AppointmentResponse {
    appointment_id: string;
    mrn: string;
    appointmentTime: string;
    npi: string;
}