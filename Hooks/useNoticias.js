import { getDatabase, ref, get, onValue } from 'firebase/database';
import { useEffect, useState } from 'react';
import { app } from '../accesoFirebase'; // Ajusta la ruta según sea necesario

const useNoticias = () => {
  const [noticias, setNoticias] = useState([]);
  const db = getDatabase(app);
  const noticiasRef = ref(db, 'noticias'); // Ajusta la referencia según tu estructura de base de datos

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const snapshot = await get(noticiasRef);
        if (snapshot.exists()) {
          const noticiasList = [];
          snapshot.forEach((childSnapshot) => {
            const noticia = childSnapshot.val();
            noticiasList.push(noticia);
          });
          setNoticias(noticiasList);
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching noticias:', error);
      }
    };

    fetchNoticias();

    // También podrías usar `onValue` para mantener los datos actualizados en tiempo real
    // onValue(noticiasRef, (snapshot) => {
    //   const noticiasList = [];
    //   snapshot.forEach((childSnapshot) => {
    //     const noticia = childSnapshot.val();
    //     noticiasList.push(noticia);
    //   });
    //   setNoticias(noticiasList);
    // });

  }, []);

  return noticias;
};

export default useNoticias;
