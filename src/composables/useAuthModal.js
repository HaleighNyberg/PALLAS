import { ref } from 'vue';

export const currentModal = ref(null); 

export function openLoginModal() {
  currentModal.value = 'login';
}

export function openSignUpModal() {
  currentModal.value = 'signup';
}

export function closeModal() {
  currentModal.value = null;
}
