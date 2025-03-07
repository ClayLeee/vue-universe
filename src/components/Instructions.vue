<template>
  <div class="instructions-container" :class="$attrs.class">
    <div class="instructions">
      <div class="instruction-item">
        <div class="icon" title="滾動滑鼠滾輪切換行星">🖱️</div>
        <div class="text">滾輪切換</div>
      </div>
      <div class="separator"></div>
      <div class="instruction-item">
        <div class="icon" title="點擊行星查看詳情">👆</div>
        <div class="text">點擊查看</div>
      </div>
      <div class="separator"></div>
      <div class="instruction-item">
        <div class="icon" title="雙擊行星進入/退出放大模式">✌️</div>
        <div class="text">雙擊放大</div>
      </div>
      <div class="separator"></div>
      <div class="instruction-item">
        <div class="icon" title="拖動畫面旋轉視角">🔄</div>
        <div class="text">拖動旋轉</div>
      </div>
      <div class="scanning-line"></div>
      <div class="corner top-left"></div>
      <div class="corner top-right"></div>
      <div class="corner bottom-left"></div>
      <div class="corner bottom-right"></div>
    </div>
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
.instructions-container {
  position: fixed;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  max-width: 90vw;
  transition: all 0.5s ease;
  opacity: 0.7; /* 初始時更透明 */
}

.instructions-container:hover {
  opacity: 1;
  transform: translateX(-50%) scale(1.02); /* 懸停時稍微放大 */
}

.instructions {
  position: relative;
  background: rgba(0, 10, 20, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 195, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 195, 255, 0.2), inset 0 0 10px rgba(0, 195, 255, 0.1);
  padding: 8px 15px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  overflow: hidden;
  transition: all 0.3s ease;
}

.instruction-item {
  display: flex;
  align-items: center;
  margin: 3px 0;
  animation: fadeIn 0.5s ease-out;
  transition: all 0.3s ease;
}

.icon {
  font-size: 1.1em;
  margin-right: 5px;
  color: rgba(0, 195, 255, 1);
  text-shadow: 0 0 5px rgba(0, 195, 255, 0.8);
  transition: all 0.3s ease;
  cursor: help;
}

.text {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.85em;
  letter-spacing: 0.5px;
  text-shadow: 0 0 10px rgba(0, 195, 255, 0.5);
  white-space: nowrap;
  transition: all 0.3s ease;
}

.separator {
  width: 1px;
  height: 15px;
  background: linear-gradient(to bottom, transparent, rgba(0, 195, 255, 0.8), transparent);
  margin: 0 8px;
  transition: all 0.3s ease;
}

.instructions:hover {
  background: rgba(0, 15, 30, 0.85);
  border-color: rgba(0, 195, 255, 0.8);
  box-shadow: 0 0 25px rgba(0, 195, 255, 0.4), inset 0 0 20px rgba(0, 195, 255, 0.2);
}

.instructions:hover .icon {
  color: rgba(50, 220, 255, 1);
  text-shadow: 0 0 8px rgba(50, 220, 255, 1);
  transform: scale(1.1);
}

.instructions:hover .text {
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 0 15px rgba(50, 220, 255, 0.8);
}

.instructions:hover .separator {
  background: linear-gradient(to bottom, transparent, rgba(50, 220, 255, 1), transparent);
  height: 18px;
}

.instructions:hover .scanning-line {
  opacity: 1;
  height: 3px;
  background: linear-gradient(to right, transparent, rgba(50, 220, 255, 1), transparent);
  animation: scan 1.5s linear infinite;
}

.instructions:hover .corner {
  border-color: rgba(50, 220, 255, 1);
  width: 12px;
  height: 12px;
  box-shadow: 0 0 5px rgba(50, 220, 255, 0.8);
}

.scanning-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, transparent, rgba(0, 195, 255, 0.8), transparent);
  opacity: 0.5;
  animation: scan 2s linear infinite;
  transition: all 0.3s ease;
}

.corner {
  position: absolute;
  width: 8px;
  height: 8px;
  border-color: rgba(0, 195, 255, 0.8);
  border-style: solid;
  border-width: 0;
  transition: all 0.3s ease;
}

.top-left {
  top: 0;
  left: 0;
  border-top-width: 2px;
  border-left-width: 2px;
}

.top-right {
  top: 0;
  right: 0;
  border-top-width: 2px;
  border-right-width: 2px;
}

.bottom-left {
  bottom: 0;
  left: 0;
  border-bottom-width: 2px;
  border-left-width: 2px;
}

.bottom-right {
  bottom: 0;
  right: 0;
  border-bottom-width: 2px;
  border-right-width: 2px;
}

@keyframes scan {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .instructions {
    padding: 6px 10px;
  }

  .instruction-item {
    margin: 2px 0;
  }

  .icon {
    font-size: 0.9em;
  }

  .text {
    font-size: 0.75em;
  }

  .separator {
    height: 12px;
    margin: 0 6px;
  }
}
</style>
