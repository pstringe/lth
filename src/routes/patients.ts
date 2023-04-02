import express from 'express';
import { Patient, PatientRequest } from '../models/patient';
import { findPatients, findPatientsByAppointmentDateRange } from '../services/patients';

const router = express.Router();

// Endpoint for querying patient records by name, birth date, MRN, and location
router.get('/', async (req, res) => {
    const { first_name, last_name, birth_date, mrn, location_id } = req.query;
    try {
      const result = await findPatients({ first_name, last_name, birth_date, mrn, location_id } as Partial<PatientRequest>);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error at /patient route' });
    }
});
  
// Endpoint for querying patient records by appointment date range
router.get('/appointment', async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
      const result = await findPatientsByAppointmentDateRange(startDate as string, endDate as string);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error at /appointment route' });
    }
});

export default router;