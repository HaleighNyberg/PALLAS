import { auth } from "./firebase";

const CLOUD_NAME = 'dcupr3hmp';
const UPLOAD_PRESET = 'PALLASpreset'; 
async function uploadToCloudinaryBase(file, folder) {
  console.log('uploadToCloudinaryBase called with folder:', folder);
  console.log('File details:', file.name, file.type, file.size);
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  console.log('Sending request to Cloudinary...');
  console.log('URL:', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  console.log('Response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error("Cloudinary upload error:", errorData);
    
    if (errorData.error?.message?.includes('preset')) {
      throw new Error(`Cloudinary Error: ${errorData.error.message}. Please update UPLOAD_PRESET in src/cloudinary.js with your actual Cloudinary preset name.`);
    }
    
    throw new Error(errorData.error?.message || "Failed to upload to Cloudinary");
  }

  const result = await response.json();
  console.log('Cloudinary upload successful:', result);
  return result;
}

export async function uploadProfileImage(file) {
  console.log('uploadProfileImage called');
  const user = auth.currentUser;
  console.log('Current user:', user ? user.uid : 'null');
  
  if (!user || !user.uid) {
    throw new Error("User not authenticated");
  }
  
  console.log('Uploading to folder:', `profile_images/${user.uid}`);
  return uploadToCloudinaryBase(file, `profile_images/${user.uid}`);
}

export async function uploadBlogImage(file) {
  const user = auth.currentUser;
  if (!user || !user.uid) {
    throw new Error("User not authenticated");
  }
  const result = await uploadToCloudinaryBase(file, `blog_images/${user.uid}`);
  return {
    url: result.secure_url,
    public_id: result.public_id,
    caption: ''
  };
}

export async function uploadBackgroundImage(file) {
  console.log('uploadBackgroundImage called');
  const user = auth.currentUser;
  console.log('Current user:', user ? user.uid : 'null');
  
  if (!user || !user.uid) {
    throw new Error("User not authenticated");
  }
  
  console.log('Uploading to folder:', `background_images/${user.uid}`);
  return uploadToCloudinaryBase(file, `background_images/${user.uid}`);
}

export async function uploadPortfolioImage(file) {
  const user = auth.currentUser;
  if (!user || !user.uid) {
    throw new Error("User not authenticated");
  }
  return uploadToCloudinaryBase(file, `portfolio_images/${user.uid}`);
}

export function getOptimizedImageUrl(url, type = 'blog') {
  if (!url) return url;
  const transformations = {
    blog:       'c_scale,w_800,q_auto,f_auto',
    profile:    'c_scale,w_300,h_300,c_fill,g_face,q_auto,f_auto',
    thumbnail:  'c_scale,w_150,h_150,c_fill,q_auto,f_auto',
    background: 'c_scale,w_1200,q_auto,f_auto'
  };
  const transform = transformations[type] || transformations.blog;
  if (url.includes('/upload/') && !url.includes('/upload/v')) {
    return url;
  }
  return url.replace('/upload/', `/upload/${transform}/`);
}

export async function deleteCloudinaryImage(publicId) {
  const user = auth.currentUser;
  if (!user || !user.uid) {
    throw new Error("User not authenticated");
  }
  console.log('Request to delete image:', publicId);
}
