import { z } from 'zod'

// File upload validation schema
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: 'File is required' })
    .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPEG, PNG, and WebP images are allowed'
    )
    .refine(
      (file) => {
        // Additional filename validation
        const validExtensions = ['.jpg', '.jpeg', '.png', '.webp']
        const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
        return validExtensions.includes(extension)
      },
      'File extension must match file type'
    )
})

// File validation helper for magic number checking
export const validateFileContent = async (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const buffer = new Uint8Array(e.target?.result as ArrayBuffer)
      
      // Check magic numbers for common image formats
      if (buffer.length >= 4) {
        // PNG: 89 50 4E 47
        if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
          resolve(true)
          return
        }
        
        // JPEG: FF D8 FF
        if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
          resolve(true)
          return
        }
        
        // WebP: 52 49 46 46 ... 57 45 42 50
        if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
          if (buffer.length >= 12 && 
              buffer[8] === 0x57 && buffer[9] === 0x45 && 
              buffer[10] === 0x42 && buffer[11] === 0x50) {
            resolve(true)
            return
          }
        }
      }
      
      resolve(false)
    }
    
    reader.readAsArrayBuffer(file.slice(0, 12)) // Read first 12 bytes for magic number check
  })
}