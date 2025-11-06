/**
 * IndexedDB utilities for storing audio/image files
 * Used for larger files that exceed localStorage limits
 */

const DB_NAME = 'tunecent_media';
const DB_VERSION = 1;
const AUDIO_STORE = 'audio_files';
const IMAGE_STORE = 'image_files';

interface MediaFile {
  id: string;
  blob: Blob;
  mimeType: string;
  createdAt: string;
}

// Open/Create IndexedDB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(AUDIO_STORE)) {
        db.createObjectStore(AUDIO_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(IMAGE_STORE)) {
        db.createObjectStore(IMAGE_STORE, { keyPath: 'id' });
      }
    };
  });
};

// Save audio file to IndexedDB
export const saveAudioFile = async (id: string, file: File): Promise<string> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([AUDIO_STORE], 'readwrite');
    const store = transaction.objectStore(AUDIO_STORE);

    const mediaFile: MediaFile = {
      id,
      blob: file,
      mimeType: file.type,
      createdAt: new Date().toISOString(),
    };

    await new Promise((resolve, reject) => {
      const request = store.put(mediaFile);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    // Return a reference ID
    return `indexeddb:audio:${id}`;
  } catch (error) {
    console.error('Error saving audio to IndexedDB:', error);
    throw error;
  }
};

// Get audio file from IndexedDB
export const getAudioFile = async (id: string): Promise<string | null> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([AUDIO_STORE], 'readonly');
    const store = transaction.objectStore(AUDIO_STORE);

    const mediaFile: MediaFile | undefined = await new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (!mediaFile) return null;

    // Create blob URL from stored blob
    return URL.createObjectURL(mediaFile.blob);
  } catch (error) {
    console.error('Error getting audio from IndexedDB:', error);
    return null;
  }
};

// Save image file to IndexedDB
export const saveImageFile = async (id: string, file: File): Promise<string> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([IMAGE_STORE], 'readwrite');
    const store = transaction.objectStore(IMAGE_STORE);

    const mediaFile: MediaFile = {
      id,
      blob: file,
      mimeType: file.type,
      createdAt: new Date().toISOString(),
    };

    await new Promise((resolve, reject) => {
      const request = store.put(mediaFile);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    // Return a reference ID
    return `indexeddb:image:${id}`;
  } catch (error) {
    console.error('Error saving image to IndexedDB:', error);
    throw error;
  }
};

// Get image file from IndexedDB
export const getImageFile = async (id: string): Promise<string | null> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([IMAGE_STORE], 'readonly');
    const store = transaction.objectStore(IMAGE_STORE);

    const mediaFile: MediaFile | undefined = await new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (!mediaFile) return null;

    // Create blob URL from stored blob
    return URL.createObjectURL(mediaFile.blob);
  } catch (error) {
    console.error('Error getting image from IndexedDB:', error);
    return null;
  }
};

// Helper to check if URL is an IndexedDB reference
export const isIndexedDBReference = (url: string): boolean => {
  return url.startsWith('indexeddb:');
};

// Parse IndexedDB reference to get ID
export const parseIndexedDBReference = (url: string): { type: 'audio' | 'image'; id: string } | null => {
  if (!isIndexedDBReference(url)) return null;

  const parts = url.split(':');
  if (parts.length !== 3) return null;

  return {
    type: parts[1] as 'audio' | 'image',
    id: parts[2],
  };
};

// Load media file from IndexedDB reference
export const loadMediaFromReference = async (reference: string): Promise<string | null> => {
  const parsed = parseIndexedDBReference(reference);
  if (!parsed) return null;

  if (parsed.type === 'audio') {
    return getAudioFile(parsed.id);
  } else if (parsed.type === 'image') {
    return getImageFile(parsed.id);
  }

  return null;
};
