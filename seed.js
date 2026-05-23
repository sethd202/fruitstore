// seed.js — populates Firestore with the initial fruit catalog
// Run with: npm run seed
// Requires GOOGLE_APPLICATION_CREDENTIALS to be set in your environment.

require('dotenv').config();

const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({ credential: applicationDefault() });
const db = getFirestore({ databaseId: 'fruitstore-db' });

// -------------------------------------------------------------------------
// Product data with intentionally varied "sold_by" fields.
// This demonstrates Firestore's flexible (schema-less) document model:
// each document in the same collection can have different field values.
//   - sold_by: "each"  → priced per individual piece
//   - sold_by: "lb"    → priced by weight (pound)
//   - sold_by: "pint"  → priced by volume (pint)
// -------------------------------------------------------------------------
const products = [
  {
    name: 'Apple',
    price: 1.29,
    sold_by: 'each',   // individual unit pricing
    stock: 200,
    image_url: 'https://storage.googleapis.com/YOUR_BUCKET_NAME/images/apple.jpg'
  },
  {
    name: 'Cherry',
    price: 3.99,
    sold_by: 'lb',     // weight-based pricing
    stock: 80,
    image_url: 'https://storage.googleapis.com/YOUR_BUCKET_NAME/images/cherry.jpg'
  },
  {
    name: 'Peach',
    price: 1.49,
    sold_by: 'each',
    stock: 120,
    image_url: 'https://storage.googleapis.com/YOUR_BUCKET_NAME/images/peach.jpg'
  },
  {
    name: 'Blueberry',
    price: 4.99,
    sold_by: 'pint',   // volume-based pricing
    stock: 0,          // intentionally out of stock to test the badge
    image_url: 'https://storage.googleapis.com/YOUR_BUCKET_NAME/images/blueberry.jpg'
  },
  {
    name: 'Mango',
    price: 1.99,
    sold_by: 'each',
    stock: 90,
    image_url: 'https://storage.googleapis.com/YOUR_BUCKET_NAME/images/mango.jpg'
  },
  {
    name: 'Banana',
    price: 0.59,
    sold_by: 'each',
    stock: 150,
    image_url: 'https://storage.googleapis.com/YOUR_BUCKET_NAME/images/banana.jpg'
  }
];

async function seed() {
  console.log('Seeding Firestore "products" collection...\n');

  for (const product of products) {
    // Use the lowercase fruit name as the document ID (e.g. "apple", "cherry")
    const docId = product.name.toLowerCase();
    await db.collection('products').doc(docId).set(product);
    console.log(`  Added: ${product.name} (sold_by: "${product.sold_by}", stock: ${product.stock})`);
  }

  console.log('\nSeeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
