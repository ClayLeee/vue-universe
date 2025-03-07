<template>
  <div class="app">
    <LoadingScreen :isLoading="isLoading" />
    <Instructions :class="{ fade: shouldFadeInstructions }" />
    <PlanetViewer
      @planet-loaded="handlePlanetLoaded"
      @planet-selected="handlePlanetSelected"
      @toggle-info-panel="handleInfoPanelToggle"
    />
    <PlanetInfo
      :planet="selectedPlanet"
      :isActive="isPlanetInfoVisible"
      :shouldAnimate="shouldAnimatePanel"
      @close="isPlanetInfoVisible = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import LoadingScreen from './components/LoadingScreen.vue';
import Instructions from './components/Instructions.vue';
import PlanetViewer from './components/PlanetViewer.vue';
import PlanetInfo from './components/PlanetInfo.vue';
import type { Planet } from './types/Planet';

export default defineComponent({
  name: 'App',
  components: {
    LoadingScreen,
    Instructions,
    PlanetViewer,
    PlanetInfo
  },
  setup() {
    const isLoading = ref(true);
    const shouldFadeInstructions = ref(false);
    const selectedPlanet = ref<Planet | null>(null);
    const isPlanetInfoVisible = ref(false);
    const shouldAnimatePanel = ref(true);

    // 處理行星載入完成
    const handlePlanetLoaded = () => {
      // 3秒後隱藏載入畫面
      setTimeout(() => {
        isLoading.value = false;
      }, 3000);

      // 10秒後淡化操作指南
      setTimeout(() => {
        shouldFadeInstructions.value = true;
      }, 10000);
    };

    // 處理行星選擇
    const handlePlanetSelected = (planet: Planet) => {
      selectedPlanet.value = planet;
      // 不在此處控制面板顯示，而是由動畫系統控制
    };

    // 處理介紹面板顯示/隱藏
    const handleInfoPanelToggle = (shouldShow: boolean) => {
      if (shouldShow) {
        // 顯示面板時使用動畫
        isPlanetInfoVisible.value = true;
        shouldAnimatePanel.value = true;
      } else {
        // 隱藏面板時不使用動畫，直接隱藏
        isPlanetInfoVisible.value = false;
        shouldAnimatePanel.value = false;
      }
    };

    return {
      isLoading,
      shouldFadeInstructions,
      selectedPlanet,
      isPlanetInfoVisible,
      shouldAnimatePanel,
      handlePlanetLoaded,
      handlePlanetSelected,
      handleInfoPanelToggle
    };
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
  font-family: "微軟正黑體", Arial, sans-serif;
  color: #fff;
  background-color: #000;
}

.app {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.fade {
  opacity: 0.2;
}
</style>
