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
  setDoc,
  limit,
} from "firebase/firestore/lite";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  updatePassword,
  sendEmailVerification,
  reload,
  sendPasswordResetEmail,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

const vansCollectionRef = collection(db, "vans");
const bookingsCollectionRef = collection(db, "bookings");
const reviewsCollectionRef = collection(db, "reviews");

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
    gallery: Array.isArray(data.gallery) ? data.gallery : [],
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(vansCollectionRef, payload);
  return { id: docRef.id, ...payload };
}

export async function updateVan(id, data) {
  const docRef = doc(db, "vans", id);
  const payload = { ...data };
  if (payload.price !== undefined) payload.price = Number(payload.price);
  if (payload.gallery && !Array.isArray(payload.gallery)) {
    delete payload.gallery;
  }
  await updateDoc(docRef, payload);
  return { id, ...payload };
}

export async function uploadImages({ hostId, vanId, mainFile, galleryFiles = [] }) {
  const base = `vans/${hostId || "public"}/${vanId || Date.now()}`;
  const uploaded = { mainUrl: null, galleryUrls: [] };

  async function uploadOne(file, path) {
    const storageRef = ref(storage, path);
    const snap = await uploadBytes(storageRef, file);
    return await getDownloadURL(snap.ref);
  }

  if (mainFile) {
    uploaded.mainUrl = await uploadOne(mainFile, `${base}/main-${mainFile.name}`);
  }

  if (galleryFiles?.length) {
    for (let i = 0; i < galleryFiles.length; i++) {
      const file = galleryFiles[i];
      const url = await uploadOne(file, `${base}/gallery/${i}-${file.name}`);
      uploaded.galleryUrls.push(url);
    }
  }

  return uploaded;
}

export async function deleteVan(id) {
  const docRef = doc(db, "vans", id);
  await deleteDoc(docRef);
  return true;
}

// Bookings
export async function getRenterBookings(uid) {
  if (!uid) return [];
  const q = query(bookingsCollectionRef, where("renterId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getHostBookings(uid) {
  if (!uid) return [];
  const q = query(bookingsCollectionRef, where("hostId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getBookingsForVan(vanId) {
  if (!vanId) return [];
  const q = query(bookingsCollectionRef, where("vanId", "==", vanId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateBookingStatus(id, status) {
  if (!id) throw new Error("Missing booking id");
  const ref = doc(db, "bookings", id);
  await updateDoc(ref, { status });
  return true;
}

export async function createBooking({
  vanId,
  vanName,
  vanImage,
  hostId,
  renterId,
  renterEmail,
  startDate,
  endDate,
  pickupCity,
  totalPrice,
  note,
}) {
  if (!renterId) throw new Error("Musíte byť prihlásený");
  if (!vanId || !startDate || !endDate) throw new Error("Chýbajú údaje rezervácie");
  const payload = {
    vanId,
    vanName: vanName || "",
    vanImage: vanImage || "",
    hostId: hostId || "",
    renterId,
    renterEmail: renterEmail || "",
    startDate,
    endDate,
    pickupCity: pickupCity || "",
    totalPrice: totalPrice || null,
    note: note || "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(bookingsCollectionRef, payload);
  return { id: docRef.id, ...payload };
}

// Reviews
export async function getHostReviews(hostId) {
  if (!hostId) return [];
  const q = query(reviewsCollectionRef, where("hostId", "==", hostId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getReviewsForVan(vanId) {
  if (!vanId) return [];
  const q = query(reviewsCollectionRef, where("vanId", "==", vanId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getReviewsByRenter(renterId) {
  if (!renterId) return [];
  const q = query(reviewsCollectionRef, where("renterId", "==", renterId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createReview({
  bookingId,
  vanId,
  vanName,
  hostId,
  renterId,
  renterEmail,
  rating,
  comment,
}) {
  if (!renterId) throw new Error("Musíte byť prihlásený");
  if (!bookingId || !vanId || !hostId) throw new Error("Chýbajú údaje recenzie");
  const safeRating = Math.min(5, Math.max(1, Number(rating) || 0));
  if (!safeRating) throw new Error("Vyberte hodnotenie");

  // jednoduchá ochrana proti duplicitám: jedna recenzia na rezerváciu
  const existingQ = query(
    reviewsCollectionRef,
    where("bookingId", "==", bookingId),
    limit(1)
  );
  const existsSnap = await getDocs(existingQ);
  if (!existsSnap.empty) {
    throw new Error("Recenzia pre túto rezerváciu už existuje");
  }

  const payload = {
    bookingId,
    vanId,
    vanName: vanName || "",
    hostId,
    renterId,
    renterEmail: renterEmail || "",
    rating: safeRating,
    comment: comment?.trim() || "",
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(reviewsCollectionRef, payload);
  return { id: docRef.id, ...payload };
}

async function fetchUserProfile(uid) {
  if (!uid) return null;
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function getUserProfile(uid) {
  const profile = await fetchUserProfile(uid);
  if (profile) return { id: uid, ...profile };
  const user = auth.currentUser;
  return {
    id: uid,
    name: user?.displayName || "",
    email: user?.email || "",
  };
}

export async function updateUserProfile(uid, { name }) {
  if (!uid) throw new Error("Missing user id");
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (Object.keys(updates).length) {
    await setDoc(doc(db, "users", uid), updates, { merge: true });
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: updates.name });
    }
  }
  return { id: uid, ...updates };
}

export async function changePassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error("You must be logged in to change password");
  }
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
  return true;
}

export async function registerUser({ firstName, lastName, email, password, phone, role }) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const displayName = [firstName, lastName].filter(Boolean).join(" ").trim();
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    await setDoc(
      doc(db, "users", cred.user.uid),
      {
        firstName: firstName || "",
        lastName: lastName || "",
        name: displayName || "",
        email,
        phone: phone || "",
        role: role || "najomca",
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
    // po vytvorení odošleme overovací e‑mail
    const actionCodeSettings = {
      url: window?.location?.origin || "https://van-life-react-andrey.netlify.app/",
      handleCodeInApp: false,
    };
    try {
      await sendEmailVerification(cred.user, actionCodeSettings);
    } catch (verifyErr) {
      console.error("sendEmailVerification failed", verifyErr);
    }
    try {
      await signOut(auth); // odhlásime, kým nepotvrdí e‑mail
    } catch (signOutErr) {
      console.error("signOut after register failed", signOutErr);
    }
    return {
      uid: cred.user.uid,
      email: cred.user.email,
      name: displayName || cred.user.displayName || "",
      emailVerificationSent: true,
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
      if (name) {
        await setDoc(doc(db, "users", data.localId), {
          name,
          email: data.email,
          createdAt: new Date().toISOString(),
        });
      }
      return { uid: data.localId, email: data.email, name: name || "" };
    } catch (fallbackErr) {
      console.error(fallbackErr);
      if (
        typeof window !== "undefined" &&
        window.location.hostname === "localhost"
      ) {
        const res = await fetch("/api/register", {
          method: "post",
          body: JSON.stringify({ name, email, password }),
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
    await reload(cred.user);
    if (!cred.user.emailVerified) {
      await signOut(auth);
      return { emailVerified: false };
    }
    const profile = await fetchUserProfile(cred.user.uid);
    return {
      uid: cred.user.uid,
      email: cred.user.email,
      name: profile?.name || cred.user.displayName || "",
      role: profile?.role || "najomca",
      emailVerified: cred.user.emailVerified,
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
      const profile = await fetchUserProfile(data.localId);
      return {
        uid: data.localId,
        email: data.email,
        name: profile?.name || "",
      };
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

export async function requestPasswordReset(email) {
  if (!email) throw new Error("Zadajte e‑mail na obnovenie hesla");
  await sendPasswordResetEmail(auth, email, {
    url: window?.location?.origin || "https://van-life-react-andrey.netlify.app/",
    handleCodeInApp: false,
  });
  return true;
}
