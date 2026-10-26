/** Preparación de imágenes en el navegador: recorte central + reescalado
 *  + codificación WebP (con JPEG de respaldo). Así las fotos suben livianas
 *  al bucket sin depender de procesos de servidor. */
export async function resizeToWebp(
  file: File,
  width: number,
  height: number,
): Promise<{ blob: Blob; ext: string }> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) {
    bitmap.close()
    throw new Error("no-canvas")
  }
  ctx.imageSmoothingQuality = "high"
  /* Recorte tipo "cover": se agranda el lado corto para llenar el marco
     y se centra, igual que object-cover en pantalla. */
  const scale = Math.max(width / bitmap.width, height / bitmap.height)
  const drawWidth = bitmap.width * scale
  const drawHeight = bitmap.height * scale
  ctx.drawImage(
    bitmap,
    (bitmap.width - drawWidth) / 2,
    (bitmap.height - drawHeight) / 2,
    drawWidth,
    drawHeight,
    0,
    0,
    width,
    height,
  )
  bitmap.close()
  const webp = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.88),
  )
  if (webp) return { blob: webp, ext: "webp" }
  const jpeg = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.9),
  )
  if (!jpeg) throw new Error("no-encode")
  return { blob: jpeg, ext: "jpg" }
}
