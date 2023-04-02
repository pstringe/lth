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
        it('returns all patient records when no query parameters are provided', async () => {
            const response = await (0, supertest_1.default)(app_1.default).get('/patient');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.arrayContaining([
                {
                    "mrn": "3bd6990f-c278-2a66-a7ad-969475484084",
                    "first_name": "Lee",
                    "last_name": "Lang",
                    "birth_date": "May 21, 1967",
                    "location_id": "b0b4fac7-4462-1859-da0e-92b0235489c6",
                    "appointments": [
                        {
                            "appointment_id": "4c0c18b0-c52c-a1c1-f94f-2f628dbe0973",
                            "mrn": "3bd6990f-c278-2a66-a7ad-969475484084",
                            "npi": "e5d61ea2-fda5-b9c6-bbf2-a174395a9e2e",
                            "appointment_time": "12/27/2022 10:09:45"
                        }
                    ]
                },
                {
                    "mrn": "3c0c18b0-c52c-a1c1-f94f-2f628dbe0973",
                    "first_name": "Maxwell",
                    "last_name": "Foster",
                    "birth_date": "Oct 16, 2012",
                    "location_id": "aa2eaa3e-59ea-6849-4b54-08b18cc3ea21",
                    "appointments": [
                        {
                            "appointment_id": "3bd69900-c278-2a66-a7ad-969475484084",
                            "mrn": "3c0c18b0-c52c-a1c1-f94f-2f628dbe0973",
                            "npi": "e5d61ea2-fda5-b9c6-bbf2-a174395a9e2e",
                            "appointment_time": "02/16/2022 07:05:59"
                        }
                    ]
                },
                {
                    "mrn": "626a5ec7-4466-c145-eb54-d23d73f55525",
                    "first_name": "Imelda",
                    "last_name": "Gibbs",
                    "birth_date": "May 28, 1982",
                    "location_id": "f3b1d493-de73-1b5b-e603-935f6fe577f7",
                    "appointments": []
                },
                {
                    "mrn": "cbb6d392-c879-6aa0-38b8-837141056698",
                    "first_name": "Elijah",
                    "last_name": "Morton",
                    "birth_date": "Jun 25, 1963",
                    "location_id": "aa2eaa3e-59ea-6849-4b54-08b18cc3ea21",
                    "appointments": [
                        {
                            "appointment_id": "625a5ec7-4466-c145-eb54-d23d73f55525",
                            "mrn": "cbb6d392-c879-6aa0-38b8-837141056698",
                            "npi": "887333e3-c393-9d52-da5a-fc7e06827e2c",
                            "appointment_time": "08/08/2023 09:18:03"
                        },
                        {
                            "appointment_id": "cbb6e392-c879-6aa0-38b8-837141056698",
                            "mrn": "cbb6d392-c879-6aa0-38b8-837141056698",
                            "npi": "16967aae-1fb7-fa4b-91a8-4d745ec1ea16",
                            "appointment_time": "03/16/2022 03:40:28"
                        }
                    ]
                },
                {
                    "mrn": "5294aab5-c496-8e95-cdba-6c2d5cf9949a",
                    "first_name": "Graiden",
                    "last_name": "Osborn",
                    "birth_date": "Jul 4, 1988",
                    "location_id": "f3b1d493-de73-1b5b-e603-935f6fe577f7",
                    "appointments": [
                        {
                            "appointment_id": "5296aab5-c496-8e95-cdba-6c2d5cf9949a",
                            "mrn": "5294aab5-c496-8e95-cdba-6c2d5cf9949a",
                            "npi": "cdbe30aa-4173-64a4-8462-828619479265",
                            "appointment_time": "02/20/2023 07:39:26"
                        }
                    ]
                }
            ]));
        });
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
        it('returns a patient record queryied with a date range', async () => {
            const response = await (0, supertest_1.default)(app_1.default).get('/patient').query({
                start_date: '2022-01-01',
                end_date: '2022-03-01'
            });
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    "mrn": "3c0c18b0-c52c-a1c1-f94f-2f628dbe0973",
                    "first_name": "Maxwell",
                    "last_name": "Foster",
                    "birth_date": "Oct 16, 2012",
                    "location_id": "aa2eaa3e-59ea-6849-4b54-08b18cc3ea21",
                    "appointments": expect.arrayContaining([
                        {
                            "appointment_id": "3bd69900-c278-2a66-a7ad-969475484084",
                            "mrn": "3c0c18b0-c52c-a1c1-f94f-2f628dbe0973",
                            "npi": "e5d61ea2-fda5-b9c6-bbf2-a174395a9e2e",
                            "appointment_time": "02/16/2022 07:05:59"
                        }
                    ])
                })
            ]));
        });
    });
});
