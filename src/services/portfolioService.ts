import { getFirebaseServices } from '../config/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import * as portfolioData from '../data/portfolio';

// Get the initial profile data
const getInitialProfile = () => ({
  name: portfolioData.profile.name,
  title: portfolioData.profile.title,
  bio: portfolioData.profile.bio,
  email: portfolioData.profile.email,
  phone: portfolioData.profile.phone,
  address: portfolioData.profile.address,
  image: portfolioData.profile.image,
  coverImage: portfolioData.profile.coverImage,
  status: portfolioData.profile.status,
  university: portfolioData.profile.university,
  completion: portfolioData.profile.completion,
});

export interface ProfileData {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  address: string;
  image: string;
  coverImage: string;
  status: string;
  university: string;
  completion: number;
}

export interface ContactData {
  email: string;
  phone: string;
  address: string;
}

/**
 * Fetch profile data from Firestore, fallback to default data
 */
export async function fetchProfileData(): Promise<ProfileData> {
  try {
    const { firestore } = getFirebaseServices();
    if (!firestore) {
      console.log('Firestore not available, using default profile data');
      return getInitialProfile();
    }

    const profileDoc = await getDoc(doc(firestore, 'portfolio', 'profile'));
    
    if (profileDoc.exists()) {
      const data = profileDoc.data() as Partial<ProfileData>;
      // Merge with defaults to ensure all fields exist
      return {
        ...getInitialProfile(),
        ...data,
      };
    } else {
      // Document doesn't exist, return defaults
      return getInitialProfile();
    }
  } catch (error) {
    console.error('Error fetching profile data:', error);
    // Return defaults on error
    return getInitialProfile();
  }
}

/**
 * Save profile data to Firestore
 */
export async function saveProfileData(data: { name: string; title: string; bio: string }): Promise<boolean> {
  try {
    const { firestore } = getFirebaseServices();
    if (!firestore) {
      throw new Error('Firestore not available');
    }

    const profileRef = doc(firestore, 'portfolio', 'profile');
    await setDoc(profileRef, data, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving profile data:', error);
    throw error;
  }
}

/**
 * Save contact data to Firestore
 */
export async function saveContactData(data: { email: string; phone: string; address: string }): Promise<boolean> {
  try {
    const { firestore } = getFirebaseServices();
    if (!firestore) {
      throw new Error('Firestore not available');
    }

    const contactRef = doc(firestore, 'portfolio', 'contact');
    await setDoc(contactRef, data, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving contact data:', error);
    throw error;
  }
}

/**
 * Fetch contact data from Firestore
 */
export async function fetchContactData(): Promise<ContactData> {
  try {
    const { firestore } = getFirebaseServices();
    if (!firestore) {
      return {
        email: portfolioData.profile.email,
        phone: portfolioData.profile.phone,
        address: portfolioData.profile.address,
      };
    }

    const contactDoc = await getDoc(doc(firestore, 'portfolio', 'contact'));
    
    if (contactDoc.exists()) {
      const data = contactDoc.data() as Partial<ContactData>;
      return {
        email: data.email || portfolioData.profile.email,
        phone: data.phone || portfolioData.profile.phone,
        address: data.address || portfolioData.profile.address,
      };
    } else {
      return {
        email: portfolioData.profile.email,
        phone: portfolioData.profile.phone,
        address: portfolioData.profile.address,
      };
    }
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return {
      email: portfolioData.profile.email,
      phone: portfolioData.profile.phone,
      address: portfolioData.profile.address,
    };
  }
}
