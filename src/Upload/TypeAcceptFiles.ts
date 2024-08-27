export const acceptsFilesExtension = {
  // Images
  'image/*': [
    '.apng', '.avif', '.bmp', '.gif', '.ico', '.jpeg', '.jpg', '.png', 
    '.svg', '.tif', '.tiff', '.webp'
  ],
  // Documents
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'text/plain': ['.txt'],
  // Audio
  'audio/*': ['.aac', '.mid', '.midi', '.mp3', '.oga', '.opus', '.wav', '.weba'],
  // Video
  'video/*': ['.avi', '.mp4', '.mpeg', '.ogv', '.ts', '.webm', '.3gp', '.3g2'],
  // Archives
  'application/zip': ['.zip'],
  'application/x-7z-compressed': ['.7z'],
  'application/x-bzip': ['.bz'],
  'application/x-bzip2': ['.bz2'],
  'application/gzip': ['.gz'],
  'application/vnd.rar': ['.rar'],
  'application/x-tar': ['.tar'],
  // Others
  'application/json': ['.json'],
  'text/css': ['.css'],
  'text/html': ['.htm', '.html'],
  'text/javascript': ['.js', '.mjs'],
  'application/xml': ['.xml'],
  'font/otf': ['.otf'],
  'font/ttf': ['.ttf'],
  'font/woff': ['.woff'],
  'font/woff2': ['.woff2'],
};

export type AcceptedFileTypeKey = keyof typeof acceptsFilesExtension;

export type AcceptedFileTypes = {
  [K in AcceptedFileTypeKey]?: string[]
};