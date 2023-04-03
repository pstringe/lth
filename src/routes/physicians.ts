import express from "express";
import { findPractitionersByLocationName } from "../services/physicians";

const router = express.Router();

router.get("/location", async (req, res) => {
  const {
    name
  } = req.query;
  try {
    const result = await findPractitionersByLocationName(name as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error at /patient route" });
  }
});

export default router;
