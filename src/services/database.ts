import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from '@firebase/firestore';
import { db } from '../firebase';

// Collection paths
export const COLLECTIONS = {
  USERS: 'users',
  DIARY_ENTRIES: (userId: string) => `users/${userId}/diary-entries`,
  SLEEP: (userId: string) => `users/${userId}/sleep`,
  NOTIFICATIONS: (userId: string) => `users/${userId}/notifications`,
  NOTES: (userId: string) => `users/${userId}/notes`
};

// User Profile
export async function getUserProfile(userId: string) {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? snapshot.data() : null;
}

export async function updateUserProfile(userId: string, data: any) {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  await updateDoc(userRef, data);
}

// Diary Entries
export async function addDiaryEntry(userId: string, entry: {
  title: string;
  content: string;
}) {
  const entriesRef = collection(db, COLLECTIONS.DIARY_ENTRIES(userId));
  return addDoc(entriesRef, {
    ...entry,
    createdAt: Timestamp.now()
  });
}

export async function getDiaryEntries(userId: string) {
  const entriesRef = collection(db, COLLECTIONS.DIARY_ENTRIES(userId));
  const q = query(entriesRef, orderBy('createdAt', 'desc'));
  return getDocs(q);
}

export async function deleteDiaryEntry(userId: string, entryId: string) {
  const entryRef = doc(db, COLLECTIONS.DIARY_ENTRIES(userId), entryId);
  await deleteDoc(entryRef);
}

// Sleep Schedule
export async function setSleepSchedule(userId: string, schedule: {
  bedtime: Date;
  wakeTime: Date;
}) {
  const sleepRef = doc(db, COLLECTIONS.SLEEP(userId), 'schedule');
  await setDoc(sleepRef, {
    bedtime: Timestamp.fromDate(schedule.bedtime),
    wakeTime: Timestamp.fromDate(schedule.wakeTime),
    updatedAt: Timestamp.now()
  });
}

export async function getSleepSchedule(userId: string) {
  const sleepRef = doc(db, COLLECTIONS.SLEEP(userId), 'schedule');
  const snapshot = await getDoc(sleepRef);
  return snapshot.exists() ? snapshot.data() : null;
}

// Notifications
export async function addNotification(userId: string, notification: {
  title: string;
  message: string;
  timestamp: Date;
}) {
  const notifRef = collection(db, COLLECTIONS.NOTIFICATIONS(userId));
  return addDoc(notifRef, {
    ...notification,
    read: false,
    timestamp: Timestamp.fromDate(notification.timestamp)
  });
}

export async function markNotificationAsRead(userId: string, notificationId: string) {
  const notifRef = doc(db, COLLECTIONS.NOTIFICATIONS(userId), notificationId);
  await updateDoc(notifRef, { read: true });
}

export async function getUnreadNotifications(userId: string) {
  const notifRef = collection(db, COLLECTIONS.NOTIFICATIONS(userId));
  const q = query(
    notifRef, 
    where('read', '==', false),
    orderBy('timestamp', 'desc')
  );
  return getDocs(q);
}

// Notes
export async function addNote(userId: string, date: Date, content: string) {
  if (!userId) throw new Error('User ID is required');
  if (!date) throw new Error('Date is required');
  if (!content) throw new Error('Content is required');

  const dateStr = date.toISOString().split('T')[0];
  console.log(`Adding/updating note for user ${userId} on date ${dateStr}`);
  console.log('Environment:', import.meta.env.MODE);
  console.log('Using emulator:', import.meta.env.VITE_USE_FIREBASE_EMULATOR);
  console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
  
  try {
    const noteRef = doc(db, COLLECTIONS.NOTES(userId), dateStr);
    const noteData = {
      content,
      date: Timestamp.fromDate(date),
      updatedAt: Timestamp.now()
    };
    
    await setDoc(noteRef, noteData);
    console.log('Note saved successfully:', { userId, dateStr, noteData });
    return noteData;
  } catch (error) {
    console.error('Error saving note:', error);
    throw error;
  }
}

export async function getNote(userId: string, date: Date) {
  if (!userId) throw new Error('User ID is required');
  if (!date) throw new Error('Date is required');

  const dateStr = date.toISOString().split('T')[0];
  console.log(`Fetching note for user ${userId} on date ${dateStr}`);
  
  try {
    const noteRef = doc(db, COLLECTIONS.NOTES(userId), dateStr);
    const snapshot = await getDoc(noteRef);
    
    if (snapshot.exists()) {
      console.log('Note found:', snapshot.data());
      return snapshot.data();
    } else {
      console.log('No note found for date:', dateStr);
      return null;
    }
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
} 