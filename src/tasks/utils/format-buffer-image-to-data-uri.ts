function formatBufferImageToDataUri(file: Express.Multer.File) {
  const b64 = Buffer.from(file.buffer).toString('base64');
  const dataURI = 'data:' + file.mimetype + ';base64,' + b64;

  return dataURI;
}

export default formatBufferImageToDataUri;
