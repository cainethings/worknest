# WorkNest Front-End

WorkNest is a simple payroll viewer built with React. It allows employees to register, log in and download PDF payslips. The app communicates with the PHP based [WorkNest API](https://github.com/cainethings/api-worknest).

## Features

- **User Registration** – create a login using phone number and password.
- **Login** – authenticate via `/login.php` and store a session.
- **Payslip Viewer** – list available months and fetch payslip data.
- **PDF Download** – convert the payslip table to a PDF using `html2pdf.js`.
- **Environment Detection** – automatically selects the correct API base URL for production, staging and local development.

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server on `http://localhost:3001`:
   ```bash
   npm start
   ```

The webpack dev server serves the app in development mode. A production build can be created with:

```bash
npm run build
```

## Configuration

`src/config.json` defines the current environment and the base URLs for the API:

```json
{
  "environment": "production",
  "apiBaseUrls": {
    "production": "https://api-worknest.cainethings.com",
    "staging": "https://stage-api-worknest.cainethings.com",
    "local": "http://localhost:8888"
  }
}
```

The helper `getApiBaseUrl` in `src/api.js` chooses the URL based on the hostname. The production app runs at `https://worknest.cainethings.com`, staging at `https://stage-worknest.cainethings.com`, and local development at `http://localhost:3001`.

## Directory Structure

- `src/` – React components and pages
- `src/pages/account/` – login, register and manual admin login
- `src/pages/home/` – payslip list and PDF download logic
- `public/` – HTML template used by Webpack

## Related API Endpoints

The WorkNest API provides the following PHP endpoints:

- `register.php` – create a user
- `login.php` – authenticate a user
- `getAvailableMonths.php` – list months with payroll data
- `getPayslip.php` – retrieve a single payslip record

All API calls are `POST` requests with JSON bodies. CORS is allowed only from the staging and production front-end domains.

---

This project is maintained alongside the WorkNest API repository. Contributions are welcome.

## PHP API (Local)

A minimal PHP backend is included in the `php-api/` directory. It uses MySQL and monthly CSV files.

### Setup

1. Create a MySQL database and run `php-api/users.sql` to create the `users` table.
2. Copy `php-api/.env.example` to `php-api/.env` and update the credentials.
3. Place monthly payroll CSV files inside `php-api/data/` (sample `April-25.csv` is provided).
4. Start the API using PHP's built-in server:
   ```bash
   php -S localhost:8888 index.php -t php-api
   ```

### Endpoints

- `POST /register` – register a user
- `POST /login` – authenticate and start a session
- `POST /getAvailableMonths` – list available CSV files
- `POST /getPayslip` – fetch a payslip by month and phone number

### Running Together

For local development set `environment` to `local` in `src/config.json` so the React app calls `http://localhost:8888`.

Start the API and then in another terminal run `npm start` to launch the React app. Register or log in with a phone number found in one of the CSV files. After logging in, the home page shows a dropdown of months and allows downloading a PDF payslip.
