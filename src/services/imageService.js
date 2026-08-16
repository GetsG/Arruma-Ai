const MAX_IMAGE_BYTES = 60 * 1024;
const MAX_WIDTH = 1024;
const MAX_HEIGHT = 1024;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const { width, height } = img;
        const scale = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height, 1);

        const canvas = document.createElement("canvas");
        canvas.width = width * scale;
        canvas.height = height * scale;

        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

        const tries = [0.8, 0.6, 0.4, 0.3, 0.2];
        for (const q of tries) {
          const dataUrl = canvas.toDataURL("image/jpeg", q);
          const base64 = dataUrl.split(",").pop() || "";
          const bytes = Math.ceil((base64.length * 3) / 4);

          if (bytes <= MAX_IMAGE_BYTES) {
            resolve(dataUrl);
            return;
          }
        }

        reject(
          new Error(
            "Imagem muito grande. Tente tirar uma foto mais aproximada ou recortada."
          )
        );
      };

      img.onerror = reject;
      img.src = reader.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
