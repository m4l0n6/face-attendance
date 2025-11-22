// Lưu face descriptor vào localStorage
export const saveFaceDescriptor = (name: string, descriptor: Float32Array): void => {
  try {
    const savedFaces = getAllFaceDescriptors();
    savedFaces[name] = Array.from(descriptor);
    localStorage.setItem('faceDescriptors', JSON.stringify(savedFaces));
  } catch (error) {
    console.error('Error saving face descriptor:', error);
    throw error;
  }
};

// Lấy tất cả face descriptors từ localStorage
export const getAllFaceDescriptors = (): Record<string, number[]> => {
  try {
    const data = localStorage.getItem('faceDescriptors');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting face descriptors:', error);
    return {};
  }
};

// Lấy face descriptor của một người
export const getFaceDescriptor = (name: string): Float32Array | null => {
  try {
    const savedFaces = getAllFaceDescriptors();
    const descriptor = savedFaces[name];
    return descriptor ? new Float32Array(descriptor) : null;
  } catch (error) {
    console.error('Error getting face descriptor:', error);
    return null;
  }
};

// Xóa face descriptor
export const deleteFaceDescriptor = (name: string): void => {
  try {
    const savedFaces = getAllFaceDescriptors();
    delete savedFaces[name];
    localStorage.setItem('faceDescriptors', JSON.stringify(savedFaces));
  } catch (error) {
    console.error('Error deleting face descriptor:', error);
    throw error;
  }
};

// Xóa tất cả face descriptors
export const clearAllFaceDescriptors = (): void => {
  try {
    localStorage.removeItem('faceDescriptors');
  } catch (error) {
    console.error('Error clearing face descriptors:', error);
    throw error;
  }
};

// Đếm số lượng face đã lưu
export const getFaceCount = (): number => {
  const savedFaces = getAllFaceDescriptors();
  return Object.keys(savedFaces).length;
};
