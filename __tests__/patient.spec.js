"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../src/services/database");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe('API Endpoint tests', () => {
    let db = new database_1.Database();
    afterAll(async () => {
        await db.close();
    });
    describe('GET /patient', () => {
        it('returns a patient record when queried with valid name', async () => {
            const response = await (0, supertest_1.default)(app_1.default).get('/patient').query({
                first_name: 'Lee',
            });
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    first_name: 'Lee',
                    last_name: 'Lang',
                    birth_date: "May 21, 1967",
                    location_id: "b0b4fac7-4462-1859-da0e-92b0235489c6",
                    appointments: expect.arrayContaining([
                        expect.objectContaining({
                            "appointment_id": "4c0c18b0-c52c-a1c1-f94f-2f628dbe0973",
                            "mrn": "3bd6990f-c278-2a66-a7ad-969475484084",
                            "npi": "e5d61ea2-fda5-b9c6-bbf2-a174395a9e2e",
                            "appointment_time": "12/27/2022 10:09:45"
                        })
                    ])
                }),
            ]));
        });
    });
});
