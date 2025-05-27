<template>
  <div class="reset-password-container">
    <div class="form">
      <p class="title">Reset Password</p>
      <p class="message">Enter your new password below</p>
      
      <form @submit.prevent="resetPassword" class="flex flex-column">
        <div class="email-display">
          <label class="email-label">Email:</label>
          <span class="email-value">{{ email }}</span>
        </div>

        <label class="password-field">
          <input
            :class="['input', { 'input-error': errors.newPassword }]"
            :type="showNewPassword ? 'text' : 'password'"
            name="newPassword"
            v-model="newPassword"
            @input="validateNewPassword"
            autocomplete="off"
            placeholder=""
            required
          />
          <span>New Password</span>
          <button
            type="button"
            class="password-toggle"
            @click="showNewPassword = !showNewPassword"
            :aria-label="showNewPassword ? 'Hide password' : 'Show password'"
          >
            <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
          </button>
        </label>

        <label class="password-field">
          <input
            :class="['input', { 'input-error': errors.confirmNewPassword }]"
            :type="showConfirmNewPassword ? 'text' : 'password'"
            name="confirmNewPassword"
            v-model="confirmNewPassword"
            @input="validateConfirmNewPassword"
            autocomplete="off"
            placeholder=""
            required
          />
          <span>Confirm New Password</span>
          <button
            type="button"
            class="password-toggle"
            @click="showConfirmNewPassword = !showConfirmNewPassword"
            :aria-label="showConfirmNewPassword ? 'Hide password' : 'Show password'"
          >
            <svg v-if="showConfirmNewPassword" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
          </button>
        </label>

        <div v-if="errors.newPassword" class="field-error">{{ errors.newPassword }}</div>
        <div v-if="errors.confirmNewPassword" class="field-error">{{ errors.confirmNewPassword }}</div>

        <button class="submit" type="submit" :disabled="!canSubmit" :class="{ 'submit-disabled': !canSubmit }">
          {{ isSubmitting ? 'Resetting...' : 'Reset Password' }}
        </button>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

        <p class="signin">
          Remember your password?
          <a href="#" @click.prevent="goToLogin">
            Login
          </a>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { auth } from "../firebase";
import { confirmPasswordReset } from "firebase/auth";

export default {
  name: "ResetPassword",
  setup() {
    const router = useRouter();
    const route = useRoute();
    
    const email = ref("");
    const newPassword = ref("");
    const confirmNewPassword = ref("");
    const errorMessage = ref("");
    const successMessage = ref("");
    const isSubmitting = ref(false);
    const showNewPassword = ref(false);
    const showConfirmNewPassword = ref(false);
    
    const errors = ref({
      newPassword: "",
      confirmNewPassword: "",
    });

    const oobCode = ref("");

    const canSubmit = computed(() => {
      return !isSubmitting.value && 
             newPassword.value !== '' && 
             confirmNewPassword.value !== '' &&
             !errors.value.newPassword &&
             !errors.value.confirmNewPassword &&
             oobCode.value !== '';
    });

    onMounted(() => {
      email.value = route.query.email || "";
      oobCode.value = route.query.oobCode || "";
      
      if (!oobCode.value) {
        errorMessage.value = "Invalid reset link. Please request a new password reset.";
      }
    });

    const validateNewPassword = () => {
      if (newPassword.value.length < 6) {
        errors.value.newPassword = "Password must be at least 6 characters.";
      } else if (!/[!@#$%^&*]/.test(newPassword.value)) {
        errors.value.newPassword = "Password must include at least one special character.";
      } else {
        errors.value.newPassword = "";
      }
    };

    const validateConfirmNewPassword = () => {
      if (!confirmNewPassword.value) {
        errors.value.confirmNewPassword = "Please confirm your password.";
      } else if (confirmNewPassword.value !== newPassword.value) {
        errors.value.confirmNewPassword = "Passwords do not match.";
      } else {
        errors.value.confirmNewPassword = "";
      }
    };

    const resetPassword = async () => {
      validateNewPassword();
      validateConfirmNewPassword();

      if (errors.value.newPassword || errors.value.confirmNewPassword) {
        return;
      }

      if (!oobCode.value) {
        errorMessage.value = "Invalid reset link. Please request a new password reset.";
        return;
      }

      isSubmitting.value = true;
      errorMessage.value = "";
      successMessage.value = "";

      try {
        await confirmPasswordReset(auth, oobCode.value, newPassword.value);
        successMessage.value = "Password reset successfully! Redirecting to login...";
        
        setTimeout(() => {
          router.push({ name: "HomePage" }); // Or "LoginPage" if you have one
        }, 2000);
      } catch (error) {
        switch (error.code) {
          case "auth/invalid-action-code":
          case "auth/expired-action-code":
            errorMessage.value = "Invalid or expired reset link. Please request a new password reset.";
            break;
          case "auth/weak-password":
            errorMessage.value = "Password is too weak. Please choose a stronger password with at least 6 characters and special characters.";
            break;
          case "auth/network-request-failed":
            errorMessage.value = "Network error. Please check your connection and try again.";
            break;
          case "auth/too-many-requests":
            errorMessage.value = "Too many attempts. Please try again later.";
            break;
          default:
            errorMessage.value = "Failed to reset password. Please try again.";
        }
      } finally {
        isSubmitting.value = false;
      }
    };

    const goToLogin = () => {
      router.push({ name: "HomePage" }); // Or "LoginPage"
    };

    return {
      email,
      newPassword,
      confirmNewPassword,
      errorMessage,
      successMessage,
      isSubmitting,
      showNewPassword,
      showConfirmNewPassword,
      errors,
      canSubmit,
      resetPassword,
      goToLogin,
      validateNewPassword,
      validateConfirmNewPassword,
    };
  },
};
</script>

<style scoped>
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0a0a0a;
  padding: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 350px;
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  position: relative;
  background-color: #1a1a1a;
  color: #fff;
  border: 1px solid #333;
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
}

.title::before {
  width: 18px;
  height: 18px;
}

.title::after {
  width: 18px;
  height: 18px;
  animation: pulse 1s linear infinite;
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

.message, 
.signin {
  font-size: 14.5px;
  color: rgba(255, 255, 255, 0.7);
}

.signin {
  text-align: center;
}

.signin a:hover {
  text-decoration: underline royalblue;
}

.signin a {
  color: #6567BE;
}

.flex {
  display: flex;
  width: 100%;
  gap: 6px;
}

.flex-column {
  flex-direction: column;
}

.email-display {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background-color: rgba(101, 103, 190, 0.1);
  border-radius: 10px;
  margin-bottom: 10px;
  border: 1px solid rgba(101, 103, 190, 0.3);
}

.email-label {
  color: #6567BE;
  font-weight: 600;
  font-size: 14px;
}

.email-value {
  color: #ffffff;
  font-weight: 400;
  font-size: 14px;
}

.form label {
  position: relative;
}

.form label .input {
  background-color: #333;
  color: #fff;
  width: 100%;
  padding: 20px 05px 05px 10px;
  outline: 0;
  border: 1px solid rgba(105, 105, 105, 0.397);
  border-radius: 10px;
}

.form label .input + span {
  color: rgba(255, 255, 255, 0.5);
  position: absolute;
  left: 10px;
  top: 0px;
  font-size: 0.9em;
  cursor: text;
  transition: 0.3s ease;
}

.form label .input:placeholder-shown + span {
  top: 12.5px;
  font-size: 0.9em;
}

.form label .input:focus + span,
.form label .input:valid + span {
  color: #6567BE;
  top: 0px;
  font-size: 0.7em;
  font-weight: 600;
}

.input {
  font-size: medium;
}

.input-error {
  border: 1px solid #e74c3c !important;
}

.input-error + span {
  color: #e74c3c !important;
}

.submit {
  border: none;
  outline: none;
  padding: 10px;
  border-radius: 10px;
  color: #fff;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: #6567BE;
  cursor: pointer;
  margin-top: 10px;
}

.submit:hover:not(:disabled) {
  background-color: rgba(101, 103, 190, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(101, 103, 190, 0.3);
}

.submit:disabled,
.submit-disabled {
  background-color: rgba(150, 150, 150, 0.3) !important;
  color: rgba(255, 255, 255, 0.5) !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}

.password-field {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: #6567BE;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
}

.field-error {
  color: #e74c3c;
  font-size: 12px;
  margin-top: -5px;
  margin-bottom: 5px;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}

.success-message {
  color: #6567BE;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
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