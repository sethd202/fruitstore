// Load environment variables from .env before anything else
require('dotenv').config();

const express = require('express');
const path = require('path');

// Firebase Admin SDK — use Application Default Credentials (ADC)
// Locally: set GOOGLE_APPLICATION_CREDENTIALS env var to your service account key path
// On GCP (Cloud Run, Compute Engine): ADC is provided automatically by the runtime
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static assets (CSS, images) from the public/ directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main page — a static HTML file that fetches data client-side
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// --- API: product catalog ---
// Reads all documents from the Firestore "products" collection and returns them as JSON.
// The client uses this to render the product cards.
app.get('/api/products', async (req, res) => {
  try {
    const snapshot = await db.collection('products').get();
    const products = [];
    snapshot.forEach(doc => {
      // Merge the document ID (e.g. "apple") with its field data
      products.push({ id: doc.id, ...doc.data() });
    });
    res.json(products);
  } catch (err) {
    console.error('Error reading products from Firestore:', err);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

// --- API: runtime config ---
// Exposes the GCP project ID and Cloud Function region to the browser so the
// client can build the correct checkStock Cloud Function URL without hard-coding it.
app.get('/api/config', (req, res) => {
  res.json({
    projectId: process.env.GCP_PROJECT_ID,
    region: process.env.FUNCTION_REGION || 'us-central1'
  });
});

app.listen(PORT, () => {
  console.log(`Fruit store running on http://localhost:${PORT}`);
});
