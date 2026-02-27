import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyDPZPk2nsOQ3oRMG7ADhS56zEFyORTE4QQ',
  authDomain: 'flor-y-pato-trip.firebaseapp.com',
  databaseURL: 'https://flor-y-pato-trip-default-rtdb.firebaseio.com',
  projectId: 'flor-y-pato-trip',
  storageBucket: 'flor-y-pato-trip.firebasestorage.app',
  messagingSenderId: '862498607498',
  appId: '1:862498607498:web:7e2ccf24cd913e6cb7c5c3',
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)

// Firebase Realtime Database paths
export const PATHS = {
  trip: 'trip-espana-2026',
  notes: 'trip-notes-2026',
  checklist: 'trip-checklist-2026',
  expenses: 'trip-expenses-2026',
} as const
