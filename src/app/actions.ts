
'use server';

import { suggestTagsForPost } from '@/ai/flows/suggest-tags-for-post';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, query, where, Timestamp, getDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';

export async function getTagSuggestions(content: string) {
  if (!content) {
    return { tags: [] };
  }
  try {
    const result = await suggestTagsForPost({ content });
    return result;
  } catch (error) {
    console.error('Error suggesting tags:', error);
    return { tags: [], error: 'Falha ao sugerir tags. Tente novamente.' };
  }
}

export async function addOrUpdateUser(uid: string, data: { name: string, email: string, role?: string, status?: string }) {
    try {
        await setDoc(doc(db, "users", uid), {
            uid,
            ...data
        }, { merge: true });
    } catch (error) {
        console.error("Error adding/updating user: ", error);
        throw new Error("Failed to save user data.");
    }
}

export async function updateUser(uid: string, data: Partial<{ name: string; email: string; role: string; status: string }>) {
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, data);
        return { success: true };
    } catch (error) {
        console.error("Error updating user: ", error);
        return { success: false, error: "Failed to update user data." };
    }
}

export async function deleteUser(uid: string) {
    try {
        await deleteDoc(doc(db, "users", uid));
        return { success: true };
    } catch (error) {
        console.error("Error deleting user: ", error);
        return { success: false, error: "Failed to delete user." };
    }
}


export async function createDiscovery(data: any) {
  try {
    const discoveryRef = doc(collection(db, "discoveries"));
    await setDoc(discoveryRef, {
      ...data,
      id: discoveryRef.id,
      createdAt: new Date(),
      status: 'Pendente', // Default status
      selos: 0,
      sealGivers: [],
    });
    return { id: discoveryRef.id };
  } catch (error) {
    console.error("Error creating discovery: ", error);
    throw new Error("Failed to create discovery.");
  }
}

export async function getUsers() {
    try {
        const usersCol = collection(db, 'users');
        const userSnapshot = await getDocs(usersCol);
        const userList = userSnapshot.docs.map(doc => doc.data());
        return userList;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function getDiscoveries() {
    try {
        const discoveriesCol = collection(db, 'discoveries');
        const discoverySnapshot = await getDocs(discoveriesCol);
        const discoveryList = discoverySnapshot.docs.map(doc => {
            const data = doc.data();
            if (data.createdAt && data.createdAt instanceof Timestamp) {
                data.createdAt = data.createdAt.toDate();
            }
            return data;
        });
        return discoveryList;
    } catch (error) {
        console.error("Error fetching discoveries:", error);
        return [];
    }
}


export async function getDiscoveriesByAuthor(authorId: string) {
    try {
        const discoveriesRef = collection(db, 'discoveries');
        const q = query(discoveriesRef, where("authorId", "==", authorId));
        const querySnapshot = await getDocs(q);
        const discoveryList = querySnapshot.docs.map(doc => {
            const data = doc.data();
            if (data.createdAt && data.createdAt.toDate) {
                data.createdAt = data.createdAt.toDate().toISOString();
            }
            return { id: doc.id, ...data };
        });
        return discoveryList;
    } catch (error) {
        console.error("Error fetching discoveries by author:", error);
        return [];
    }
}

export async function getDiscoveryById(id: string) {
    try {
        const discoveryRef = doc(db, 'discoveries', id);
        const docSnap = await getDoc(discoveryRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.createdAt && data.createdAt.toDate) {
                data.createdAt = data.createdAt.toDate().toISOString();
            }
            return { id: docSnap.id, ...data };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching discovery by id:", error);
        return null;
    }
}

export async function toggleSeal(discoveryId: string, userId: string) {
    if (!userId) {
        return { success: false, error: "Utilizador não autenticado." };
    }
    try {
        const discoveryRef = doc(db, "discoveries", discoveryId);
        const docSnap = await getDoc(discoveryRef);

        if (!docSnap.exists()) {
            return { success: false, error: "Descoberta não encontrada." };
        }
        
        const data = docSnap.data();
        const hasSealed = data.sealGivers?.includes(userId);

        if (hasSealed) {
            // User has sealed, so remove the seal
            await updateDoc(discoveryRef, {
                sealGivers: arrayRemove(userId),
                selos: increment(-1)
            });
            return { success: true, sealed: false };
        } else {
            // User has not sealed, so add the seal
            await updateDoc(discoveryRef, {
                sealGivers: arrayUnion(userId),
                selos: increment(1)
            });
             return { success: true, sealed: true };
        }

    } catch (error) {
        console.error("Error toggling seal: ", error);
        return { success: false, error: "Falha ao interagir com o selo." };
    }
}

export async function getSealsGivenByUser(userId: string) {
    try {
        const discoveriesRef = collection(db, 'discoveries');
        const q = query(discoveriesRef, where("sealGivers", "array-contains", userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.size;
    } catch (error) {
        console.error("Error fetching seals given by user:", error);
        return 0;
    }
}
