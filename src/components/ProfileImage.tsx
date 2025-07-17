'use client'
import { useState } from 'react'

interface ProfileImageProps {
  src: string
  alt: string
  size?: number
}

export default function ProfileImage({ src, alt, size = 150 }: ProfileImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      margin: '0 auto 24px',
      borderRadius: '50%',
      overflow: 'hidden',
      border: '5px solid #3b82f6',
      boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
      position: 'relative'
    }}>
      {/* Fallback background */}
      {!imageLoaded && !imageError && (
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '64px',
          color: 'white'
        }}>
          👨‍💻
        </div>
      )}
      
      {/* Error fallback */}
      {imageError && (
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '64px',
          color: 'white'
        }}>
          👨‍💻
        </div>
      )}
      
      {/* Actual image */}
      {!imageError && (
        <img 
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: imageLoaded ? 'block' : 'none'
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  )
}