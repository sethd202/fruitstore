// functions/index.js — Firebase Cloud Functions for the Fruit Store
// Deploy with: firebase deploy --only functions
// (See README for deployment notes)

const functions = require('firebase-functions');
const { initializeApp, getApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK.
// Inside the Cloud Functions runtime, credentials are provided automatically —
// no service account key file or GOOGLE_APPLICATION_CREDENTIALS needed.
initializeApp();

// ── checkStock ────────────────────────────────────────────────────────────
// HTTPS Callable Function that looks up the stock count for a product and
// returns whether it is in stock.
//
// Called by the browser with:
//   POST https://<region>-<project>.cloudfunctions.net/checkStock
//   Body: { "data": { "product": "<productId>" } }
//
// Returns:
//   { "result": { "inStock": true | false } }
exports.checkStock = functions.https.onCall(async (request) => {
  const productId = request.data?.product || request?.product;
  if (!productId || typeof productId !== 'string') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The "product" field is required and must be a string.'
    );
  }
  const db = getFirestore(getApp(), 'fruitstore-db');
  const doc = await db.collection('products').doc(productId).get();
  if (!doc.exists) {
    throw new functions.https.HttpsError('not-found', `Product "${productId}" not found.`);
  }
  return { inStock: doc.data().stock > 0 };
});
