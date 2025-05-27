<template>
  <footer class="footer">
    <div class="footer-content">
      <p>&copy; {{ currentYear }} PALLAS. All rights reserved.</p>
      <div class="footer-links">
        <a href="#" class="footer-link" @click.prevent="openContactModal">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          Contact Us
        </a>
      </div>
    </div>
    <ContactModal />
  </footer>
</template>

<script>
import { openContactForm } from '../utils/eventBus';
import ContactModal from './ContactModal.vue';

export default {
  name: "FooterPage",
  components: {
    ContactModal
  },
  data() {
    return {
      userInfo: null,
      currentYear: new Date().getFullYear(),
    };
  },
  methods: {
    openContactModal() {
      openContactForm();
    },
  },
  created() {
    const userInfoData = localStorage.getItem("user-info");
    if (userInfoData) {
      this.userInfo = JSON.parse(userInfoData);
    }
  },
};
</script>

<style scoped>
.footer {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #47474777;
  color: #ffffff;
  z-index: 1000;
  box-sizing: border-box;
  font-size: 1.11dvh;
  padding: 0.9rem;
}

.footer-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-align: center;
}

.footer-content p {
  margin: -10px;
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: -10px;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff;
  text-decoration: underline;
  text-underline-offset: 3px;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.footer-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  text-decoration: underline;
}

.footer-link svg {
  flex-shrink: 0;
}

@media screen and (max-width: 768px) {
  .footer {
    padding: 0.8rem 0rem;
    font-size: 14px;
  }

  .footer-link {
    font-size: 14px;
    padding: 0.4rem 0.8rem;
  }
}
</style>