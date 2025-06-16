"use client"

import { useEffect, useState, useRef } from "react"
import Cropper from "react-easy-crop"
import { getCroppedImg } from "../utils/cropImage"
import { api } from '@/services/api'
import style from '@/styles/Edit.module.scss'
import Menu from "@/app/components/Menu"
import { redirect, useRouter } from 'next/navigation'


interface EditProps {
  token: string | null
}

export default function Edit({ token }: EditProps) {
  const [user, setUser] = useState<{ nameuser: string, name: string, profile_img: string, description: string } | null>(null)
  const [bio, setBio] = useState("");
  const [nameUser, setNameUser] = useState("");
  const [name, setName] = useState("");
  const [changephoto, setphoto] = useState(false);
  const [showPhotoOnly, setShowPhotoOnly] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [minZoom, setMinZoom] = useState(1);

  const router = useRouter()


  useEffect(() => {
    if (!token) return
    api.get('/me', { headers: { Authorization: `Bearer ${token}` } }).then(res => {
      setUser(res.data)
      setBio(res.data.description || "")
      setNameUser(res.data.nameuser || "")
      setName(res.data.name || "")
    }).catch(() => console.error('Error finding the user'))
  }, [token])

  const handleSave = async () => {
    try {
      if (!token) return;
      await api.put('/me', {
        nameuser: nameUser,
        name: name,
        description: bio,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Profile updated successfully!");
    } catch {
      console.error("Erro ao atualizar o perfil");
    }
  };

  const handleDeleteProfile = async () => {
    if (!token) return;

    const confirmDelete = confirm("Are you sure you want to delete your profile? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      await api.delete('/delete-me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Your profile has been deleted.");
      router.push("/"); // ou use router.push("/")
    } catch (err) {
      console.error("Erro ao deletar o perfil", err);
      alert("Erro ao deletar o perfil.");
    }
  };


  const cancelChange = () => {
    setSelectedImage(null);
    setShowPhotoOnly(false);
  }

  const setcancel = () => {
    setphoto(false);
    setSelectedImage(null);
    setShowPhotoOnly(false);
  }

  const setDeletePhoto = async () => {
    try{
        if (!token) return
        await api.delete('/deletephoto',{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        alert("Delete photo with sucess!");
    }catch (err){
        console.error("Erro", err)
    }
  }

 const cropSize = { width: 300, height: 300 };
 const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        const img = new Image();
        img.onload = () => {
        const { width, height } = img;

        // Cálculo: quanto a menor dimensão precisa ser ampliada para cobrir o crop
        const zoomToFill = Math.max(
            cropSize.width / width,
            cropSize.height / height
        );

        setMinZoom(zoomToFill);
        setZoom(zoomToFill);
        setCrop({ x: 0, y: 0 });
        setSelectedImage(imageDataUrl);
        setShowPhotoOnly(true);
        };
        img.src = imageDataUrl;
    };
    reader.readAsDataURL(file);
    };


  const handleCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const setChenge = async () => {
    if (!selectedImage || !croppedAreaPixels || !token) return;

    try {
        const croppedImage = await getCroppedImg(selectedImage, croppedAreaPixels); // deve retornar base64

        // Converter base64 para Blob
        const blob = await fetch(croppedImage).then(res => res.blob());

        const formData = new FormData();
        formData.append('files', blob, "profile.jpg");

        await api.post("/upload/profile", formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
        });

        alert("Imagem atualizada com sucesso!");
        setphoto(false);
        setSelectedImage(null);
        setShowPhotoOnly(false);
    } catch (error) {
        console.error("Erro ao enviar imagem:", error);
        alert("Erro ao enviar imagem");
    }
    };


  return (
    <>
        <Menu token={token}/>
      <div className={style.mainEdit}>
        <div className={style.profilecontainer}>
          <h1>Edit profile</h1>
          <div className={style.profile}>
            {user && (
              <img
                src={user.profile_img}
                alt="Perfil"
                onContextMenu={(e) => e.preventDefault()}
              />
            )}
            <div className={style.userinfo}>
              <span>{user?.nameuser}</span>
              <span>{user?.name}</span>
            </div>
            <button className={style.changephoto} onClick={() => setphoto(true)}>Change foto</button>
          </div>
        </div>

        <div className={style.inputs}>
          <span>Name User</span>
          <input value={nameUser} onChange={(e) => setNameUser(e.target.value)} />
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className={style.bioStyle}>
          <h1>Bio</h1>
          <textarea
            placeholder="Bio"
            maxLength={150}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
          <div>{bio.length}/150</div>
        </div>

        <div className={style.buttonsContainer}>
          <button onClick={handleSave} className={style.saveButton}>Send</button>
          <button onClick={handleDeleteProfile} className={style.delete}>Delete</button>
        </div>
      </div>

      {changephoto && (
    <div className={style.configphoto}>
        {showPhotoOnly && selectedImage ? (
        <div className={style.cropContainer}>
            <div className={style.cropHeader}>
            <button onClick={cancelChange}>←</button>
            <button className={style.sendChange} onClick={setChenge}>Change</button>
            </div>
            <div className={style.cropArea}>
           <Cropper
            image={selectedImage}
            crop={crop}
            zoom={zoom}
            minZoom={minZoom}
            aspect={1}
            cropSize={cropSize}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            />

            </div>
        </div>
        ) : (
        <div className={style.options}>
            <button onClick={() => fileInputRef.current?.click()}>Change Photo</button>
            <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            />
            <button onClick={setDeletePhoto}>Delete Photo</button>
            <button onClick={setcancel}>Cancel</button>
        </div>
        )}
    </div>
)}

    </>
  )
}
