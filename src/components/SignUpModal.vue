<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="form">
      <button class="close-button" @click="closeModal">&times;</button>
      <p class="title">Artist Sign Up</p>
      <p class="message">Create a PALLAS Art Profile to be featured in our database.</p>
      <form @submit.prevent="signUp" class="flex flex-column">
        <div class="flex">
          <label>
            <input
              :class="['input', { 'input-error': errors.firstName }]"
              type="text"
              v-model="firstName"
              @input="validateFirstName"
              placeholder=""
              required
            />
            <span>First Name</span>
          </label>
          <label>
            <input
              :class="['input', { 'input-error': errors.lastName }]"
              type="text"
              v-model="lastName"
              @input="validateLastName"
              placeholder=""
              required
            />
            <span>Last Name</span>
          </label>
        </div>

        <label>
          <input
            :class="['input', { 'input-error': errors.email }]"
            type="email"
            v-model="email"
            @input="validateEmail"
            placeholder=""
            required
          />
          <span>Email</span>
        </label>

        <label class="password-field">
          <input
            :class="['input', { 'input-error': errors.password }]"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            @input="validatePassword"
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

        <label class="password-field">
          <input
            :class="['input', { 'input-error': errors.confirmPassword }]"
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            @input="validateConfirmPassword"
            placeholder=""
            required
          />
          <span>Confirm Password</span>
          <button
            type="button"
            class="password-toggle"
            @click="showConfirmPassword = !showConfirmPassword"
            :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
          >
            <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off-icon lucide-eye-off"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>
          </button>
        </label>

        <div v-if="errors.firstName" class="field-error">{{ errors.firstName }}</div>
        <div v-if="errors.lastName" class="field-error">{{ errors.lastName }}</div>
        <div v-if="errors.email" class="field-error">{{ errors.email }}</div>
        <div v-if="errors.password" class="field-error">{{ errors.password }}</div>
        <div v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</div>

        <div class="terms-container">
          <input
            type="checkbox"
            id="terms-checkbox"
            v-model="acceptedTerms"
            :class="{ 'checkbox-error': errors.terms }"
          />
          <label for="terms-checkbox" class="terms-label">
            I have read and agree with the
            <a href="#" @click.prevent="showTerms" class="terms-link">terms and conditions</a>
            of PALLAS
          </label>
        </div>
        <div v-if="errors.terms" class="field-error">{{ errors.terms }}</div>

        <button class="submit" type="submit" :disabled="!canSubmit" :class="{ 'submit-disabled': !canSubmit }">
          {{ isSubmitting ? 'Signing Up...' : 'Submit' }}
        </button>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

        <p class="signin">
          Already have an account?
          <a href="#" @click.prevent="switchToLogin">
            Login
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
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from "../firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { closeModal, openLoginModal } from '@/composables/useAuthModal';

export default {
  name: "SignUpModal",
  setup() {
    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");
    const successMessage = ref("");
    const isSubmitting = ref(false);
    const acceptedTerms = ref(false);
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const confirmPassword = ref("");

    const errors = ref({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: "",
    });

    const router = useRouter();

    const canSubmit = computed(() => {
      return !isSubmitting.value &&
             acceptedTerms.value &&
             firstName.value.trim() !== '' &&
             lastName.value.trim() !== '' &&
             email.value.trim() !== '' &&
             password.value !== '' &&
             confirmPassword.value !== '' &&
             !errors.value.firstName &&
             !errors.value.lastName &&
             !errors.value.email &&
             !errors.value.password &&
             !errors.value.confirmPassword &&
             !errors.value.terms;
    });

    const validateFirstName = () => {
      if (!firstName.value.trim()) {
        errors.value.firstName = "First name is required.";
      } else {
        errors.value.firstName = "";
      }
    };

    const validateLastName = () => {
      if (!lastName.value.trim()) {
        errors.value.lastName = "Last name is required.";
      } else {
        errors.value.lastName = "";
      }
    };

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
      if (password.value.length < 6) {
        errors.value.password = "Password must be at least 6 characters.";
      } else if (!/[!@#$%^&*]/.test(password.value)) {
        errors.value.password = "Password must include at least one special character.";
      } else {
        errors.value.password = "";
      }
      if (confirmPassword.value) {
        validateConfirmPassword();
      }
    };

    const validateConfirmPassword = () => {
      if (!confirmPassword.value) {
        errors.value.confirmPassword = "Please confirm your password.";
      } else if (confirmPassword.value !== password.value) {
        errors.value.confirmPassword = "Passwords do not match.";
      } else {
        errors.value.confirmPassword = "";
      }
    };

    const validateTerms = () => {
      if (!acceptedTerms.value) {
        errors.value.terms = "You must accept the terms and conditions.";
      } else {
        errors.value.terms = "";
      }
    };

    const showTerms = () => {

    };

    const signUp = async () => {
      validateFirstName();
      validateLastName();
      validateEmail();
      validatePassword();
      validateConfirmPassword();
      validateTerms();

      if (
        errors.value.firstName ||
        errors.value.lastName ||
        errors.value.email ||
        errors.value.password ||
        errors.value.confirmPassword ||
        errors.value.terms
      ) {
        return;
      }

      isSubmitting.value = true;
      errorMessage.value = "";
      successMessage.value = "";

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );

        await updateProfile(userCredential.user, {
          displayName: `${firstName.value} ${lastName.value}`,
        });
        await userCredential.user.reload();
        

        await userCredential.user.getIdToken(true);
        
        const userData = {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
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
            name: `${firstName.value} ${lastName.value}`,
            profileBackgroundPosition: { x: 50, y: 50 },
            profileBackgroundURL: "",
            profileBackgroundZoom: 1,
            profilePicturePosition: { x: 50, y: 50 },
            profilePictureURL: "",
            profilePictureZoom: 1,
            mission: "",
            contactMethods: {
              email: { enabled: true, value: email.value },
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
          console.log("Attempting to write user data to Firestore");
          console.log("User UID:", userCredential.user.uid);
          console.log("User data being written:", userData);
          

          let retryCount = 0;
          const maxRetries = 3;
          let writeSuccess = false;
          
          while (retryCount < maxRetries && !writeSuccess) {
            try {

              await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, retryCount)));
              
              console.log(`Attempt ${retryCount + 1} to write user data...`);
              await setDoc(doc(db, "users", userCredential.user.uid), userData);
              console.log("User data successfully saved to Firestore");
              

              const verifyDoc = await getDoc(doc(db, "users", userCredential.user.uid));
              console.log("Verification read:", verifyDoc.exists() ? "Document exists" : "Document NOT found");
              
              if (verifyDoc.exists()) {
                writeSuccess = true;
              } else {
                throw new Error("Document verification failed");
              }
            } catch (retryError) {
              retryCount++;
              console.error(`Write attempt ${retryCount} failed:`, retryError);
              if (retryCount >= maxRetries) {
                throw retryError;
              }

              await userCredential.user.reload();
              await userCredential.user.getIdToken(true);
            }
          }
          
          const userInfo = {
            uid: userCredential.user.uid,
            email: email.value,
            role: "artist",
            firstName: firstName.value,
            lastName: lastName.value,
            verified: false,
          };
          
          localStorage.setItem("user-info", JSON.stringify(userInfo));
          successMessage.value = "Sign-up successful! Redirecting...";
          
          setTimeout(() => {
            closeModal();
            router.push({
              name: "ProfileNew",
              params: { uuid: userCredential.user.uid },
            });
          }, 2000);
        } catch (firestoreError) {
          console.error("Error writing to Firestore:", firestoreError);
          console.error("Error details:", {
            code: firestoreError.code,
            message: firestoreError.message,
            stack: firestoreError.stack
          });
          errorMessage.value = `Account created but profile data could not be saved: ${firestoreError.message || 'Unknown error'}`;

          setTimeout(() => {
            closeModal();
            router.push({
              name: "ProfileNew",
              params: { uuid: userCredential.user.uid },
            });
          }, 3000);
        }
      } catch (error) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage.value = "This email is already in use. Please try logging in instead or use a different email address.";
            break;
          case "auth/weak-password":
            errorMessage.value = "Password is too weak. Please choose a stronger password with at least 6 characters and special characters.";
            break;
          case "auth/invalid-email":
            errorMessage.value = "Invalid email address. Please check your email format.";
            break;
          case "auth/network-request-failed":
            errorMessage.value = "Network error. Please check your internet connection and try again.";
            break;
          case "auth/operation-not-allowed":
            errorMessage.value = "Email/password authentication is not enabled. Please contact support.";
            break;
          case "auth/too-many-requests":
            errorMessage.value = "Too many attempts. Please try again later.";
            break;
          default:
            errorMessage.value = "An error occurred during sign-up. Please try again.";
        }
      } finally {
        isSubmitting.value = false;
      }
    };

    const switchToLogin = () => {
      closeModal();
      openLoginModal();
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
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      errorMessage,
      successMessage,
      isSubmitting,
      acceptedTerms,
      showPassword,
      showConfirmPassword,
      errors,
      canSubmit,
      signUp,
      switchToLogin,
      closeModal,
      validateFirstName,
      validateLastName,
      validateEmail,
      validatePassword,
      validateConfirmPassword,
      validateTerms,
      showTerms,
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

.terms-container {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 15px 0 5px 0;
}

#terms-checkbox {
  margin-top: 4px;
  width: 18px;
  height: 18px;
  accent-color: #6567BE;
  cursor: pointer;
}

#terms-checkbox.checkbox-error {
  outline: 2px solid #e74c3c;
  outline-offset: 2px;
}

.terms-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.4;
  cursor: pointer;
  flex: 1;
}

.terms-link {
  color: #6567BE;
  text-decoration: underline;
}

.terms-link:hover {
  color: #5856a8;
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