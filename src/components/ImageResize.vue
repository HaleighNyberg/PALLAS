<template>
  <div class="modal-overlay" @click.self="cancel">
    <div class="form resize-form">
      <button class="close-button" @click="cancel">&times;</button>
      <p class="title">Resize & Position Image</p>
      <p class="message">Upload an image, then drag to position and scroll to zoom</p>
      
      <div class="resize-content" @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="handleDrop">
        
        <div v-if="imageUrl" class="preview-container">
          <div 
            class="image-preview"
            :class="{ 'drag-over': isDragOver }"
            :style="previewStyle"
            @wheel.prevent="handleWheel"
            @mousedown="startDrag"
            @mousemove="handleDrag"
            @mouseup="stopDrag"
            @mouseleave="stopDrag"
          >
            <img 
              :src="imageUrl"
              :style="imageStyle"
              alt="Preview"
              draggable="false"
              @dragstart.prevent
            />
            <div class="crop-guide"></div>
            <div v-if="isDragOver" class="drag-overlay">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
              <span>Drop to replace image</span>
            </div>
          </div>
          
          
          <div class="zoom-controls">
            <button @click="zoomOut" class="zoom-btn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
            <div class="zoom-display">{{ Math.round(zoom * 100) }}%</div>
            <button @click="zoomIn" class="zoom-btn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="11" y1="8" x2="11" y2="14"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
            <div class="separator"></div>
            <button @click="clearImage" class="clear-btn" title="Clear image">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              <span>Clear</span>
            </button>
          </div>
        </div>
        
        
        <div v-else class="upload-area" :class="{ 'drag-over': isDragOver }" :style="previewStyle">
          <input 
            type="file" 
            ref="fileInput"
            @change="handleFileSelect"
            accept="image/*"
            hidden
          />
          <button @click="$refs.fileInput.click()" class="upload-btn">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21,15 16,10 5,21"/>
            </svg>
            <span>Click to upload or drag image here</span>
          </button>
        </div>
      </div>
      
      
      <div class="action-buttons">
        <button @click="cancel" class="cancel-btn">Cancel</button>
        <button @click="save" class="save-btn" :disabled="!imageUrl">Save Changes</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'ImageResize',
  props: {
    initialImage: {
      type: String,
      default: ''
    },
    initialZoom: {
      type: Number,
      default: 1.2
    },
    initialPosition: {
      type: Object,
      default: () => ({ x: 50, y: 50 })
    },
    displayWidth: {
      type: Number,
      default: 400
    },
    displayHeight: {
      type: Number,
      default: 400
    }
  },
  emits: ['save', 'cancel'],
  setup(props, { emit }) {

    const imageUrl = ref(props.initialImage)
    const zoom = ref(props.initialZoom)
    const position = ref({ ...props.initialPosition })
    

    const isDragging = ref(false)
    const dragStart = ref({ x: 0, y: 0 })
    const positionStart = ref({ x: 0, y: 0 })
    

    const isDragOver = ref(false)
    

    const previewDimensions = computed(() => {
      const maxWidth = 600
      const maxHeight = 500
      const aspectRatio = props.displayWidth / props.displayHeight
      
      let width = props.displayWidth
      let height = props.displayHeight
      

      if (width > maxWidth) {
        width = maxWidth
        height = width / aspectRatio
      }
      
      if (height > maxHeight) {
        height = maxHeight
        width = height * aspectRatio
      }
      

      const minSize = 200
      if (width < minSize && height < minSize) {
        if (aspectRatio > 1) {
          width = minSize * aspectRatio
          height = minSize
        } else {
          width = minSize
          height = minSize / aspectRatio
        }
      }
      
      return {
        width: Math.round(width),
        height: Math.round(height)
      }
    })
    

    watch(() => props.initialImage, (newImage) => {
      if (newImage !== imageUrl.value) {
        imageUrl.value = newImage
      }
    })
    
    watch(() => props.initialZoom, (newZoom) => {
      zoom.value = newZoom
    })
    
    watch(() => props.initialPosition, (newPosition) => {
      position.value = { ...newPosition }
    }, { deep: true })
    

    const imageStyle = computed(() => ({
      transform: `translate(-50%, -50%) scale(${zoom.value})`,
      left: `${position.value.x}%`,
      top: `${position.value.y}%`,
    }))
    
    const previewStyle = computed(() => ({
      width: `${previewDimensions.value.width}px`,
      height: `${previewDimensions.value.height}px`
    }))
    

    const handleFileSelect = (event) => {
      const file = event.target.files?.[0]
      if (file) processFile(file)
    }
    
    const handleDrop = (event) => {
      isDragOver.value = false
      const file = event.dataTransfer.files?.[0]
      if (file) processFile(file)
    }
    
    const onDragOver = () => {
      isDragOver.value = true
    }
    
    const onDragLeave = (event) => {

      if (!event.currentTarget.contains(event.relatedTarget)) {
        isDragOver.value = false
      }
    }
    
    const processFile = (file) => {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        imageUrl.value = e.target.result
      }
      reader.readAsDataURL(file)
    }
    

    const handleWheel = (event) => {
      const delta = event.deltaY * -0.001
      zoom.value = Math.max(1.2, Math.min(3, zoom.value + delta))
    }
    
    const zoomIn = () => {
      zoom.value = Math.min(3, zoom.value + 0.1)
    }
    
    const zoomOut = () => {
      zoom.value = Math.max(1.2, zoom.value - 0.1)
    }
    

    

    const startDrag = (event) => {
      isDragging.value = true
      dragStart.value = { x: event.clientX, y: event.clientY }
      positionStart.value = { ...position.value }
    }
    
    const handleDrag = (event) => {
      if (!isDragging.value) return
      
      const dx = event.clientX - dragStart.value.x
      const dy = event.clientY - dragStart.value.y
      

      const containerWidth = previewDimensions.value.width
      const containerHeight = previewDimensions.value.height
      
      const dxPercent = (dx / containerWidth) * 100
      const dyPercent = (dy / containerHeight) * 100
      

      position.value = {
        x: Math.max(0, Math.min(100, positionStart.value.x + dxPercent)),
        y: Math.max(0, Math.min(100, positionStart.value.y + dyPercent))
      }
    }
    
    const stopDrag = () => {
      isDragging.value = false
    }
    

    const save = () => {
      if (!imageUrl.value) return
      
      emit('save', {
        imageUrl: imageUrl.value,
        zoom: zoom.value,
        position: { ...position.value }
      })
    }
    
    const cancel = () => {
      emit('cancel')
    }
    
    const clearImage = () => {
      imageUrl.value = ''
      zoom.value = 1.2
      position.value = { x: 50, y: 50 }
    }
    
    return {
      imageUrl,
      zoom,
      position,
      imageStyle,
      previewStyle,
      isDragOver,
      handleFileSelect,
      handleDrop,
      onDragOver,
      onDragLeave,
      handleWheel,
      zoomIn,
      zoomOut,
      clearImage,
      startDrag,
      handleDrag,
      stopDrag,
      save,
      cancel
    }
  }
}
</script>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}


.form.resize-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 500px;
  max-width: 90vw;
  padding: 25px;
  border-radius: 20px;
  position: relative;
  background-color: #1a1a1a;
  color: #fff;
  border: 1px solid #333;
  max-height: 90vh;
  overflow-y: auto;
}


.title {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -1px;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 30px;
  color: #6567BE;
  margin-bottom: 5px;
}

.title::before,
.title::after {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  border-radius: 50%;
  left: 0px;
  background-color: #6567BE;
}

.title::after {
  animation: pulse 1s linear infinite;
}

.message {
  font-size: 14.5px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
}


.resize-content {
  background: #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  min-height: 300px;
}


.preview-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.image-preview {
  position: relative;
  max-width: 100%;
  margin: 0 auto;
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  cursor: move;
  border: 2px solid #333;
}

.image-preview:active {
  cursor: grabbing;
}

.image-preview img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  pointer-events: none;
}


.crop-guide {
  position: absolute;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  border: 2px dashed rgba(101, 103, 190, 0.5);
  border-radius: 8px;
  pointer-events: none;
  z-index: 10;
}


.zoom-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  background: #333;
  border-radius: 8px;
  padding: 10px;
}

.zoom-btn {
  background: #6567BE;
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.zoom-btn:hover {
  background: rgba(101, 103, 190, 0.8);
  transform: translateY(-1px);
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #d32f2f;
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.clear-btn:hover {
  background: #b71c1c;
  transform: translateY(-1px);
}

.clear-btn svg {
  flex-shrink: 0;
}

.separator {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 5px;
}

.zoom-display {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 500;
  min-width: 50px;
  text-align: center;
}


.upload-area {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #444;
  border-radius: 12px;
  background: #1a1a1a;
  transition: all 0.3s ease;
  margin: 0 auto;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #6567BE;
  background: rgba(101, 103, 190, 0.05);
}


.image-preview.drag-over {
  border-color: #6567BE;
  background: rgba(101, 103, 190, 0.05);
}


.drag-overlay {
  position: absolute;
  inset: 0;
  background: rgba(101, 103, 190, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: white;
  z-index: 20;
  border-radius: 10px;
}

.drag-overlay svg {
  opacity: 0.9;
}

.drag-overlay span {
  font-size: 18px;
  font-weight: 500;
}

.upload-btn {
  background: none;
  border: none;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  padding: 40px;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  color: #6567BE;
}

.upload-btn span {
  font-size: 16px;
}


.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.cancel-btn,
.save-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #333;
  color: rgba(255, 255, 255, 0.8);
}

.cancel-btn:hover {
  background: #444;
}

.save-btn {
  background: #6567BE;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: rgba(101, 103, 190, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(101, 103, 190, 0.3);
}

.save-btn:disabled {
  background: rgba(150, 150, 150, 0.3);
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
}


.close-button {
  position: absolute;
  top: 20px;
  right: 25px;
  background: none;
  border: none;
  font-size: 28px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #6567BE;
}


@keyframes pulse {
  from {
    transform: scale(0.9);
    opacity: 1;
  }
  to {
    transform: scale(1.8);
    opacity: 0;
  }
}


@media (max-width: 600px) {
  .form.resize-form {
    width: 95vw;
    padding: 20px;
  }
  
  .resize-content {
    padding: 15px;
  }
}
</style>