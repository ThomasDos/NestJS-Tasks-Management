/**
 * Convert a buffer image to a Data URI format.
 *
 * @param file The buffer image file.
 * @returns Data URI representing the image.
 */
function formatBufferImageToDataUri(file: Express.Multer.File) {
  const b64 = Buffer.from(file.buffer).toString('base64');
  const dataURI = 'data:' + file.mimetype + ';base64,' + b64;

  return dataURI;
}

export default formatBufferImageToDataUri;
