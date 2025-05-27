<template>
  <div class="blog-container">
    <div class="header-section">
      <div class="text-section">
        <h1 class="blog-title">PALLAS Blog</h1>
        <p class="blog-subtitle">
          Welcome to the PALLAS blog! Here, you'll find updates on policies, initiatives, and activities that support collaboration and highlight the ways art and science can work together. Thanks for being part of the PALLAS community!
        </p>
      </div>
    </div>

    <div v-if="isAdmin" class="admin-controls">
      <button @click="addPost" class="add-post-btn">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14m-7-7h14"/>
        </svg>
        New Post
      </button>
    </div>

    <div class="blog-content">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>
      
      <div v-else-if="sortedPosts && sortedPosts.length" class="posts-grid">
        <article v-for="post in sortedPosts" :key="post._uid" :class="['blog-post-card', { 'admin-mode': isAdmin }]">
          
          <div v-if="isAdmin && post.editing" class="edit-container">
            <div class="edit-header">
              <h3>Editing Post</h3>
              <div class="edit-actions">
                <button @click="savePost(post._uid)" class="save-btn">Save</button>
                <button @click="cancelEdit(post._uid)" class="cancel-btn">Cancel</button>
              </div>
            </div>

            <div class="form-section">
              <div class="form-group">
                <label>Title</label>
                <input v-model="post.title" class="form-input" placeholder="Post title..." />
              </div>

              <div class="form-group">
                <label>Author</label>
                <input v-model="post.author" class="form-input" placeholder="Author name..." />
              </div>

              <div class="form-group">
                <label>Content</label>
                <textarea
                  v-model="post.content"
                  class="form-textarea"
                  placeholder="Write your post content here..."
                  rows="6"
                ></textarea>
              </div>

              <div class="form-group">
                <label>Images</label>
                <div class="images-section">
                  <div v-if="(!post.images || post.images.length === 0)" class="initial-upload">
                    <button @click="openImageEditor(post._uid, -1)" class="add-first-image-btn" type="button">
                      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                      </svg>
                      <span>Add First Image</span>
                    </button>
                  </div>
                  
                  <div v-else-if="post.images && post.images.length > 0">
                    <div v-for="(image, imageIndex) in post.images" :key="image.url || imageIndex" class="image-upload-wrapper">
                      <button
                        @click="removeImage(post._uid, imageIndex)"
                        class="trash-icon-btn"
                        type="button"
                        title="Remove image"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                      
                      <div class="blog-image-preview"
                           :style="{
                             backgroundImage: image.url ? `url(${image.url})` : 'none',
                             backgroundSize: `${(image.zoom || 1) * 100}%`,
                             backgroundPosition: `${image.position?.x || 50}% ${image.position?.y || 50}%`
                           }">
                        <button @click="openImageEditor(post._uid, imageIndex)" class="edit-blog-image-btn" type="button">
                          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                          <span>Change Image</span>
                        </button>
                      </div>
                      <div class="caption-input">
                        <input v-model="image.caption" placeholder="Add caption..." class="form-input caption-field" />
                      </div>
                    </div>
                    
                    <button
                      v-if="post.images.length < 5" 
                      @click="addNewImageSlot(post._uid)"
                      class="add-more-images-btn"
                      type="button"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      <span>Add another image</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="post-content">
            <div class="post-header">
              <div class="post-meta">
                <span class="author">{{ post.author }}</span>
                <span class="date">{{ formatDate(post.date) }}</span>
              </div>
              <div v-if="isAdmin" class="post-actions">
                <button @click="editPost(post._uid)" class="action-btn edit-action">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button @click="removePost(post._uid)" class="action-btn delete-action">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>

            <h2 class="post-title">{{ post.title }}</h2>

            <div class="post-body">
              <p class="post-text">{{ post.content }}</p>
              
              <div v-if="post.images && post.images.length" class="post-images">
                <div v-for="(image, imageIndex) in post.images" :key="image.url || imageIndex" class="image-container">
                  <div class="image-wrapper">
                    <img
                      v-if="image.url"
                      :src="getOptimizedImageUrl(image.url, 'blog')"
                      :alt="image.caption || 'Blog post image'"
                      class="post-image-content" 
                      loading="lazy"
                      :style="{
                        transform: `scale(${image.zoom || 1})`,
                        transformOrigin: `${image.position?.x || 50}% ${image.position?.y || 50}%`
                      }"
                    />
                  </div>
                  <p v-if="image.caption" class="image-caption">{{ image.caption }}</p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="empty-state">
        <h3>No Posts Yet</h3>
        <p>{{ isAdmin ? 'Create your first blog post to get started.' : 'Check back soon for new content!' }}</p>
      </div>
    </div>
    
    
    <ImageResize
      v-if="showImageResize"
      :initial-image="editingImageData?.url || ''"
      :initial-zoom="editingImageData?.zoom || 1.2"
      :initial-position="editingImageData?.position || { x: 50, y: 50 }"
      :display-width="550"
      :display-height="330"
      @save="handleImageSave"
      @cancel="showImageResize = false"
    />
  </div>
</template>

<script>

import { ref, reactive, onMounted, computed } from 'vue';
import { getFirestore, doc, getDoc, setDoc, Timestamp, collection } from 'firebase/firestore';
import { uploadBlogImage, getOptimizedImageUrl } from '../cloudinary';
import ImageResize from './ImageResize.vue';

export default {
  name: 'BlogPage',
  components: {
    ImageResize
  },
  setup() {
    const userInfo = JSON.parse(localStorage.getItem('user-info')) || null;
    const isAdmin = userInfo && userInfo.role === 'admin';
    const isLoading = ref(true);
    const posts = ref([]);
    const db = getFirestore();

    const pendingInitialImageDataMap = reactive({});
    

    const showImageResize = ref(false);
    const editingPostId = ref(null);
    const editingImageIndex = ref(null);
    const editingImageData = ref(null);

    const sortedPosts = computed(() => {
      if (!posts.value) return [];
      return [...posts.value].sort((a, b) => {
        const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
        const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
        return dateB - dateA;
      });
    });

    const findPostIndex = uid => posts.value.findIndex(p => p._uid === uid);

    const initializePendingImage = (post) => {
        if (post && post._uid && !pendingInitialImageDataMap[post._uid]) {
            pendingInitialImageDataMap[post._uid] = {
                caption: '', url: null, public_id: null, zoom: 1.2, position: { x: 50, y: 50 }
            };
        }
    };

    const loadContent = async () => {
      try {
        isLoading.value = true;
        const docRef = doc(db, 'pages', 'blog');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          posts.value = Array.isArray(data.posts)
            ? data.posts.map((post, i) => {
                const postUid = String(post._uid || `loaded_fallback_${Date.now() + i}`);
                return {
                  ...post,
                  editing: false,
                  _uid: postUid, 
                  images: Array.isArray(post.images) ? post.images.map(img => ({ 
                      url: img.url || '',
                      public_id: img.public_id || null,
                      caption: img.caption || '',
                      zoom: Number(img.zoom) || 1.2,
                      position: img.position && typeof img.position.x === 'number' && typeof img.position.y === 'number' 
                                  ? { x: Number(img.position.x), y: Number(img.position.y) } 
                                  : { x: 50, y: 50 }
                  })) : []
                };
              })
            : [];
        } else {
          posts.value = [];
        }
      } catch (error) {
        console.error("Error loading blog content:", error);
        posts.value = [];
      } finally {
        isLoading.value = false;
      }
    };
    
    const removeImage = (postUid, imageIndex) => {
      if (confirm('Are you sure you want to remove this image?')) {
        const postIndex = findPostIndex(postUid);
        if (postIndex !== -1 && posts.value[postIndex].images) {
          posts.value[postIndex].images.splice(imageIndex, 1);
        }
      }
    };

    const handleInitialImageUpload = (post, uploadResult) => {
        if (!post || !post._uid) return;
        if (!pendingInitialImageDataMap[post._uid]) {
            initializePendingImage(post);
        }
        pendingInitialImageDataMap[post._uid] = {
            ...pendingInitialImageDataMap[post._uid],
            postUid: post._uid, 
            url: uploadResult.url || uploadResult.secure_url,
            public_id: uploadResult.public_id,
        };
    };

    const handleInitialImageSaveAndAdd = (post, saveData) => {
        const postUid = post._uid;
        if (pendingInitialImageDataMap[postUid] && pendingInitialImageDataMap[postUid].url) {
            const initialData = pendingInitialImageDataMap[postUid];
            initialData.zoom = saveData.zoom;
            initialData.position = { ...saveData.position };
            const postIndex = findPostIndex(postUid);
            if (postIndex !== -1) {
                if (!posts.value[postIndex].images) {
                    posts.value[postIndex].images = [];
                }
                const finalImageData = { 
                    url: initialData.url,
                    public_id: initialData.public_id,
                    caption: initialData.caption, 
                    zoom: initialData.zoom,
                    position: { ...initialData.position } 
                };
                posts.value[postIndex].images.push(finalImageData);
                delete pendingInitialImageDataMap[postUid]; 
                posts.value = [...posts.value]; 
            }
        }
    };
    
    const updateExistingImageUrl = (postUid, imageIndex, uploadResult) => {
        const postIndex = findPostIndex(postUid);
        if (postIndex !== -1 && posts.value[postIndex].images && posts.value[postIndex].images[imageIndex]) {
            const image = posts.value[postIndex].images[imageIndex];
            image.url = uploadResult.url || uploadResult.secure_url;
            image.public_id = uploadResult.public_id;
            image.zoom = 1.2; 
            image.position = { x: 50, y: 50 };
            image.caption = ''; 
        }
    };

    const saveImageDetails = (postUid, imageIndex, saveData) => {
      const postIndex = findPostIndex(postUid);
      if (postIndex !== -1 && posts.value[postIndex].images && posts.value[postIndex].images[imageIndex]) {
        const image = posts.value[postIndex].images[imageIndex];
        image.zoom = saveData.zoom;
        image.position = { ...saveData.position };
      }
    };
        
    const addNewImageSlot = (postUid) => {
        const postIndex = findPostIndex(postUid);
        if (postIndex === -1) return;

        if (!posts.value[postIndex].images) {
            posts.value[postIndex].images = [];
        }
        const imageLimit = 5; 
        if (posts.value[postIndex].images.length >= imageLimit) {
            alert(`Maximum of ${imageLimit} images per post allowed.`);
            return;
        }
        posts.value[postIndex].images.push({
            url: null, 
            public_id: null,
            caption: '',
            zoom: 1.2,
            position: { x: 50, y: 50 }
        });
    };

    const showAddImage = (uid) => { 
      addNewImageSlot(uid);
    };

    const addPost = () => {
      const newPostUid = `new_${Date.now()}`; 
      const newPost = {
        _uid: newPostUid, 
        title: '',
        author: userInfo?.displayName || userInfo?.email || 'PALLAS Admin',
        content: '',
        date: Timestamp.now(),
        images: [],
        editing: true,
        originalData: null 
      };
      initializePendingImage(newPost); 
      posts.value.unshift(newPost);
    };

    const editPost = uid => {
      const postIndex = findPostIndex(uid);
      if (postIndex !== -1) {
        posts.value[postIndex].originalData = JSON.parse(JSON.stringify(posts.value[postIndex]));
        posts.value[postIndex].editing = true;
      }
    };

    const cancelEdit = uid => {
      const postIndex = findPostIndex(uid);
      if (postIndex !== -1) {
        const post = posts.value[postIndex];
        const postUidStr = String(post._uid || ''); 

        if (postUidStr.startsWith('new_') && !post.title && !post.content && (!post.images || post.images.length === 0)) {
          posts.value.splice(postIndex, 1);
          if (pendingInitialImageDataMap[postUidStr]) { 
            delete pendingInitialImageDataMap[postUidStr];
          }
        } else if (post.originalData) {
          const original = posts.value[postIndex].originalData;
          posts.value[postIndex] = {...original, editing: false}; 
          delete posts.value[postIndex].originalData;
        } else {
          posts.value[postIndex].editing = false;
        }
      }
    };

    const savePost = async uid => {
      const postIndex = findPostIndex(uid);
      if (postIndex === -1) return;
      
      const post = posts.value[postIndex];
      
      if (!post.title.trim() || !post.content.trim()) {
        alert('Please fill in both title and content fields.');
        return;
      }

      try {
        post.editing = false;
        delete post.originalData; 
        await saveAllPosts(); 
        alert('Post saved successfully!');
      } catch (error) {
        console.error("Error saving post:", error);
        alert(`Error saving post: ${error.message}`);
        post.editing = true; 
      }
    };

    const removePost = async uid => {
      const postIndex = findPostIndex(uid);
      if (postIndex === -1) return;

      if (confirm('Are you sure you want to remove this post? This action cannot be undone.')) {
        const postUidStr = String(posts.value[postIndex]._uid || '');
        posts.value.splice(postIndex, 1);
        if (pendingInitialImageDataMap[postUidStr]) { 
            delete pendingInitialImageDataMap[postUidStr];
        }
        try {
          await saveAllPosts();
          alert('Post removed successfully.');
        } catch (error) {
          console.error("Error saving after post removal:", error);
          alert(`Error saving after removal: ${error.message}`);
          loadContent(); 
        }
      }
    };

    const saveAllPosts = async () => {
      if (!isAdmin) {
        console.error('Unauthorized: Admin access required for saving.');
        throw new Error('Unauthorized: Admin access required for saving.');
      }
      
      const postsToSave = posts.value.map(originalPost => {
        const currentUidStr = String(originalPost._uid || ''); 

        const postToSave = { 
          _uid: currentUidStr.startsWith('new_') ? doc(collection(db, 'pages', 'blog', 'posts')).id : originalPost._uid,
          title: originalPost.title || '',
          author: originalPost.author || '',
          content: originalPost.content || '',
          date: originalPost.date instanceof Timestamp ? originalPost.date : Timestamp.fromDate(new Date(originalPost.date || Date.now())),
          images: []
        };
        
        if (originalPost.images && Array.isArray(originalPost.images)) {
          postToSave.images = originalPost.images
            .filter(img => img && typeof img.url === 'string' && img.url.trim() !== '') 
            .map(img => ({
              url: img.url,
              public_id: img.public_id || null,
              caption: img.caption || '',
              zoom: Number(img.zoom) || 1.2,
              position: (img.position && typeof img.position.x === 'number' && typeof img.position.y === 'number')
                          ? { x: Number(img.position.x), y: Number(img.position.y) }
                          : { x: 50, y: 50 }
            }));
        }
        return postToSave;
      });
      
      const docRef = doc(db, 'pages', 'blog');
      await setDoc(docRef, {
        posts: postsToSave
      }, { merge: true }); 
    };

    const formatDate = timestamp => {
      if (!timestamp) return '';
      const date = timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
      if (isNaN(date.getTime())) return 'Invalid Date'; 
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    const openImageEditor = (postId, imageIndex) => {
      editingPostId.value = postId;
      editingImageIndex.value = imageIndex;
      
      const postIndex = findPostIndex(postId);
      if (postIndex === -1) return;
      
      const post = posts.value[postIndex];
      
      if (imageIndex === -1) {

        editingImageData.value = {
          url: '',
          zoom: 1.2,
          position: { x: 50, y: 50 },
          caption: ''
        };
      } else {

        const image = post.images[imageIndex];
        editingImageData.value = {
          url: image.url || '',
          zoom: image.zoom || 1.2,
          position: image.position || { x: 50, y: 50 },
          caption: image.caption || ''
        };
      }
      
      showImageResize.value = true;
    };
    
    const handleImageSave = async (data) => {
      try {
        let imageUrl = data.imageUrl;
        

        if (data.imageUrl.startsWith('data:')) {
          const response = await fetch(data.imageUrl);
          const blob = await response.blob();
          const file = new File([blob], 'blog-image.jpg', { type: 'image/jpeg' });
          const uploadResult = await uploadBlogImage(file);
          imageUrl = uploadResult.url;
        }
        
        const postIndex = findPostIndex(editingPostId.value);
        if (postIndex === -1) return;
        
        const post = posts.value[postIndex];
        
        if (editingImageIndex.value === -1) {

          if (!post.images) {
            post.images = [];
          }
          post.images.push({
            url: imageUrl,
            zoom: data.zoom,
            position: data.position,
            caption: editingImageData.value.caption || ''
          });
        } else {

          post.images[editingImageIndex.value] = {
            ...post.images[editingImageIndex.value],
            url: imageUrl,
            zoom: data.zoom,
            position: data.position
          };
        }
        
        showImageResize.value = false;
        editingPostId.value = null;
        editingImageIndex.value = null;
        editingImageData.value = null;
      } catch (error) {
        console.error('Error saving blog image:', error);
        alert('Failed to save image');
      }
    };

    onMounted(() => {
      loadContent();
    });

    return { 
      posts, 
      sortedPosts,
      isAdmin,
      isLoading,
      showImageResize,
      editingPostId,
      editingImageIndex,
      editingImageData,
      addPost, 
      removePost,
      editPost,
      cancelEdit,
      savePost,
      removeImage,
      saveImageDetails, 
      addNewImageSlot,
      openImageEditor,
      handleImageSave, 
      showAddImage, 
      handleInitialImageUpload,
      handleInitialImageSaveAndAdd,
      updateExistingImageUrl,
      pendingInitialImageDataMap,
      initializePendingImage, 
      uploadBlogImage, 
      formatDate,
      getOptimizedImageUrl
    };
  }
}
</script>

<style scoped>

.image-wrapper {
  position: relative;
  border-radius: 12px; 
  overflow: hidden;   
  background-color: #f0f0f0; 
  padding-bottom: 60%; 
  width: 100%; 
}

.post-image-content { 
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;  
  height: 100%; 
  object-fit: cover; 
  border-radius: 8px; 
}
.blog-container {
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 80vh;
}

.header-section {
  text-align: center;
  margin-bottom: 4rem;
}

.blog-title {
  margin-top: 100px;
  font-size: 4.0vw;
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: 1rem;
}

.blog-subtitle {
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 900px;
  margin: 0 auto;
  line-height: 1.6;
}

.admin-controls {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
}

.add-post-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #6567BE;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(101, 103, 190, 0.2);
}

.add-post-btn:hover {
  background: #7577c4;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(101, 103, 190, 0.3);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #6567BE;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: 100%;
}

.blog-post-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
}

.blog-post-card.admin-mode {
  transition: all 0.3s ease;
}

.blog-post-card.admin-mode:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.post-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.author {
  font-weight: 600;
  color: #374151;
}

.date {
  position: relative;
}

.date::before {
  content: '•';
  margin-right: 1rem;
  color: #d1d5db;
}

.post-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  color: #64748b;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.edit-action:hover {
  background: #f0f9ff;
  color: #0ea5e9;
}

.delete-action:hover {
  background: #fef2f2;
  color: #ef4444;
}

.post-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
  line-height: 1.3;
}

.post-body {
  color: #374151;
  line-height: 1.7;
}

.post-text {
  font-size: 1.05rem;
  margin-bottom: 2rem;
  white-space: pre-wrap; 
}

.post-images {
  display: flex;
  flex-wrap: wrap; 
  justify-content: center; 
  align-items: flex-start; 
  gap: 1rem; 
}

.image-container { 
  width: 550px; 
  max-width: 100%; 
  text-align: center; 
  margin-bottom: 1rem; 
}

.image-caption {
  margin-top: 0.75rem;
  font-style: italic;
  color: #6b7280;
  font-size: 0.9rem;
}

.edit-container {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  background: white;
}

.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.edit-header h3 {
  margin: 0;
  color: #374151;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
}

.save-btn, .cancel-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  color: #64748b;
}

.save-btn:hover {
  transform: translateY(-1px);
  background: #f0fdf4;
  color: #22c55e;
}

.cancel-btn:hover {
  transform: translateY(-1px);
  background: #fef2f2;
  color: #ef4444;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.form-input, .form-textarea {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  background: white;
  font-family: inherit; 
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #6567BE;
  box-shadow: 0 0 0 3px rgba(101, 103, 190, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.images-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.image-upload-wrapper {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #e5e7eb;
}

.trash-icon-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10; 
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  color: #64748b;
}

.trash-icon-btn:hover {
  transform: translateY(-1px);
  background: #fef2f2;
  color: #ef4444;
}

.add-more-images-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  margin-top: 1rem; 
  background: white;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  justify-content: center;
}

.add-more-images-btn:hover {
  border-color: #9ca3af;
  background: #f9fafb;
  color: #374151;
}

.add-more-images-btn svg {
  color: #9ca3af;
  transition: color 0.2s ease;
}

.add-more-images-btn:hover svg {
  color: #6b7280;
}
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #374151;
}

.empty-state p {
  margin: 0;
  color: #6b7280;
}

@media (max-width: 768px) {
  .blog-container { 
    padding: 1rem 0.5rem;
  }

  .blog-title {
    font-size: 2.5rem; 
  }

  .blog-subtitle {
    font-size: 1.1rem;
  }

  .blog-post-card {
    padding: 1.5rem;
    margin: 0 0.5rem; 
  }

  .post-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .post-title {
    font-size: 1.5rem;
  }

  .edit-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .image-container { 
    width: calc(100% - 1rem); 
    margin-left: auto;
    margin-right: auto;
  }
   .image-wrapper { 
    padding-bottom: 75%; 
  }
}

@media (max-width: 480px) {
  .blog-title {
    font-size: 2rem;
  }

  .blog-post-card {
    padding: 1rem;
  }

  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .date::before {
    display: none;
  }
  .image-container { 
    width: 100%; 
  }
   .image-wrapper {
    padding-bottom: 75%; 
  }
}


.blog-image-preview {
  width: 100%;
  height: 330px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  margin-bottom: 10px;
}

.add-first-image-btn,
.edit-blog-image-btn {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.add-first-image-btn:hover,
.edit-blog-image-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: translateY(-1px);
}

.add-first-image-btn {
  flex-direction: column;
  padding: 40px;
  background: #f3f4f6;
  color: #666;
  width: 100%;
  height: 330px;
  border: 2px dashed #ddd;
}

.add-first-image-btn:hover {
  background: #e5e7eb;
  border-color: #6567BE;
  color: #6567BE;
}

.caption-field {
  width: 100%;
  font-size: 14px;
  padding: 8px 12px;
}

.image-upload-wrapper {
  margin-bottom: 20px;
}
</style>