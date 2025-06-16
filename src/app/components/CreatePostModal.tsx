import React, { useRef, useState, useEffect } from 'react'
import styles from '@/styles/Menu.module.scss'

import {api} from '@/services/api'

interface Props{
  token:string | null;
  onClose: () => void;
}

export  function CreatePostModal({token, onClose}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selctedSize, setSelectedSize] = useState(false)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [caption, setCaption] = useState("");
  const [user, setUser] = useState<{ id:string,  nameuser: string, profile_img:string } | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) return
        const res = await api.get('/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setUser(res.data)
      } catch (err) {
        console.error('Erro ao buscar usuário:', err)
      }
    }

    fetchUser()
  }, [token])


  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setSelectedImage(base64)
        setOriginalImage(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBack = () => {
    setSelectedImage(null)
    setIsAdvanced(false)
    setSelectedSize(false)
  }

  const resizeImage = (base64: string, width: number, height: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL())
        }
      }
      img.src = base64
    })
  }

  const publicPost = async () => {
  if (!selectedImage || !user) {
    alert("Imagem ou usuário ausente")
    return
  }

  try {
    const formData = new FormData()

    // Converter base64 para blob
    const byteString = atob(selectedImage.split(',')[1])
    const mimeString = selectedImage.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }

    const blob = new Blob([ab], { type: mimeString })
    const file = new File([blob], 'image.png', { type: mimeString })

    formData.append('files', file)  // nome deve bater com 'upload.single("files")'
    formData.append('id', user.id)
    formData.append('description', caption)
    formData.append('music', '')

    await api.post('/publish', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    alert('Post criado com sucesso!')
    setSelectedImage(null)
    setCaption("")
    setIsAdvanced(false)
    setSelectedSize(false)
  } catch (error) {
    console.error('Erro ao criar post:', error)
    alert('Erro ao criar post.')
  }
}



  const handleRestoreOriginal = () => {
    if (originalImage) {
      setSelectedImage(originalImage)
    }
  }

  const handleResize = async () => {
    if (selectedImage) {
      const resizedImage = await resizeImage(selectedImage, 1000, 1000)
      setSelectedImage(resizedImage)
    }
  }

  const handleResize_2 = async () => {
    if (selectedImage) {
      const resizedImage = await resizeImage(selectedImage, 1024, 768)
      setSelectedImage(resizedImage)
    }
  }

  const handleResize_3 = async () => {
    if (selectedImage) {
      const resizedImage = await resizeImage(selectedImage, 1280, 720)
      setSelectedImage(resizedImage)
    }
  }

  const handleClose = () => {
  setSelectedImage(null);
  setCaption("");
  setIsAdvanced(false);
  setSelectedSize(false);
  onClose();

  };


  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={`${styles.modalContent} ${isAdvanced ? styles.wideModal : ''}`} onClick={(e) => e.stopPropagation()}>
        {selectedImage ? (
          isAdvanced ? (
            <div className={styles.advancedLayout}>
              <div className={styles.topButtons}>
                <button onClick={() => setIsAdvanced(false)} className={styles.backButton}>←</button>
                <button className={styles.shareButton} onClick={publicPost}>Compartilhar</button>
              </div>

              <div className={styles.finalstep}>
                <div className={styles.leftImage}>
                  <img src={selectedImage} alt="Pré-visualização"  onContextMenu={(e) => e.preventDefault()}/>
                </div>
                <div className={styles.rightPanel}>
                  <div className={styles.userInfo}>
                    {user && (
                    <img
                        src={user.profile_img}
                        alt="Perfil"
                        className={styles.profilePic}
                        onContextMenu={(e) => e.preventDefault()}
                    />
                    )}
                    <span className={styles.username}>{user?.nameuser}</span>
                  </div>
                <textarea
                placeholder="Escreva uma legenda..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={2200}
                className={styles.captionInput}
                />
                <div className={styles.charCounter}>{caption.length}/2200</div>                </div>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.topButtons}>
                <button onClick={handleBack} className={styles.backButton}>←</button>
                <button className={styles.nextButton} onClick={() => setIsAdvanced(true)}>Avance</button>
              </div>

              <div className={styles.imagePreview}>
                <img src={selectedImage} alt="Pré-visualização"  onContextMenu={(e) => e.preventDefault()}/>

                {selctedSize ? (
                  <>
                    <div className={styles.resizeButtonContainer}>
                      <button onClick={handleRestoreOriginal}>Original</button>
                      <div></div>
                      <button onClick={handleResize}>1:1</button>
                      <div></div>
                      <button onClick={handleResize_2}>4:3</button>
                      <div></div>
                      <button onClick={handleResize_3}>16:9</button>
                    </div>
                    <button onClick={() => setSelectedSize(false)} className={styles.sizes}>
                      <i className="bi bi-bounding-box-circles"></i>
                    </button>
                  </>
                ) : (
                  <button onClick={() => setSelectedSize(true)} className={styles.sizes}>
                    <i className="bi bi-bounding-box-circles"></i>
                  </button>
                )}
              </div>
            </>
          )
        ) : (
          <>
            <span>Create new post</span>
            <div className={styles.hr}></div>
            <div className={styles.iconContainer}>
              <i className="bi bi-card-image"></i>
              <i className="bi bi-play-btn"></i>
            </div>
            <button className={styles.submitButton} onClick={handleButtonClick}>
              Enviar imagem
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </>
        )}
      </div>
    </div>
  )
}
