export const acceptsFilesExtension = {
  // Images
  'image/*': [
    '.apng', '.avif', '.bmp', '.gif', '.ico', '.jpeg', '.jpg', '.png', 
    '.svg', '.tif', '.tiff', '.webp'
  ],
  'image/apng': [
    '.apng'
  ],
  'image/avif': [
    '.avif'
  ],
  'image/bmp': [
    '.bmp'
  ],
  'image/gif': [
    '.gif'
  ],
  'image/vnd.microsoft.icon': [
    '.ico'
  ],
  'image/jpeg': [
    '.jpeg', '.jpg'
  ],
  'image/png': [
    '.png'
  ],
  'image/svg+xml': [
    '.svg'
  ],
  'image/tiff': [
    '.tif', '.tiff'
  ],
  'image/webp': [
    '.webp'
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
  'audio/*': [
    '.aac', '.mid', '.midi', '.mp3', '.oga', '.opus', '.wav', '.weba'
  ],
  'audio/aac': [
    '.aac'
  ],
  'audio/midi': [
    '.mid', '.midi'
  ],
  'audio/mpeg': [
    '.mp3'
  ],
  'audio/ogg': [
    '.oga'
  ],
  'audio/opus': [
    '.opus'
  ],
  'audio/wav': [
    '.wav'
  ],
  'audio/webm': [
    '.weba'
  ],

  // Video
  'video/*': [
    '.avi', '.mp4', '.mpeg', '.ogv', '.ts', '.webm', '.3gp', '.3g2'
  ],
  'video/x-msvideo': [
    '.avi'
  ],
  'video/mp4': [
    '.mp4'
  ],
  'video/mpeg': [
    '.mpeg'
  ],
  'video/ogg': [
    '.ogv'
  ],
  'video/mp2t': [
    '.ts'
  ],
  'video/webm': [
    '.webm'
  ],
  'video/3gpp': [
    '.3gp'
  ],
  'video/3gpp2': [
    '.3g2'
  ],
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