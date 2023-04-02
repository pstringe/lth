import express, { Application, Request, Response } from 'express';
import patientRouter from './routes/patients';

const app: Application = express();

const PORT: number = 3001;

app.use('/patient', patientRouter);

app.listen(PORT, (): void => {
    console.log('SERVER IS UP ON PORT:', PORT);
    console.log({ patientRouter }, patientRouter.stack);
});

export default app;