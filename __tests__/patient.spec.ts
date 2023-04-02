import { Database } from '../src/services/database';
import { Patient } from '../src/models/patient';
import request from 'supertest';
import app from '../src/app';
import { uuidToBlob } from '../src/utils/blob';

describe('API Endpoint tests', () => {
  let db: Database = new Database();

  afterAll(async () => {
    await db.close();
  });

  const testPatient1: Patient = {
		mrn: uuidToBlob("3BD6990F-C278-2A66-A7AD-969475484084"),
		firstName: "Lee",
		lastName: "Lang",
		birthdate: "May 21, 1967",
		location: uuidToBlob("B0B4FAC7-4462-1859-DA0E-92B0235489C6")
	}

  describe('GET /patient', () => {
    it('returns a patient record when queried with valid name', async () => {
      const response = await request(app).get('/patient').query({
        firstName: 'Lee',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            first_name: 'Lee',
            last_name: 'Lang',
          }),
        ]),
      );
    });

    it('returns a patient record when queried with valid MRN and location', async () => {
      const response = await request(app).get('/patient').query({
        mrn: 123456,
        location: 1,
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            mrn: 123456,
            firstName: expect.any(String),
            lastName: expect.any(String),
            birthDate: expect.any(String),
            location: 1,
          }),
        ]),
      );
    });

    it('returns a 500 error when an error occurs while retrieving patient records', async () => {
      const spy = jest.spyOn(db, 'findPatients').mockImplementation(() => {
        throw new Error('Test error');
      });

      const response = await request(app).get('/patient').query({
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1985-01-01',
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error retrieving patient records',
      });

      spy.mockRestore();
    });
  });

  describe('GET /appointment', () => {
    it('returns patient records within a valid appointment date range', async () => {
      const response = await request(app).get('/appointment').query({
        startDate: '2022-01-01',
        endDate: '2022-01-31',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            mrn: expect.any(Number),
            firstName: expect.any(String),
            lastName: expect.any(String),
            birthDate: expect.any(String),
            location: expect.any(Number),
          }),
        ]),
      );
    });

    it('returns a 500 error when an error occurs while retrieving patient records', async () => {
      const spy = jest.spyOn(db, 'findPatientsByAppointmentDateRange').mockImplementation(() => {
        throw new Error('Test error');
      });

      const response = await request(app).get('/appointment').query({
        startDate: '2022-01-01',
        endDate: '2022-01-31',
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error retrieving patient records',
      });

      spy.mockRestore();
    });
  });
});