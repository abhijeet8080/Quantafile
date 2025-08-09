// lib/upload-avatar.ts
import { toast } from 'sonner';

export default async function uploadAvatar(avatar: File): Promise<string | null> {
  if (!avatar) return null;

  const formData = new FormData();
  formData.append('file', avatar);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);
  formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_NAME!); 

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_API!, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'Upload failed');

    return data.secure_url;
  } catch (err: unknown) {
    if (err instanceof Error) {
      toast.error(err.message);
    } else {
      toast.error('Avatar upload failed');
    }
    return null;
  }
}
