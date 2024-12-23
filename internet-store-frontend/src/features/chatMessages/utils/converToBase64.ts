export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string); // строка base64
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
