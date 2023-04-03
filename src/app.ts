import express, { Application, Request, Response } from "express";
import patientRouter from "./routes/patients";
import physicianRouter from "./routes/physicians";

const app: Application = express();

const PORT: number = 3001;

app.use("/patient", patientRouter);
app.use("/physician", physicianRouter);

app.listen(PORT, (): void => {
  console.log("SERVER IS UP ON PORT:", PORT);
});

export default app;
