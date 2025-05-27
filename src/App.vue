<template>
  <div class="background-wrapper">
    <HeaderPage />
    <div class="content-container">
      <router-view :key="$route.fullPath" />
    </div>
    <FooterPage />

    <LoginModal
      v-if="currentModal === 'login'"
      @switch-to-signup="openSignUpModal"
      @close="closeModal"
    />
    <SignUpModal
      v-if="currentModal === 'signup'"
      @switch-to-login="openLoginModal"
      @close="closeModal"
    />
  </div>
</template>

<script>
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import HeaderPage from '@/components/HeaderPage.vue';
import FooterPage from '@/components/FooterPage.vue';
import LoginModal from '@/components/LoginModal.vue';
import SignUpModal from '@/components/SignUpModal.vue';
import {
  currentModal,
  openLoginModal,
  openSignUpModal,
  closeModal,
} from '@/composables/useAuthModal';

export default {
  name: 'App',
  components: {
    HeaderPage,
    FooterPage,
    LoginModal,
    SignUpModal,
  },
  setup() {
    const route = useRoute();

    watch(
      () => route.fullPath,
      () => {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    );

    return {
      currentModal,
      openLoginModal,
      openSignUpModal,
      closeModal,
    };
  },
};
</script>

<style>
@import '@/assets/web/inter.css';

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

ul,
ol {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
}

:root {
  --color-primary: #23001E;
  --color-primary-hover: #6567BE;
  --color-secondary: #6567BE;
  --color-secondary-hover: #23001E;
  
  --color-HbuttonBG: #6567BE;
  --color-HbuttonOUT: #000000;
  --color-HbuttonSDW: #00000080;

  --color-header: #000000;

  --color-success: #FFA56D;
  --color-success-hover: #FFA56D;
  --color-danger: var(--color-text);
  --color-danger-hover: var(--color-text);
  --color-warning: #ffc107;
  --color-warning-hover: #e0a800;
  --color-info: #28282d;
  --color-info-hover: #28282d;

  --color-text: #000000;
  --color-text-sdw: 2px 2px 6px rgba(0, 0, 0, 0.3);

  --color-input-border: #d1d5db;
  --color-input-focus: #FFA56D;
  --color-error: var(--color-text);
  --color-success-message: green;

  --font-primary: 'InterDisplay', sans-serif;
  --font-weight-bold: 600;
  --letter-spacing: 0.1em;

  --font-size-base: 17px;
  --font-size-lg: 1.2em;
  --font-size-sm: 18px;
  --spacing-xs: 5px;
  --spacing-sm: 10px;
  --spacing-md: 20px;
  --spacing-lg: 30px;
  --border-radius: 5px;
  --border-radius-lg: 10px;
  --navbar-height: 60px;
}

body {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-bold);
  letter-spacing: var(--letter-spacing);
  font-size: var(--font-size-base);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: none;
  color: var(--color-text);
  line-height: 1.6;
}

.background-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  --color: #D1D2E6;
  background-color: #F3F3F3;
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      var(--color) 25%,
      var(--color) 26%,
      transparent 27%,
      transparent 74%,
      var(--color) 75%,
      var(--color) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      var(--color) 25%,
      var(--color) 26%,
      transparent 27%,
      transparent 74%,
      var(--color) 75%,
      var(--color) 76%,
      transparent 77%,
      transparent
    );
  background-size: 55px 55px;
  overflow-x: hidden;
  overflow-y: hidden;
}

.content-container {
  flex: 1;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  padding: var(--spacing-md);
  overflow-y: auto;
}

.footer {
  margin-top: auto;
}
</style>