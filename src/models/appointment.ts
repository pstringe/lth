export interface Appointment {
    id: string;
    patientId: string;
    appointmentTime: string;
    physician: Physician;
}
