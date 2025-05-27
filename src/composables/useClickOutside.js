import { onMounted, onUnmounted } from 'vue';

export default function useClickOutside(elRef, cb) {
  const onClick = (e) => {
    if (elRef.value && !elRef.value.contains(e.target)) {
      cb();
    }
  };

  onMounted(() => document.addEventListener('click', onClick));
  onUnmounted(() => document.removeEventListener('click', onClick));
}
