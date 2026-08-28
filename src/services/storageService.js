/**
 * Firebase Storage / Document Management Service
 * Structured for easy future connection to Firebase Storage SDK.
 */

// Initial mock document list
export const INITIAL_DOCUMENTS = [
  {
    id: 'doc-1',
    name: 'Resume.pdf',
    type: 'PDF',
    size: '1.2 MB',
    uploadedAt: 'Uploaded 2 days ago',
    url: '#',
    isPrivate: true,
  },
  {
    id: 'doc-2',
    name: 'Certificate.pdf',
    type: 'PDF',
    size: '850 KB',
    uploadedAt: 'Uploaded 1 week ago',
    url: '#',
    isPrivate: true,
  },
  {
    id: 'doc-3',
    name: 'Academic_Record.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploadedAt: 'Uploaded 2 weeks ago',
    url: '#',
    isPrivate: true,
  },
];

/**
 * Uploads a document to storage (currently mock, ready for Firebase Storage `uploadBytesResumable`)
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Callback for progress (0-100)
 * @returns {Promise<Object>} The uploaded document metadata
 */
export async function uploadDocumentToStorage(file, onProgress) {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      if (onProgress) onProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        const newDoc = {
          id: `doc-${Date.now()}`,
          name: file.name,
          type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadedAt: 'Uploaded just now',
          url: URL.createObjectURL(file),
          isPrivate: true,
        };
        resolve(newDoc);
      }
    }, 150);
  });
}

/**
 * Deletes a document from storage (ready for Firebase Storage `deleteObject`)
 * @param {string} docId - The ID of the document to delete
 * @returns {Promise<boolean>}
 */
export async function deleteDocumentFromStorage(docId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 200);
  });
}
