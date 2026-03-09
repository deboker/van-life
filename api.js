import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  addDoc,
} from "firebase/firestore/lite";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const vansCollectionRef = collection(db, "vans");

export async function getVans() {
  const snapshot = await getDocs(vansCollectionRef);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getVan(id) {
  const docRef = doc(db, "vans", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    throw { message: "Van not found", status: 404 };
  }
  return { id: snapshot.id, ...snapshot.data() };
}

export async function getHostVans(hostId = "123") {
  const q = query(vansCollectionRef, where("hostId", "==", hostId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addVan(data, hostId = "123") {
  const payload = {
    ...data,
    hostId,
    price: Number(data.price || 0),
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(vansCollectionRef, payload);
  return { id: docRef.id, ...payload };
}

export async function registerUser({ email, password }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return {
    uid: cred.user.uid,
    email: cred.user.email,
  };
}

export async function loginUser({ email, password }) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return {
    uid: cred.user.uid,
    email: cred.user.email,
  };
}
