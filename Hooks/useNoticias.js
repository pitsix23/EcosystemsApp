// useNoticias.js

import { useState, useEffect } from 'react';
import { database } from '../accesoFirebase'; // Ajusta la ruta según sea necesario
import { ref, onValue } from 'firebase/database';

const useNoticias = () => {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const noticiasRef = ref(database, 'noticias');

        onValue(noticiasRef, (snapshot) => {
          const noticiasData = snapshot.val() || [];
          setNoticias(noticiasData);
        });

        // Limpia el listener cuando el componente se desmonta
        return () => {
          onValue(noticiasRef, () => {}); // Detiene el listener
        };
      } catch (error) {
        console.error('Error fetching noticias:', error);
      }
    };

    fetchNoticias();

    // Limpia el listener cuando el componente se desmonta
    return () => {
      onValue(ref(database, 'noticias'), () => {}); // Detiene el listener
    };
  }, []);

  return noticias;
};

export default useNoticias;
