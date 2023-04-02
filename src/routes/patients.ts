import express from "express";
import { PatientRequest } from "../models/patient";
import { findPatients } from "../services/patients";

const router = express.Router();

router.get("/", async (req, res) => {
  const {
    first_name,
    last_name,
    birth_date,
    mrn,
    location_id,
    start_date,
    end_date,
  } = req.query;
  try {
    const result = await findPatients({
      first_name,
      last_name,
      birth_date,
      mrn,
      location_id,
      start_date,
      end_date,
    } as Partial<PatientRequest>);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error at /patient route" });
  }
});

export default router;
