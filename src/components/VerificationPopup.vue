<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="form">
      <button class="close-button" @click="$emit('close')">&times;</button>
      <p class="title">Profile Verification Pending</p>
      <p class="message">Your PALLAS profile is currently under review by our admin team.</p>
      
      <div class="notice-content">
        <div class="notice-icon">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        </div>
        
        <div class="notice-features">
          <h3>What you can do while waiting:</h3>
          <ul>
            <li>Edit your profile information</li>
            <li>Upload portfolio items</li>
            <li>Set your art focus and medium tags</li>
            <li>Configure contact preferences</li>
          </ul>
        </div>
        
        <p class="verification-note">
          Once verified, your profile will be visible in the public gallery and searchable by other users.
        </p>
      </div>
      
      <button @click="$emit('edit-profile')" class="submit edit-profile-btn">
        <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
        </svg>
        Continue Editing Profile
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "VerificationPopup",
  emits: ['close', 'edit-profile'],
  setup() {
    return {};
  },
};
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

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 400px;
  padding: 25px;
  border-radius: 20px;
  position: relative;
  background-color: #1a1a1a;
  color: #fff;
  border: 1px solid #333;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
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

.notice-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notice-icon {
  display: flex;
  justify-content: center;
  color: #6567BE;
  margin-bottom: 5px;
}

.notice-features h3 {
  color: #6567BE;
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 600;
}

.notice-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notice-features li {
  padding: 6px 0;
  padding-left: 20px;
  position: relative;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.notice-features li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #6567BE;
  font-weight: bold;
}

.verification-note {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-style: italic;
  margin-top: 10px;
}

.submit {
  border: none;
  outline: none;
  padding: 12px 20px;
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  background-color: #6567BE;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit:hover {
  background-color: rgba(101, 103, 190, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(101, 103, 190, 0.3);
}

.close-button {
  position: absolute;
  top: 15px;
  right: 20px;
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
</style>