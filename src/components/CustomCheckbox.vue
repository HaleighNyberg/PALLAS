<template>
  <label class="checkBox" @click.stop>
    <input
      type="checkbox"
      :checked="isChecked"
      @change="toggle"
      @click.stop
      :aria-checked="isChecked"
    />
    <div class="transition" @click.stop></div>
    <span @click.stop><slot></slot></span>
  </label>
</template>

<script>
export default {
  name: "CustomCheckbox",
  props: {
    modelValue: { type: Array, default: () => [] },
    value: { type: String, required: true },
  },
  computed: {
    isChecked() { return this.modelValue.includes(this.value); },
  },
  methods: {
    toggle(event) {
      event.stopPropagation();
      const checked = event.target.checked;
      let updated = [...this.modelValue];

      if (checked) {
        if (!updated.includes(this.value)) updated.push(this.value);
      } else {
        updated = updated.filter((item) => item !== this.value);
      }

      this.$emit("update:modelValue", updated);
      this.$emit("change", updated);
    },
  },
};
</script>

<style scoped>
 


.checkBox {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  width: fit-content;
  user-select: none;
}


.checkBox input[type="checkbox"] {
  position: absolute;
  left: -9999px;
  visibility: hidden;
}


.checkBox .transition {
  width: 20px; 
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0); 
  border-radius: 6px; 
  position: relative;
  overflow: hidden;
  box-shadow: 0px 0px 0px 1.5px var(--color-secondary); 
  transition: all 0.3s ease;
}


.checkBox .transition::before {
  content: "";
  position: absolute;
  width: 40px;
  height: 40px; 
  background-color: #ffffff;
  top: -35px; 
  left: -35px;
  transform: rotateZ(45deg);
  z-index: 1;
  transition: all 0.3s ease;
}


.checkBox input[type="checkbox"]:checked + .transition::before {
  left: -7px;
  top: -7px; 
}

.checkBox input[type="checkbox"]:checked + .transition {
  border-color: var(--color-secondary); 
  box-shadow: 0px 0px 0px 1px var(--color-secondary); ; 
}


.checkBox span {
  margin-left: 8px; 
  font-size: 0.9em; 
  color: #000000; 
  transition: color 0.3s ease;
}

.checkBox input[type="checkbox"]:checked + .transition + span {
  color: var(--color-secondary); ; 
}


.checkBox:hover .transition {
  border-color: var(--color-secondary); ;
}

.checkBox:hover .transition::before {
  background-color: #f0f0f0; 
}
</style>
