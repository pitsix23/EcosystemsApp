import { storage } from './accesoFirebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

const getAllImages = async () => {
  try {
    const listRef = ref(storage, 'images/'); 
    const res = await listAll(listRef);

    const urls = await Promise.all(
      res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return url;
      })
    );

    return urls;
  } catch (error) {
    console.error("Error obteniendo las URLs de las imágenes:", error);
    throw error;
  }
};

export { getAllImages };
