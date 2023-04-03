# nodejs-sqlite-skeleton for Linus Health exercise
This is a Node.js project using SQLite and Express.

## Installation
To install the required dependencies, run:
`
npm install
`

## Scripts
npm test
Run the Jest test suite.

`npm run build`
Compile TypeScript files into JavaScript in the ./build directory.

`npm start`
Compile TypeScript files and start the server using the compiled app.js file.
`
npm run dev`
Start the development server using Nodemon.

`npm run clean`
Remove the ./build directory.

`npm run initDBD`
Initialize the SQLite database using the provided schema file (database/datbaseSchema.sql).

`npm run seed`
Compile TypeScript files and seed the SQLite database with initial data.

`npm run setup`
Clean, build, initialize the SQLite database, and seed it with initial data.

`npm run format`
Format the entire codebase using Prettier.

## Dependencies
better-sqlite3: A modern SQLite3 interface for Node.js.
date-fns: Modern JavaScript date utility library.
dotenv: Load environment variables from a .env file.
express: Fast, unopinionated, minimalist web framework for Node.js.
sqlite3: Asynchronous, non-blocking SQLite3 bindings for Node.js.

## Dev Dependencies
@types/express: TypeScript definitions for Express.
@types/jest: TypeScript definitions for Jest.
@types/node: TypeScript definitions for Node.js.
@types/sqlite3: TypeScript definitions for sqlite3.
jest: JavaScript Testing Framework.
nodemon: Monitor for changes in your source and automatically restart your server.
prettier: An opinionated code formatter.
supertest: HTTP assertions library for testing APIs.
ts-jest: Jest plugin to run TypeScript files.
typescript: A typed superset of JavaScript that compiles to plain JavaScript.

## API Endpoints
1. Find Patients

### Request
`GET /api/patients`

### Query parameters:

`first_name` (optional): The first name of the patient to search for.
`last_name` (optional): The last name of the patient to search for.
`birth_date` (optional): The birth date of the patient to search for, formatted as "yyyy-MM-dd".
`mrn` (optional): The Medical Record Number (MRN) of the patient to search for.
`location_id` (optional): The location ID of the patient to search for.
`start_date` (optional): The start date of the appointment search range, formatted as "yyyy-MM-dd".
`end_date` (optional): The end date of the appointment search range, formatted as "yyyy-MM-dd".

### Response
Returns an array of patients that match the search criteria, including their appointments.

```json
[
  {
    "mrn": "UUID",
    "first_name": "string",
    "last_name": "string",
    "birth_date": "MMM d, yyyy",
    "location_id": "UUID",
    "appointments": [
      {
        "appointment_id": "UUID",
        "mrn": "UUID",
        "npi": "UUID",
        "appointment_time": "MM/dd/yyyy HH:mm:ss"
      }
    ]
  }
]
```

2. Find Physicians by Location Name
### Request
`GET /api/physicians`

### Query parameters:

location_name (required): The name of the hospital location to search for.
Response
Returns an array of physicians that have patients with appointments at the specified location.

```json
[
  {
    "npi": "UUID",
    "first_name": "string",
    "last_name": "string"
  }
]
```


