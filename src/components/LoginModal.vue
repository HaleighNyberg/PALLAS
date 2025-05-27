<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="form">
      <button class="close-button" @click="closeModal">&times;</button>
      <p class="title">{{ isPasswordRecovery ? 'Password Recovery' : 'Artist Login' }}</p>
      <p class="message">{{ isPasswordRecovery ? 'Enter your email address to reset your password.' : 'Please enter your credentials to access your PALLAS Art Profile.' }}</p>
      <form @submit.prevent="handleSubmit" class="flex flex-column">

        <label>
          <input
            :class="['input', { 'input-error': errors.email }]"
            type="email"
            name="email"
            v-model="email"
            @input="validateEmail"
            autocomplete="off"
            placeholder=""
            required
          />
          <span>Email</span>
        </label>

        <label v-if="!isPasswordRecovery" class="password-field">
          <input
            :class="['input', { 'input-error': errors.password }]"
            :type="showPassword ? 'text' : 'password'"
            name="password"
            v-model="password"
            @input="validatePassword"
            autocomplete="off"
            placeholder=""
            required
          />
          <span>Password</span>
          <button
            type="button"
            class="password-toggle"
            @click="showPassword = !showPassword"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
          >
            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
          </button>
        </label>

        <div v-if="errors.email" class="field-error">{{ errors.email }}</div>
        <div v-if="errors.password && !isPasswordRecovery" class="field-error">{{ errors.password }}</div>

        <p v-if="!isPasswordRecovery" class="forgot-password">
          <a @click="enterPasswordRecovery" style="cursor: pointer;">Forgot Password?</a>
        </p>

        <p v-if="isPasswordRecovery" class="back-to-login">
          <a @click="exitPasswordRecovery" style="cursor: pointer;">← Back to Login</a>
        </p>

        <button class="submit" type="submit" :disabled="!canSubmit" :class="{ 'submit-disabled': !canSubmit }">
          {{ getSubmitButtonText() }}
        </button>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

        <p v-if="!isPasswordRecovery" class="signin">
          Don't have an account?
          <a href="#" @click.prevent="switchToSignUp">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from "../firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { closeModal, openSignUpModal } from '@/composables/useAuthModal';

export default {
  name: "LoginModal",
  setup() {
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");
    const successMessage = ref("");
    const isLoading = ref(false);
    const isPasswordRecovery = ref(false);
    const showPassword = ref(false);
    const errors = ref({
      email: "",
      password: "",
    });
    const router = useRouter();

    const canSubmit = computed(() => {
      if (isPasswordRecovery.value) {
        return !isLoading.value &&
               email.value.trim() !== '' &&
               !errors.value.email;
      } else {
        return !isLoading.value &&
               email.value.trim() !== '' &&
               password.value !== '' &&
               !errors.value.email &&
               !errors.value.password;
      }
    });

    const validateEmail = () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim()) {
        errors.value.email = "Email is required.";
      } else if (!emailPattern.test(email.value)) {
        errors.value.email = "Please enter a valid email.";
      } else {
        errors.value.email = "";
      }
    };

    const validatePassword = () => {
      if (!password.value) {
        errors.value.password = "Password is required.";
      } else if (password.value.length < 6) {
        errors.value.password = "Password must be at least 6 characters.";
      } else {
        errors.value.password = "";
      }
    };

    const enterPasswordRecovery = () => {
      isPasswordRecovery.value = true;
      password.value = "";
      errors.value.password = "";
      errorMessage.value = "";
      successMessage.value = "";
    };

    const exitPasswordRecovery = () => {
      isPasswordRecovery.value = false;
      errorMessage.value = "";
      successMessage.value = "";
    };

    const resetPassword = async () => {
      validateEmail();

      if (errors.value.email) {
        errorMessage.value = "Please enter a valid email address.";
        return;
      }

      if (!email.value.trim()) {
        errorMessage.value = "Please enter your email address.";
        return;
      }

      isLoading.value = true;
      errorMessage.value = "";
      successMessage.value = "";

      try {
        await sendPasswordResetEmail(auth, email.value);
        successMessage.value = "If you have a PALLAS account, a password reset email has been sent. Please wait a few minutes and check your spam/junk folder before trying again.";
      } catch (error) {
        console.error("Password reset error:", error);
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage.value = "Invalid email address. Please enter a valid email.";
            break;
          case "auth/user-not-found":
            errorMessage.value = "If you have a PALLAS account, a password reset email has been sent. Please check your email.";
            break;
          case "auth/too-many-requests":
            errorMessage.value = "Too many attempts. Please try again later.";
            break;
          case "auth/network-request-failed":
            errorMessage.value = "Network error. Please check your connection and try again.";
            break;
          default:
            console.error("Password reset error:", error.code, error.message);
            errorMessage.value = "Failed to send reset email. Please try again.";
        }
      } finally {
        isLoading.value = false;
      }
    };

    const getSubmitButtonText = () => {
      if (isLoading.value) {
        return isPasswordRecovery.value ? 'Sending...' : 'Logging in...';
      }
      return isPasswordRecovery.value ? 'Send Reset Email' : 'Submit';
    };

    const handleSubmit = async () => {
      if (isPasswordRecovery.value) {
        await resetPassword();
      } else {
        await login();
      }
    };

    const login = async () => {
      validateEmail();
      if (!isPasswordRecovery.value) {
        validatePassword();
      }

      if (errors.value.email || (!isPasswordRecovery.value && errors.value.password)) {
        return;
      }

      isLoading.value = true;
      errorMessage.value = "";
      successMessage.value = "";

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );

        try {
          const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
          let userData;

          if (userDoc.exists()) {
            userData = userDoc.data();
            console.log("User data loaded from Firestore:", userData);
          } else {
            console.warn("User document not found in Firestore, creating fallback data");
            const firstName = userCredential.user.displayName?.split(' ')[0] || '';
            const lastName = userCredential.user.displayName?.split(' ')[1] || '';
            userData = {
              firstName: firstName,
              lastName: lastName,
              email: userCredential.user.email,
              role: "artist",
              verified: false,
              createdAt: serverTimestamp(),
              dashboard: {
                completedProjects: 0,
                currentProjects: 0,
                portfolio: []
              },
              profile: {
                artFocus: [],
                artMedium: [],
                bio: "",
                id: userCredential.user.uid,
                name: `${firstName} ${lastName}`.trim() || userCredential.user.email,
                profileBackgroundPosition: { x: 50, y: 50 },
                profileBackgroundURL: "",
                profileBackgroundZoom: 1,
                profilePicturePosition: { x: 50, y: 50 },
                profilePictureURL: "",
                profilePictureZoom: 1,
                mission: "",
                contactMethods: {
                  email: { enabled: true, value: userCredential.user.email },
                  phone: { enabled: false, value: "" },
                  instagram: { enabled: false, value: "" },
                  twitter: { enabled: false, value: "" },
                  tiktok: { enabled: false, value: "" },
                  linkedin: { enabled: false, value: "" },
                  facebook: { enabled: false, value: "" },
                  cara: { enabled: false, value: "" },
                  other: { enabled: false, value: "", label: "" }
                },
                preferredContactMethod: 'email',
                openToCommissions: false
              }
            };

            try {
              await setDoc(doc(db, "users", userCredential.user.uid), userData);
              console.log("Created missing Firestore document");
            } catch (firestoreError) {
              console.error("Failed to create Firestore document:", firestoreError);
            }
          }

          localStorage.setItem(
            "user-info",
            JSON.stringify({
              uid: userCredential.user.uid,
              email: userData.email,
              role: userData.role,
              verified: userData.verified,
              firstName: userData.firstName,
              lastName: userData.lastName,
            })
          );

          successMessage.value = "Login successful! Redirecting...";

          setTimeout(() => {
            closeModal();
            if (userData.role === "admin") {
              router.push({ name: "AdminDashboard" });
            } else if (userData.role === "artist") {
              router.push({
                name: "ProfileNew",
                params: { uuid: userCredential.user.uid },
              });
            } else {
              console.warn("Unknown role, redirecting to HomePage.");
              router.push({ name: "HomePage" });
            }
          }, 1500);
        } catch (firestoreError) {
          console.error("Firestore error during login:", firestoreError);
          errorMessage.value = "Login failed: Unable to load user data. Please try again.";
        }
      } catch (error) {
        console.error("Login error:", error);
        errorMessage.value = mapErrorMessage(error);
      } finally {
        isLoading.value = false;
      }
    };

    const mapErrorMessage = (error) => {
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          return "Invalid email or password. Please check your credentials.";
        case "auth/invalid-email":
          return "Invalid email address format.";
        case "auth/user-disabled":
          return "This account has been disabled. Please contact support.";
        case "auth/too-many-requests":
          return "Too many failed attempts. Please try again later.";
        case "auth/network-request-failed":
          return "Network error. Please check your connection and try again.";
        case "auth/operation-not-allowed":
          return "Email/password authentication is not enabled.";
        default:
          console.error("Unhandled auth error:", error.code, error.message);
          return "An unexpected error occurred. Please try again.";
      }
    };

    const switchToSignUp = () => {
      closeModal();
      openSignUpModal();
    };

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEsc);

    onUnmounted(() => {
      window.removeEventListener('keydown', handleEsc);
    });

    return {
      email,
      password,
      errorMessage,
      successMessage,
      isLoading,
      isPasswordRecovery,
      showPassword,
      errors,
      canSubmit,
      switchToSignUp,
      closeModal,
      validateEmail,
      validatePassword,
      enterPasswordRecovery,
      exitPasswordRecovery,
      getSubmitButtonText,
      handleSubmit,
    };
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
  gap: 10px;
  max-width: 350px;
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

.forgot-password {
  margin-top: -5px;
  margin-bottom: 10px;
  text-align: right;
  font-size: 14px;
}

.forgot-password a {
  color: #6567BE;
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.back-to-login {
  margin-top: -5px;
  margin-bottom: 10px;
  text-align: left;
  font-size: 14px;
}

.back-to-login a {
  color: #6567BE;
  text-decoration: none;
}

.back-to-login a:hover {
  text-decoration: underline;
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