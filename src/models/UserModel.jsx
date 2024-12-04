import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    collection, 
    getDocs, 
    query, 
    where,
    addDoc,
    deleteDoc
  } from 'firebase/firestore';
  import { db } from '../firebase/config';
  
  // User Roles
  export const UserRole = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    USER: 'user',
    BLOCKED: 'blocked'
  };
  
  // User Service
  export const UserService = {
    // Create new user profile
    async createUserProfile(user, additionalData = {}) {
      const userProfile = {
        id: user.uid,
        name: user.displayName || additionalData.name || '',
        email: user.email || '',
        role: additionalData.role || UserRole.USER,
        isActive: true,
        createdAt: new Date(),
        ...additionalData
      };
      // Save to Firestore
      await setDoc(doc(db, 'Users', user.uid), userProfile);
      return userProfile;
    },
  
    // Get user by ID
    async getUserById(userId) {
      const userDoc = await getDoc(doc(db, 'Users', userId));
      return userDoc.exists() ? userDoc.data() : null;
    },
  
    // Update user profile
    async updateUserProfile(userId, updateData) {
      const userRef = doc(db, 'Users', userId);
      await updateDoc(userRef, {
        ...updateData,
        updatedAt: new Date()
      });
    },
  
    // Change user role
    async changeUserRole(userId, newRole) {
      const userRef = doc(db, 'Users', userId);
      await updateDoc(userRef, { 
        role: newRole,
        updatedAt: new Date()
      });
    },
  
    // Toggle user status
    async toggleUserStatus(userId, isActive) {
      const userRef = doc(db, 'Users', userId);
      await updateDoc(userRef, { 
        isActive,
        updatedAt: new Date()
      });
    },
  
    // List all users
    async listUsers() {
      const usersCollection = collection(db, 'Users');
      const usersSnapshot = await getDocs(usersCollection);
      return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
  
    // Find users by filter
    async findUsers(filter) {
      const usersCollection = collection(db, 'Users');
      const q = query(
        usersCollection, 
        ...Object.entries(filter)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => where(key, '==', value))
      );
      
      const usersSnapshot = await getDocs(q);
      return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
  
    // Create user administratively
    async createAdminUser(userData) {
      const newUserRef = await addDoc(collection(db, 'Users'), {
        ...userData,
        createdAt: new Date(),
        isActive: true,
        role: userData.role || UserRole.USER
      });
      return { 
        id: newUserRef.id, 
        ...userData 
      };
    },
  
    // Delete user
    async deleteUser(userId) {
      const userRef = doc(db, 'Users', userId);
      await deleteDoc(userRef);
    }
  };