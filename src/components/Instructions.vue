<template>
  <div class="instructions" :class="$attrs.class">
    <span>🖱️ 滾動滑鼠滾輪切換行星</span>
    <span>|</span>
    <span>👆 點擊行星查看詳情</span>
    <span>|</span>
    <span>✌️ 雙擊星球進入/退出放大觀察模式</span>
    <span>|</span>
    <span>🔄 拖動畫面旋轉視角</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Instructions',
  inheritAttrs: false
});
</script>

<style scoped>
.instructions {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  padding: 10px 20px;
  border-radius: 30px;
  z-index: 5;
  display: flex;
  align-items: center;
  transition: opacity 0.5s;
}

.instructions:hover {
  opacity: 1 !important;
}

.instructions span {
  margin: 0 10px;
}
</style>
