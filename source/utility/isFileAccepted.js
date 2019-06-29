// Copy-pasted from:
// https://github.com/okonet/attr-accept
// because in that repo it imports `.some` and `.endsWith` from `core-js`.
// `.some` is supported starting from IE 9.
export default function isFileAccepted(file, acceptedFiles) {
  if (file && acceptedFiles) {
    const acceptedFilesArray = Array.isArray(acceptedFiles)
      ? acceptedFiles
      : acceptedFiles.split(',')
    const fileName = file.name || ''
    const mimeType = file.type || ''
    const baseMimeType = mimeType.replace(/\/.*$/, '')

    return acceptedFilesArray.some(type => {
      const validType = type.trim()
      if (validType.charAt(0) === '.') {
        // return fileName.toLowerCase().endsWith(validType.toLowerCase())
        return fileName.toLowerCase().lastIndexOf(validType.toLowerCase()) === fileName.length - validType.length
      // } else if (validType.endsWith('/*')) {
      } else if (ENDS_WITH_SLASH_ASTERISK_REGEXP.test(validType)) {
        // This is something like a image/* mime type
        return baseMimeType === validType.replace(/\/.*$/, '')
      }
      return mimeType === validType
    })
  }
  return true
}

const ENDS_WITH_SLASH_ASTERISK_REGEXP = /\/*$/