import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut , onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';

// Sign up
export const signup = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// Login
export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};
// fetch mail with ID
export const useMailById = (mailId) => {
   const [mailData, setMailData] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         const data = await fetchMailById(mailId);
         setMailData(data);
         setLoading(false);
      };

      if (mailId) fetchData();
   }, [mailId]);

   return { mailData, loading };
};