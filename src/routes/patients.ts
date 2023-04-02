import express from 'express';
import { Patient } from '../models/patient';
import { findPatients, findPatientsByAppointmentDateRange } from '../services/patients';

const router = express.Router();
// Endpoint for querying patient records by name, birth date, MRN, and location
router.get('/', async (req, res) => {
    const { firstName, lastName, birthDate, mrn, location } = req.query;
    try {
      const result = await findPatients({ firstName, lastName, birthDate, mrn, location } as Partial<Patient>);
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