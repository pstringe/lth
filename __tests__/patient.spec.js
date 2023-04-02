"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../src/services/database");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const blob_1 = require("../src/utils/blob");
describe('API Endpoint tests', () => {
    let db = new database_1.Database();
    afterAll(async () => {
        await db.close();
    });
    const testPatient1 = {
        mrn: (0, blob_1.uuidToBlob)("3BD6990F-C278-2A66-A7AD-969475484084"),
        firstName: "Lee",
        lastName: "Lang",
        birthdate: "May 21, 1967",
        location: (0, blob_1.uuidToBlob)("B0B4FAC7-4462-1859-DA0E-92B0235489C6")
    };
    describe('GET /patient/patient', () => {
        it('returns a patient record when queried with valid name and birthdate', async () => {
            const response = await (0, supertest_1.default)(app_1.default).get('/patient').query({
                firstName: 'John',
                lastName: 'Doe',
                birthDate: '1985-01-01',
            });
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    mrn: expect.any(Number),
                    firstName: 'John',
                    lastName: 'Doe',
                    birthDate: '1985-01-01',
                    location: expect.any(Number),
                }),
            ]));
        });
        it('returns a patient record when queried with valid MRN and location', async () => {
            const response = await (0, supertest_1.default)(app_1.default).get('/patient').query({
                mrn: 123456,
                location: 1,
            });
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    mrn: 123456,
                    firstName: expect.any(String),
                    lastName: expect.any(String),
                    birthDate: expect.any(String),
                    location: 1,
                }),
            ]));
        });
        it('returns a 500 error when an error occurs while retrieving patient records', async () => {
            const spy = jest.spyOn(db, 'findPatients').mockImplementation(() => {
                throw new Error('Test error');
            });
            const response = await (0, supertest_1.default)(app_1.default).get('/patient').query({
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
            const response = await (0, supertest_1.default)(app_1.default).get('/appointment').query({
                startDate: '2022-01-01',
                endDate: '2022-01-31',
            });
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    mrn: expect.any(Number),
                    firstName: expect.any(String),
                    lastName: expect.any(String),
                    birthDate: expect.any(String),
                    location: expect.any(Number),
                }),
            ]));
        });
        it('returns a 500 error when an error occurs while retrieving patient records', async () => {
            const spy = jest.spyOn(db, 'findPatientsByAppointmentDateRange').mockImplementation(() => {
                throw new Error('Test error');
            });
            const response = await (0, supertest_1.default)(app_1.default).get('/appointment').query({
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
