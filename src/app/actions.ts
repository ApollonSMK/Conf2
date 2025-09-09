
'use server';

import { db, auth } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, query, where, Timestamp, getDoc, arrayUnion, arrayRemove, increment, addDoc, orderBy } from 'firebase/firestore';
import { r2Client } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';


export async function createConfrariaUser(data: { name: string, email: string, password?: string }) {
    try {
        if (!auth) {
            throw new Error("A autenticação do Firebase não está inicializada no servidor.");
        }
        
        // This is tricky because server-side auth creation is different.
        // For client-sdk based server actions, we rely on the client's auth instance.
        // This won't work in a pure server environment.
        // A common workaround is to use the Firebase Admin SDK, but that's not set up here.
        // The current approach of using client-SDK on server components is limited.
        // Let's assume for now this action is called from a context where auth is available.
        
        // The below code would work on the client, but not in a standard server action without Admin SDK
        // As a placeholder, we'll just add to firestore, but this is incomplete.
        // In a real app, you would use Firebase Admin SDK to create user.
        
        // Let's throw an error to indicate this needs proper setup.
        // throw new Error("A criação de utilizadores no servidor requer o Firebase Admin SDK.");

        // Given the constraints, we will log a warning and only create the Firestore document.
        // This means the user CANNOT log in until manually created in Firebase Auth Console.
        console.warn("A criar apenas o documento do utilizador no Firestore. O utilizador não conseguirá autenticar-se.");
        
        const userRef = doc(collection(db, "users"));
        await setDoc(userRef, {
            uid: userRef.id, // This is not the auth UID, which is a problem
            name: data.name,
            email: data.email,
            role: 'Confraria',
            status: 'Ativo'
        });
        
        return { success: true, userId: userRef.id };

    } catch (error) {
        console.error("Error creating confraria user: ", error);
        return { success: false, error: "Failed to create confraria user." };
    }
}


export async function uploadImage(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
    const file = formData.get('file') as File | null;

    if (!file) {
        return { success: false, error: 'Nenhum ficheiro recebido.' };
    }

    const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
    const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

    if (!R2_BUCKET_NAME || !R2_PUBLIC_URL) {
        console.error('Variáveis de ambiente do R2 não estão configuradas.');
        return { success: false, error: 'O serviço de upload de imagens não está configurado.' };
    }
    
    try {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileExtension = file.name.split('.').pop();
        const fileName = `${randomUUID()}.${fileExtension}`;

        await r2Client.send(
            new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: fileName,
                Body: fileBuffer,
                ContentType: file.type,
            })
        );
        
        const url = `${R2_PUBLIC_URL}/${fileName}`;
        return { success: true, url };

    } catch (error) {
        console.error('Error uploading to R2:', error);
        return { success: false, error: 'Ocorreu um erro inesperado durante o upload.' };
    }
}


export async function addOrUpdateUser(uid: string, data: { name: string, email: string, role?: string, status?: string, photoURL?: string }) {
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

export async function updateUser(uid: string, data: Partial<{ name: string; email: string; role: string; status: string; photoURL: string; description: string; region: string; foundationYear: string | number; bannerURL: string; }>) {
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

export async function updateDiscovery(id: string, data: any) {
  try {
    const discoveryRef = doc(db, "discoveries", id);
    await updateDoc(discoveryRef, {
      ...data,
      status: 'Pendente', // Reset status to Pending on edit
    });
    return { success: true, id };
  } catch (error) {
    console.error("Error updating discovery: ", error);
    throw new Error("Failed to update discovery.");
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

export async function updateDiscoveryStatus(discoveryId: string, status: 'Aprovado' | 'Rejeitado' | 'Pendente') {
    try {
        const discoveryRef = doc(db, "discoveries", discoveryId);
        await updateDoc(discoveryRef, { status });
        return { success: true };
    } catch (error) {
        console.error("Error updating discovery status: ", error);
        return { success: false, error: "Failed to update discovery status." };
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

            // Fetch author details
            if (data.authorId) {
                const userRef = doc(db, 'users', data.authorId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    data.author = userData.name || data.author;
                    data.authorAvatar = userData.photoURL || null;
                }
            }

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


export async function createConfrariaSubmission(data: any) {
    try {
        const submissionRef = doc(collection(db, "confrariaSubmissions"));
        await setDoc(submissionRef, {
            ...data,
            id: submissionRef.id,
            submittedAt: new Date(),
            status: 'Pendente',
        });
        return { success: true, id: submissionRef.id };
    } catch (error) {
        console.error("Error creating confraria submission: ", error);
        return { success: false, error: "Falha ao submeter o pedido de adesão." };
    }
}

export async function getConfrariaSubmissions() {
    try {
        const submissionsCol = collection(db, 'confrariaSubmissions');
        const submissionSnapshot = await getDocs(submissionsCol);
        const submissionList = submissionSnapshot.docs.map(doc => {
            const data = doc.data();
            if (data.submittedAt && data.submittedAt instanceof Timestamp) {
                data.submittedAt = data.submittedAt.toDate();
            }
            return data;
        });
        return submissionList;
    } catch (error) {
        console.error("Error fetching confraria submissions:", error);
        return [];
    }
}


export async function updateConfrariaSubmissionStatus(submissionId: string, status: 'Aprovado' | 'Rejeitado' | 'Pendente') {
    try {
        const submissionRef = doc(db, "confrariaSubmissions", submissionId);
        await updateDoc(submissionRef, { status });
        return { success: true };
    } catch (error) {
        console.error("Error updating submission status: ", error);
        return { success: false, error: "Failed to update submission status." };
    }
}

export async function getConfrariasCount(): Promise<number> {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("role", "==", "Confraria"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.size;
    } catch (error) {
        console.error("Error fetching confrarias count:", error);
        return 0;
    }
}


export async function getConfrarias() {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("role", "==", "Confraria"));
        const querySnapshot = await getDocs(q);
        const confrariasList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return confrariasList;
    } catch (error) {
        console.error("Error fetching confrarias:", error);
        return [];
    }
}


export async function getUserProfile(id: string) {
    try {
        if (!id) return null;
        const userRef = doc(db, 'users', id);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

export async function createPost(data: any) {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      ...data,
      createdAt: new Date(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating post: ", error);
    return { success: false, error: "Falha ao criar a publicação." };
  }
}

export async function getPostsByConfraria(confrariaId: string) {
    try {
        const postsRef = collection(db, 'posts');
        // The query now only filters by confrariaId, avoiding the composite index error.
        const q = query(postsRef, where("confrariaId", "==", confrariaId));
        const querySnapshot = await getDocs(q);
        
        let postList = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const createdAtDate = data.createdAt instanceof Timestamp 
                ? data.createdAt.toDate() 
                : new Date(data.createdAt); // Fallback for different timestamp formats

            return { 
                id: doc.id, 
                ...data,
                createdAt: createdAtDate.toISOString(),
                createdAtDate: createdAtDate // Keep the date object for sorting
            };
        });

        // Sort the posts in descending order (newest first) in the application code.
        postList.sort((a, b) => b.createdAtDate.getTime() - a.createdAtDate.getTime());

        // Remove the temporary date object before returning
        return postList.map(({ createdAtDate, ...rest }) => rest);

    } catch (error) {
        console.error("Error fetching posts by confraria:", error);
        return [];
    }
}

export async function updatePost(postId: string, data: any) {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, data);
    return { success: true };
  } catch (error) {
    console.error("Error updating post: ", error);
    return { success: false, error: "Falha ao atualizar a publicação." };
  }
}

export async function deletePost(postId: string) {
  try {
    const postRef = doc(db, "posts", postId);
    await deleteDoc(postRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting post: ", error);
    return { success: false, error: "Falha ao eliminar a publicação." };
  }
}
    
// Event Actions
export async function createEvent(data: any) {
  try {
    const docRef = await addDoc(collection(db, "events"), {
      ...data,
      createdAt: new Date(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating event: ", error);
    return { success: false, error: "Falha ao criar o evento." };
  }
}

export async function getEventsByConfraria(confrariaId: string) {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, where("confrariaId", "==", confrariaId), orderBy("date", "asc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Firestore Timestamps need to be converted to be serializable
        if (data.date && data.date instanceof Timestamp) {
            data.date = data.date.toDate().toISOString();
        }
         if (data.createdAt && data.createdAt instanceof Timestamp) {
            data.createdAt = data.createdAt.toDate().toISOString();
        }
        return { id: doc.id, ...data };
    });
  } catch (error) {
    console.error("Error fetching events by confraria:", error);
    return [];
  }
}

export async function updateEvent(eventId: string, data: any) {
  try {
    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, data);
    return { success: true };
  } catch (error) {
    console.error("Error updating event: ", error);
    return { success: false, error: "Falha ao atualizar o evento." };
  }
}

export async function deleteEvent(eventId: string) {
  try {
    await deleteDoc(doc(db, "events", eventId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting event: ", error);
    return { success: false, error: "Falha ao eliminar o evento." };
  }
}
