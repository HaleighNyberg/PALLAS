<template>
  <transition name="modal">
    <div v-if="showContactModal" class="modal-overlay" @click.self="closeContactModal">
      <div class="form">
        <button @click="closeContactModal" class="close-button">&times;</button>
        <p class="title">Contact Us</p>
        <p class="message">Have questions, suggestions, or want to collaborate? We'd love to hear from you!</p>
        
        <form @submit.prevent="submitContactForm" class="flex flex-column">
          <label>
            <input
              class="input"
              type="text"
              v-model="contactForm.name"
              placeholder=""
            />
            <span>Name</span>
          </label>
          
          <label>
            <input
              class="input"
              type="email"
              v-model="contactForm.email"
              placeholder=""
            />
            <span>Email</span>
          </label>
          
          <label>
            <input
              class="input"
              type="text"
              v-model="contactForm.subject"
              placeholder=""
            />
            <span>Subject</span>
          </label>
          
          <label>
            <textarea
              class="input textarea"
              v-model="contactForm.message"
              placeholder=""
              rows="4"
              required
            ></textarea>
            <span>Message</span>
          </label>
          
          <button class="submit" type="submit" :disabled="isSubmitting || !isFormValid">
            {{ isSubmitting ? 'Sending...' : 'Send Message' }}
          </button>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, computed } from "vue";
import { showContactModal, closeContactForm } from '../utils/eventBus';
import emailjs from '@emailjs/browser';

export default {
  name: "ContactModal",
  setup() {
    const contactForm = ref({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    const isSubmitting = ref(false);
    
    const isFormValid = computed(() => {
      return contactForm.value.message.trim();
    });
    
    const submitContactForm = async () => {
      try {
        isSubmitting.value = true;

        const templateParams = {
          title: contactForm.value.subject,
          name: contactForm.value.name,
          time: new Date().toLocaleString(),
          message: contactForm.value.message,
          email: contactForm.value.email
        };

        await emailjs.send(
          'service_1gwh18f',     
          'template_jorfw1u',    
          templateParams,
          '1L-SCqyOyFX3WYZaa'      
        );

        contactForm.value = {
          title: '',
          name: '',
          time: '',
          message: '',
          email: ''
        };

        closeContactModal();
        alert('Thank you for contacting us! We\'ll get back to you soon.');

      } catch (error) {
        console.error('Email send failed:', error);
        alert('Sorry, there was an error sending your message. Please try again.');
      } finally {
        isSubmitting.value = false;
      }
    };

    
    const closeContactModal = () => {
      closeContactForm();
    };
    
    return {
      contactForm,
      isSubmitting,
      showContactModal,
      isFormValid,
      submitContactForm,
      closeContactModal
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

.message {
  font-size: 14.5px;
  color: rgba(255, 255, 255, 0.7);
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
  font-size: 1.1em;
}

.form label .input:focus + span,
.form label .input:valid + span {
  color: #6567BE;
  top: 0px;
  font-size: 0.7em;
  font-weight: 600;
}

.input {
  font-size: 16px;
}

.textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
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

.submit:disabled {
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

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .form,
.modal-leave-active .form {
  transition: all 0.3s ease;
}

.modal-enter-from .form {
  transform: scale(0.9);
}

.modal-leave-to .form {
  transform: scale(0.9);
}
</style>