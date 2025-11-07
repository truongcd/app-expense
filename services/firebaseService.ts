// FIX: Changed imports from 'firebase/app' to '@firebase/app' to fix module resolution errors.
import { initializeApp, FirebaseApp } from "@firebase/app";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    addDoc, 
    deleteDoc, 
    doc,
    query,
    orderBy,
    Firestore,
    CollectionReference,
    DocumentData
// FIX: Changed imports from 'firebase/firestore' to '@firebase/firestore' for consistency and to prevent similar module resolution issues.
} from "@firebase/firestore";

import { Expense } from '../types';
import { firebaseConfig } from './firebaseConfig';

// =================================================================
// TÍCH HỢP FIREBASE (SỬ DỤNG V9+ MODULAR API)
// =================================================================
// File này sử dụng cú pháp Firebase v9+ hiện đại,
// tương thích với phiên bản Firebase SDK được tải trong index.html thông qua importmap.
// =================================================================

let db: Firestore | null = null;
let expensesCollectionRef: CollectionReference<DocumentData> | null = null;

// Luôn cố gắng khởi tạo Firebase.
// Sẽ thất bại nếu `firebaseConfig` chứa các giá trị placeholder.
try {
  const app: FirebaseApp = initializeApp(firebaseConfig);
  db = getFirestore(app);
  expensesCollectionRef = collection(db, 'expenses');
} catch (error) {
  console.error("Lỗi khởi tạo Firebase:", error);
  // Vô hiệu hóa các biến nếu khởi tạo thất bại
  db = null;
  expensesCollectionRef = null;
}

export const getExpenses = async (): Promise<Expense[]> => {
  if (!expensesCollectionRef) {
    // Ném lỗi cụ thể hơn nếu khởi tạo thất bại
    throw new Error("Firebase chưa được cấu hình hoặc khởi tạo thất bại. Không thể tải dữ liệu.");
  }
  try {
    // Tạo một query để sắp xếp các chi tiêu theo ngày giảm dần
    const q = query(expensesCollectionRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Expense));
  } catch (error) {
    console.error("Lỗi khi tải chi tiêu từ Firebase:", error);
    throw error; // Ném lỗi để component App có thể bắt và hiển thị thông báo
  }
};

export const addExpense = async (expense: Omit<Expense, 'id'>): Promise<string> => {
  if (!expensesCollectionRef) {
    throw new Error("Firebase chưa được cấu hình hoặc khởi tạo thất bại. Không thể thêm chi tiêu.");
  }
  try {
    // Firestore sẽ tự động chuyển đổi object JS thành document
    const expenseData = {
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
    };
    const docRef = await addDoc(expensesCollectionRef, expenseData);
    return docRef.id;
  } catch (error) {
    console.error("Lỗi khi thêm chi tiêu vào Firebase:", error);
    throw error;
  }
};

export const deleteExpense = async (id: string): Promise<void> => {
  if (!db) {
    throw new Error("Firebase chưa được cấu hình hoặc khởi tạo thất bại. Không thể xóa chi tiêu.");
  }
  try {
    const expenseDocRef = doc(db, 'expenses', id);
    await deleteDoc(expenseDocRef);
  } catch (error) {
    console.error("Lỗi khi xóa chi tiêu khỏi Firebase:", error);
    throw error;
  }
};