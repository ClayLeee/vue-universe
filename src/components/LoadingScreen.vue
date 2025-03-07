<template>
  <div class="loading-screen" :class="{ 'fade-out': !isLoading }">
    <div class="spinner"></div>
    <div class="loading-text">載入宇宙中...</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoadingScreen',
  props: {
    isLoading: {
      type: Boolean,
      required: true
    }
  }
});
</script>

<style scoped>
.loading-screen {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  transition: opacity 1s ease;
}

.loading-screen.fade-out {
  opacity: 0;
  pointer-events: none;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #ff9f43;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 20px;
  letter-spacing: 2px;
}
</style>
