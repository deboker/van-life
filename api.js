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
  updateDoc,
  deleteDoc,
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

export async function updateVan(id, data) {
  const docRef = doc(db, "vans", id);
  const payload = { ...data };
  if (payload.price !== undefined) payload.price = Number(payload.price);
  await updateDoc(docRef, payload);
  return { id, ...payload };
}

export async function deleteVan(id) {
  const docRef = doc(db, "vans", id);
  await deleteDoc(docRef);
  return true;
}

export async function registerUser({ email, password }) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return {
      uid: cred.user.uid,
      email: cred.user.email,
    };
  } catch (err) {
    console.error(err);
    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, returnSecureToken: true }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Registration failed");
      }
      return { uid: data.localId, email: data.email };
    } catch (fallbackErr) {
      console.error(fallbackErr);
      if (
        typeof window !== "undefined" &&
        window.location.hostname === "localhost"
      ) {
        const res = await fetch("/api/register", {
          method: "post",
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Registration failed");
        }
        return data;
      }
      throw err;
    }
  }
}

export async function loginUser({ email, password }) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return {
      uid: cred.user.uid,
      email: cred.user.email,
    };
  } catch (err) {
    console.error(err);
    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, returnSecureToken: true }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Login failed");
      }
      return { uid: data.localId, email: data.email };
    } catch (fallbackErr) {
      console.error(fallbackErr);
      if (
        typeof window !== "undefined" &&
        window.location.hostname === "localhost"
      ) {
        const res = await fetch("/api/login", {
          method: "post",
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Login failed");
        }
        return data;
      }
      throw err;
    }
  }
}
