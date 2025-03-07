<template>
  <div class="planet-info-panel" :class="{
    active: isActive,
    'animate-in': animationActive
  }" @wheel="handleWheel">
    <div class="panel-overlay"></div>
    <div class="panel-grid"></div>

    <!-- 裝飾性邊角 -->
    <div class="panel-decorator top-left"><div class="corner-light"></div></div>
    <div class="panel-decorator top-right"><div class="corner-light"></div></div>
    <div class="panel-decorator bottom-left"><div class="corner-light"></div></div>
    <div class="panel-decorator bottom-right"><div class="corner-light"></div></div>

    <!-- 掃描線效果 -->
    <div class="scanning-line"></div>
    <div class="horizontal-line top"></div>
    <div class="horizontal-line bottom"></div>

    <div class="panel-header">
      <div class="header-box">
        <h2 v-if="planet">
          <span class="planet-id">SC-{{ formatId(planet.name.length) }}</span>
          {{ planet.name }}
        </h2>
        <div class="header-line"></div>
      </div>
      <button class="close-btn" @click="$emit('close')">
        <span class="close-icon"></span>
      </button>
    </div>

    <!-- 添加內容包裝器，專門用於滾動 -->
    <div class="panel-content">
      <div class="planet-desc sci-fi-box" v-if="planet">
        <div class="box-corner tl"></div>
        <div class="box-corner tr"></div>
        <div class="box-corner bl"></div>
        <div class="box-corner br"></div>
        <div class="box-title">概述</div>
        <div class="data-content">{{ planet.description }}</div>
        <div class="data-indicator"></div>
      </div>

      <!-- 添加自轉速度指示器 -->
      <div class="rotation-indicator sci-fi-box" v-if="planet">
        <div class="box-corner tl"></div>
        <div class="box-corner tr"></div>
        <div class="box-corner bl"></div>
        <div class="box-corner br"></div>
        <div class="box-title">自轉速度</div>
        <div class="rotation-visual">
          <div class="rotation-circle-container">
            <div class="rotation-circle" :style="getRotationStyle">
              <div class="rotation-marker"></div>
            </div>
            <div class="rotation-ring"></div>
          </div>
          <div class="rotation-data">
            <div class="rotation-speed-value">{{ (props.planet?.rotationSpeed || 0) * 500 }} rpm</div>
            <div class="rotation-label">
              <span>{{ getRotationSpeedText }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="planet-details" v-if="planet">
        <div v-for="(detail, index) in planet.details" :key="index" class="detail-card sci-fi-box">
          <div class="box-corner tl"></div>
          <div class="box-corner tr"></div>
          <div class="box-corner bl"></div>
          <div class="box-corner br"></div>
          <div class="box-title">{{ detail.title }}</div>
          <div class="data-content">{{ detail.content }}</div>
          <div class="data-indicator" :style="{ opacity: 0.3 + Math.random() * 0.7 }"></div>
        </div>
        <!-- 添加底部間距 -->
        <div class="bottom-spacer"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, computed } from 'vue';
import type { Planet } from '../types/Planet';

export default defineComponent({
  name: 'PlanetInfo',
  props: {
    planet: {
      type: Object as PropType<Planet | null>,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
    shouldAnimate: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close'],
  setup(props) {
    // 控制動畫狀態
    const animationActive = ref(false);

    // 格式化ID，補零的輔助函數
    const formatId = (num: number): string => {
      if (num < 10) return '00' + num;
      if (num < 100) return '0' + num;
      return num.toString();
    };

    // 計算自轉速度的文字顯示
    const getRotationSpeedText = computed(() => {
      if (!props.planet) return '';

      // 將數值映射到可理解的文字描述
      const speed = props.planet.rotationSpeed;
      if (speed >= 0.02) return '極快';
      if (speed >= 0.015) return '很快';
      if (speed >= 0.01) return '快速';
      if (speed >= 0.005) return '適中';
      return '緩慢';
    });

    // 計算自轉動畫樣式
    const getRotationStyle = computed(() => {
      if (!props.planet) return {};

      // 自轉速度決定動畫時間，速度越快動畫越快
      const duration = 10 / (props.planet.rotationSpeed * 50); // 秒

      return {
        animation: `rotate ${duration}s linear infinite`
      };
    });

    // 監聽isActive變化，觸發動畫
    watch(() => props.isActive, (newValue) => {
      if (newValue && props.shouldAnimate) {
        // 顯示時帶入動畫
        animationActive.value = true;
        // 動畫結束後重置
        setTimeout(() => {
          animationActive.value = false;
        }, 1500); // 延長至 1.5 秒，對應新的動畫持續時間
      }
    });

    // 處理滾輪事件，阻止事件冒泡，使其不影響星球切換
    const handleWheel = (event: WheelEvent) => {
      // 只有在面板激活時才阻止事件冒泡
      if (event.currentTarget && (event.currentTarget as HTMLElement).classList.contains('active')) {
        event.stopPropagation();
      }
    };

    return {
      handleWheel,
      animationActive,
      getRotationSpeedText,
      getRotationStyle,
      formatId,
      props // 暴露props以便在模板中使用
    };
  }
});
</script>

<style scoped>
.planet-info-panel {
  position: fixed;
  top: 50%;
  right: 0;
  width: 380px;
  transform: translate(100%, -50%);
  background: rgba(0, 12, 30, 0.65);
  backdrop-filter: blur(8px);
  padding: 20px;
  transition: transform 0.5s cubic-bezier(0.33, 0.1, 0.5, 1);
  z-index: 10;
  border-left: 1px solid rgba(0, 195, 255, 0.3);
  border-radius: 16px 0 0 16px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: -5px 0 25px rgba(0, 120, 255, 0.35), inset 0 0 20px rgba(0, 200, 255, 0.15);
  /* 添加自定義滾動條 */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 200, 255, 0.4) transparent;
  color: rgba(190, 230, 255, 0.95);
  text-shadow: 0 0 2px rgba(0, 200, 255, 0.5);
  font-family: 'Exo 2', 'Arial', sans-serif;
  letter-spacing: 0.5px;
  display: flex;
  flex-direction: column;
}

/* 覆蓋層效果 */
.panel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 60, 120, 0.15), rgba(0, 30, 60, 0.05));
  z-index: -1;
  pointer-events: none;
}

/* 網格背景 */
.panel-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(0, 195, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 195, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: -1;
  opacity: 0.15;
  pointer-events: none;
}

/* 裝飾元素 */
.panel-decorator {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 2px solid rgba(0, 195, 255, 0.7);
  z-index: 1;
  transition: all 0.5s;
  pointer-events: none;
}

.corner-light {
  position: absolute;
  width: 6px;
  height: 6px;
  background: rgba(0, 195, 255, 0.8);
  border-radius: 50%;
  filter: blur(1px);
  animation: pulse 3s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.7;
    box-shadow: 0 0 8px rgba(0, 195, 255, 0.7);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 12px rgba(0, 195, 255, 1);
  }
}

.top-left {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
}
.top-left .corner-light { top: -3px; left: -3px; }

.top-right {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
}
.top-right .corner-light { top: -3px; right: -3px; }

.bottom-left {
  bottom: 10px;
  left: 10px;
  border-right: none;
  border-top: none;
}
.bottom-left .corner-light { bottom: -3px; left: -3px; }

.bottom-right {
  bottom: 10px;
  right: 10px;
  border-left: none;
  border-top: none;
}
.bottom-right .corner-light { bottom: -3px; right: -3px; }

/* 水平線裝飾 */
.horizontal-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(to right,
    rgba(0, 195, 255, 0),
    rgba(0, 195, 255, 0.5),
    rgba(0, 195, 255, 0));
  z-index: 1;
  pointer-events: none;
}

.horizontal-line.top {
  top: 60px;
}

.horizontal-line.bottom {
  bottom: 40px;
}

/* 掃描線效果 */
.scanning-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, transparent, rgba(0, 255, 255, 0.8), transparent);
  animation: scanning 4s linear infinite;
  opacity: 0.7;
  z-index: 1;
  filter: blur(1px);
}

@keyframes scanning {
  0% { top: 0; }
  100% { top: 100%; }
}

/* 科幻風格框 */
.sci-fi-box {
  position: relative;
  border: 1px solid rgba(0, 195, 255, 0.35);
  background: rgba(0, 30, 60, 0.25);
  box-shadow: 0 0 15px rgba(0, 150, 255, 0.1), inset 0 0 20px rgba(0, 60, 100, 0.2);
  padding: 20px 15px 15px;
  margin-top: 20px; /* 增加上邊距，為標題留出空間 */
  margin-bottom: 15px;
  transition: all 0.3s ease;
  border-radius: 4px;
  overflow: visible; /* 改為 visible 允許標題顯示在容器外 */
}

.sci-fi-box:hover {
  box-shadow: 0 0 20px rgba(0, 200, 255, 0.2), inset 0 0 30px rgba(0, 80, 120, 0.2);
  border-color: rgba(0, 195, 255, 0.5);
  transform: translateY(-2px);
}

.box-title {
  position: absolute;
  top: -12px;
  left: 15px;
  padding: 3px 10px;
  background: rgba(0, 40, 80, 0.9);
  color: rgba(0, 225, 255, 0.9);
  font-size: 14px;
  border: 1px solid rgba(0, 195, 255, 0.35);
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 0 5px rgba(0, 200, 255, 0.8);
  z-index: 10;
  box-shadow: 0 -2px 5px rgba(0, 60, 120, 0.3);
}

.data-content {
  position: relative;
  font-size: 15px;
  line-height: 1.5;
  z-index: 2;
}

.data-indicator {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0, 195, 255, 0.6);
  animation: blink 2s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* 框角裝飾 */
.box-corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid rgba(0, 195, 255, 0.7);
  z-index: 2;
}

.tl {
  top: -2px;
  left: -2px;
  border-right: none;
  border-bottom: none;
}

.tr {
  top: -2px;
  right: -2px;
  border-left: none;
  border-bottom: none;
}

.bl {
  bottom: -2px;
  left: -2px;
  border-right: none;
  border-top: none;
}

.br {
  bottom: -2px;
  right: -2px;
  border-left: none;
  border-top: none;
}

/* 為普通激活狀態設置簡單過渡 */
.planet-info-panel.active {
  transform: translate(0, -50%);
}

/* 為動畫入場設置特殊的曲線 */
.planet-info-panel.animate-in {
  animation: flyInFromRight 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transform: translateZ(0);
  will-change: transform, opacity;
  backface-visibility: hidden;
  overflow-y: auto;
}

/* 入場動畫 */
@keyframes flyInFromRight {
  0% {
    transform: translate3d(100%, -50%, 0);
    opacity: 0;
  }
  20% {
    opacity: 0.2;
  }
  100% {
    transform: translate3d(0%, -50%, 0);
    opacity: 1;
  }
}

/* 為Webkit瀏覽器自定義滾動條 */
.planet-info-panel::-webkit-scrollbar {
  width: 6px;
}

.planet-info-panel::-webkit-scrollbar-track {
  background: rgba(0, 30, 60, 0.3);
  border-radius: 3px;
}

.planet-info-panel::-webkit-scrollbar-thumb {
  background: rgba(0, 195, 255, 0.3);
  border-radius: 3px;
}

.planet-info-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 195, 255, 0.5);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 195, 255, 0.3);
  position: relative;
  z-index: 2;
}

.header-box {
  position: relative;
  padding-bottom: 5px;
}

.header-line {
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, rgba(0, 195, 255, 0.2), rgba(0, 255, 255, 0.8), rgba(0, 195, 255, 0.2));
}

.panel-header h2 {
  font-size: 26px;
  font-weight: 600;
  color: rgba(200, 230, 255, 0.95);
  text-shadow: 0 0 10px rgba(0, 200, 255, 0.7);
  margin: 0;
  position: relative;
  letter-spacing: 1px;
  display: flex;
  flex-direction: column;
}

.planet-id {
  font-size: 12px;
  color: rgba(0, 195, 255, 0.8);
  font-weight: normal;
  letter-spacing: 2px;
  margin-bottom: 3px;
}

.close-btn {
  background: rgba(0, 30, 60, 0.6);
  border: 1px solid rgba(0, 195, 255, 0.4);
  color: rgba(200, 230, 255, 0.95);
  cursor: pointer;
  transition: all 0.3s;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  position: relative;
}

.close-icon {
  position: relative;
  width: 15px;
  height: 15px;
}

.close-icon:before, .close-icon:after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: rgba(0, 195, 255, 0.8);
  top: 50%;
  left: 0;
}

.close-icon:before {
  transform: rotate(45deg);
}

.close-icon:after {
  transform: rotate(-45deg);
}

.close-btn:hover {
  background: rgba(0, 60, 100, 0.8);
  border-color: rgba(0, 195, 255, 0.7);
  box-shadow: 0 0 15px rgba(0, 200, 255, 0.5);
}

.close-btn:hover .close-icon:before,
.close-btn:hover .close-icon:after {
  background-color: white;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
}

.planet-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 2;
  width: 100%;
  min-height: 0;
  flex: 1;
}

.detail-card {
  padding: 18px 15px 15px;
  transition: all 0.3s;
  width: 100%;
  box-sizing: border-box;
  margin-top: 22px; /* 確保每個詳情卡片都與標題良好融合 */
}

.planet-desc {
  margin-top: 22px; /* 增加上邊距確保與標題良好融合 */
  margin-bottom: 25px;
  line-height: 1.7;
  width: 100%;
  box-sizing: border-box;
}

/* 自轉速度指示器樣式 */
.rotation-indicator {
  margin-top: 22px; /* 增加上邊距確保與標題良好融合 */
  margin-bottom: 25px;
}

.rotation-visual {
  display: flex;
  align-items: center;
  padding-top: 8px;
}

.rotation-circle-container {
  position: relative;
  width: 70px;
  height: 70px;
}

.rotation-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgb(0, 100, 200), rgb(0, 180, 230));
  position: absolute;
  top: 5px;
  left: 5px;
  box-shadow: 0 0 20px rgba(0, 150, 220, 0.6);
}

.rotation-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(0, 195, 255, 0.6);
  box-shadow: 0 0 10px rgba(0, 150, 220, 0.4), inset 0 0 10px rgba(0, 150, 220, 0.4);
  pointer-events: none;
}

.rotation-marker {
  position: absolute;
  top: 5px;
  left: 50%;
  width: 4px;
  height: 10px;
  background-color: #fff;
  border-radius: 2px;
  transform: translateX(-50%);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
}

.rotation-data {
  flex: 1;
  margin-left: 25px;
  display: flex;
  flex-direction: column;
}

.rotation-speed-value {
  font-size: 15px;
  margin-bottom: 8px;
  color: rgba(0, 195, 255, 0.9);
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
}

.rotation-label {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  color: rgba(0, 255, 255, 0.9);
  text-shadow: 0 0 10px rgba(0, 200, 255, 0.6);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 滾動提示器 */
.planet-info-panel::after {
  content: '';
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 5px;
  background: rgba(0, 195, 255, 0.4);
  border-radius: 3px;
  opacity: 0;
  animation: fadeInOut 2s infinite;
  pointer-events: none;
  z-index: 3;
  filter: blur(1px);
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .planet-info-panel {
    width: 340px;
    max-height: 80vh;
  }
}

@media (max-width: 480px) {
  .planet-info-panel {
    width: 280px;
    padding: 15px;
  }

  .panel-header h2 {
    font-size: 22px;
  }

  .rotation-visual {
    flex-direction: column;
    align-items: center;
  }

  .rotation-data {
    margin-left: 0;
    margin-top: 15px;
    text-align: center;
  }
}

/* 添加內容容器樣式 */
.panel-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 5px; /* 添加一些內邊距，讓滾動條有空間 */
  margin-right: -5px; /* 抵消內邊距，保持整體寬度 */
  position: relative;
  z-index: 2;
  height: calc(90vh - 120px); /* 確保內容區域有足夠但不過多的高度 */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 200, 255, 0.4) transparent;
}

/* 為底部添加間距，確保所有內容可見 */
.bottom-spacer {
  height: 30px;
}

/* 調整滾動條樣式 */
.panel-content::-webkit-scrollbar {
  width: 6px;
}

.panel-content::-webkit-scrollbar-track {
  background: rgba(0, 30, 60, 0.3);
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb {
  background: rgba(0, 195, 255, 0.3);
  border-radius: 3px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 195, 255, 0.5);
}
</style>
