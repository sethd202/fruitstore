# Fresh Fruit Store

A simple Node.js/Express web application that displays a fruit product catalog backed by Google Firestore, with stock status provided by a Firebase Cloud Function.

## Project Structure

```
fruitstore/
  ├── app.js              # Express server — reads Firestore, serves the UI
  ├── seed.js             # One-time script to populate Firestore with fruit data
  ├── Dockerfile          # Containerises the Express app
  ├── package.json
  ├── .env                # Local config (GCP project ID, port, function region)
  ├── functions/
  │     ├── index.js      # Firebase Cloud Function: checkStock
  │     └── package.json  # Dependencies for the functions runtime
  ├── public/
  │     └── style.css
  └── views/
        └── index.html    # Single-page UI; fetches data from the Express API
```

---

## Prerequisites

- Node.js 18+
- A Google Cloud project with Firestore enabled (Native mode)
- Application Default Credentials configured locally:
  ```
  export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-service-account-key.json"
  ```
- Fill in `.env` with your actual `GCP_PROJECT_ID`

---

## How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set your credentials and project ID:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
   # Edit .env and set GCP_PROJECT_ID=your-actual-project-id
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser at [http://localhost:8080](http://localhost:8080)

> **Note:** The stock badges will show "Status Unknown" until the `checkStock` Cloud Function is deployed. All other product data loads from Firestore normally.

---

## How to Seed Firestore

Run the seed script once to populate the `products` collection:

```bash
npm run seed
```

This inserts six fruit documents with varied `sold_by` fields (`"each"`, `"lb"`, `"pint"`) to demonstrate Firestore's flexible schema. You can re-run it safely — it uses `set()` so it overwrites existing documents.

After seeding, replace `YOUR_BUCKET_NAME` in each document's `image_url` field with your actual Cloud Storage bucket name once images are uploaded.

---

## How to Build the Docker Image Locally

```bash
docker build -t fruitstore .
```

Run the container locally (pass credentials via environment variable):

```bash
docker run \
  -p 8080:8080 \
  -e GCP_PROJECT_ID=your-project-id \
  -e GOOGLE_APPLICATION_CREDENTIALS=/app/key.json \
  -v /path/to/your-key.json:/app/key.json \
  fruitstore
```

Then open [http://localhost:8080](http://localhost:8080).

---

## Deployment

> Deployment steps to be added following GCP lab instructions.

### Deploy to Compute Engine VM

> Deployment steps to be added following GCP lab instructions.

### Deploy to Cloud Run as Container

> Deployment steps to be added following GCP lab instructions.

### Deploy to Cloud Run as Serverless

> Deployment steps to be added following GCP lab instructions.

### Deploy the Cloud Function

> Deployment steps to be added following GCP lab instructions.
>
> The `checkStock` function lives in `functions/index.js`. It requires its own `npm install` inside the `functions/` directory before deployment.
