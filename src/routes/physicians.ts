import express from "express";
import { findPhysiciansByLocationName } from "../services/physicians";

const router = express.Router();

router.get("/location", async (req, res) => {
  const {
    name
  } = req.query;
  try {
    const result = await findPhysiciansByLocationName(name as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error at /physician/location route" });
  }
});

export default router;
