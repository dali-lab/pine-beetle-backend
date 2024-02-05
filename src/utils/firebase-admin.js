import dotenv from 'dotenv';
import admin from 'firebase-admin';

// initialize dotenv here in case env variable was not yet available
if (!process.env.FIREBASE_API_KEY) {
  dotenv.config({ silent: true });
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_API_KEY)),
  storageBucket: 'gs://pine-beetle-prediction.appspot.com',
});

export default admin;
