import { ref } from 'vue'
export const showContactModal = ref(false)

export const openContactForm = () => {
  showContactModal.value = true
}

export const closeContactForm = () => {
  showContactModal.value = false
}