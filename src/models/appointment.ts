export interface Appointment {
  appointment_id: Uint8Array;
  mrn: Uint8Array;
  appointment_time: string;
  npi: Uint8Array;
}

export interface AppointmentResponse {
  appointment_id: string;
  mrn: string;
  appointment_time: string;
  npi: string;
}
