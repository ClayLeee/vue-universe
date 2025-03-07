<template>
  <div class="planet-container" ref="container"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import planetService from '../services/PlanetService';
import type { Planet } from '../types/Planet';

export default defineComponent({
  name: 'PlanetViewer',
  emits: ['planet-loaded', 'planet-selected', 'toggle-info-panel'],
  setup(props, { emit }) {
    const container = ref<HTMLElement | null>(null);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;

    const planets: Planet[] = planetService.getAllPlanets();
    const planetGroup = new THREE.Group();
    const planetObjects: any[] = [];
    let selectedPlanet: any = null;

    // 用於保存星球的原始大小
    const originalScales: Record<string, number> = {};

    // 追蹤星球是否處於放大觀察模式
    const isZoomedIn = ref(false);

    // 定義標準聚焦大小
    const standardFocusSize = 20; // 調整為太陽的原始大小，這樣所有星球聚焦時都會與太陽相同大小

    // 相機動畫追蹤
    let globalCameraAnimation: number | null = null;

    // 滾輪控制狀態
    let isScrolling = false;
    let currentFocusIndex = 0;

    // 添加共享的動畫總時長變量
    const baseDuration = 1000; // 第一階段動畫時長（毫秒）
    const finalDuration = 1200; // 最終階段動畫時長（毫秒）

    // 添加雙擊處理邏輯和計時器變量
    let lastClickTime = 0;
    let lastClickedPlanet: any = null;
    const doubleClickDelay = 300; // 雙擊間隔時間（毫秒）

    // 創建所有行星
    const createPlanets = () => {
      // 添加紋理加載錯誤處理函數
      const handleTextureError = (err: ErrorEvent) => {
        console.error('紋理加載失敗:', err);
      };

      // 設置基本距離和間距
      const baseDistance = 80; // 增加基本距離
      const distanceIncrement = 25; // 每個行星遞增的距離

      // 先將行星按照尺寸排序，這樣較小的行星不會被遮擋
      const sortedIndexMap = [...planets].map((p, i) => ({ size: p.size, index: i }))
        .sort((a, b) => b.size - a.size) // 按大小降序排序
        .map((item, newIndex) => ({ originalIndex: item.index, newIndex }))
        .reduce((acc, curr) => {
          acc[curr.originalIndex] = curr.newIndex;
          return acc;
        }, {} as Record<number, number>);

      planets.forEach((planetData, index) => {
        // 增加行星幾何體的細節，使旋轉更加明顯
        const geometry = new THREE.SphereGeometry(planetData.size, 64, 64);
        const textureLoader = new THREE.TextureLoader();

        // 定義紋理加載器函數，添加錯誤處理
        const loadTexture = (url: string) => {
          return textureLoader.load(url, undefined, undefined, handleTextureError);
        };

        // 檢查是否為太陽
        if (planetData.name === "太陽") {
          // 為太陽創建發光材質
          const material = new THREE.MeshBasicMaterial({
            map: loadTexture(planetData.textureUrl),
            color: 0xffffdd,
          });

          // 創建太陽網格
          const planet = new THREE.Mesh(geometry, material);

          // 添加發光效果
          const sunLight = new THREE.PointLight(0xffffdd, 2, 1000);
          planet.add(sunLight);

          // 太陽位於中心位置
          planet.position.set(0, 0, 0);

          // 添加到行星組和行星數組
          planetGroup.add(planet);
          const planetObj = {
            mesh: planet,
            data: planetData,
            angle: 0
          };
          planetObjects.push(planetObj);
        }
        // 特殊處理地球，添加雲層
        else if (planetData.name === "地球") {
          // 創建地球主體
          const earthMaterial = new THREE.MeshPhongMaterial({
            map: loadTexture(planetData.textureUrl),
            bumpMap: loadTexture('/assets/planets/earthbump.jpg'),
            bumpScale: 0.3, // 增強凹凸效果
            specularMap: loadTexture('/assets/planets/earthspec.jpg'),
            specular: new THREE.Color(0x333333),
            shininess: 25,
          });

          const planet = new THREE.Mesh(geometry, earthMaterial);

          // 添加雲層 - 優化雲層設置
          const cloudGeometry = new THREE.SphereGeometry(planetData.size * 1.02, 64, 64);
          const cloudMaterial = new THREE.MeshPhongMaterial({
            map: loadTexture('/assets/planets/8k_earth_clouds.jpg'),
            transparent: true,
            opacity: 0.65, // 降低透明度，使雲層更加細緻
            alphaMap: loadTexture('/assets/planets/8k_earth_clouds.jpg'),
            depthWrite: false, // 優化透明度渲染
            blending: THREE.CustomBlending, // 使用自定義混合模式
            blendSrc: THREE.SrcAlphaFactor,
            blendDst: THREE.OneMinusSrcAlphaFactor,
            side: THREE.DoubleSide
          });

          const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
          planet.add(cloudMesh);

          // 為雲層添加獨立的旋轉動畫，優化旋轉速度
          cloudMesh.userData = {
            isCloud: true,
            rotationSpeed: planetData.rotationSpeed * 0.62
          };

          // 設置行星位置
          const totalPlanets = planets.length - 1;
          const angle = ((index - 1) / totalPlanets) * Math.PI * 2;
          const adjustedDistance = baseDistance + ((index - 1) * distanceIncrement);
          const heightOffset = index % 2 === 0 ? (index - 1) * 5 : -((index - 1) * 5);

          planet.position.x = Math.cos(angle) * adjustedDistance;
          planet.position.z = Math.sin(angle) * adjustedDistance;
          planet.position.y = heightOffset;

          // 添加到行星組和行星數組
          planetGroup.add(planet);
          const planetObj = {
            mesh: planet,
            data: planetData,
            angle: angle
          };
          planetObjects.push(planetObj);
        }
        else {
          // 其他行星使用增強型標準材質，調整參數使紋理更加明顯
          const material = new THREE.MeshPhongMaterial({
            map: loadTexture(planetData.textureUrl),
            color: planetData.color || 0xffffff,
            bumpScale: 0.2, // 增加凹凸感
            shininess: 15,
            reflectivity: 0.5
          });

          // 如果行星有特殊的凹凸紋理圖，加載它
          if (planetData.name === "火星") {
            (material as THREE.MeshPhongMaterial).bumpMap = loadTexture('/assets/planets/marsbump.jpg');
            (material as THREE.MeshPhongMaterial).bumpScale = 0.35; // 增強火星表面紋理
          }
          else if (planetData.name === "金星") {
            (material as THREE.MeshPhongMaterial).bumpMap = loadTexture('/assets/planets/venusbump.jpg');
            (material as THREE.MeshPhongMaterial).bumpScale = 0.25;
          }
          else if (planetData.name === "水星") {
            (material as THREE.MeshPhongMaterial).bumpMap = loadTexture('/assets/planets/mercurybump.jpg');
            (material as THREE.MeshPhongMaterial).bumpScale = 0.22;
          }
          else if (planetData.name === "月球") {
            (material as THREE.MeshPhongMaterial).bumpMap = loadTexture('/assets/planets/moonbump.jpg');
            (material as THREE.MeshPhongMaterial).bumpScale = 0.3;
          }
          // 添加氣體行星的特殊處理
          else if (planetData.name === "木星" || planetData.name === "土星" ||
                   planetData.name === "天王星" || planetData.name === "海王星") {
            // 為氣體行星添加特殊的光澤和發光效果
            (material as THREE.MeshPhongMaterial).shininess = 25;

            // 強化表面細節
            const displacementScale = planetData.name === "木星" ? 0.15 : 0.12;
            (material as THREE.MeshPhongMaterial).displacementScale = displacementScale;

            // 通過高發射強度模擬氣體行星的自發光特性
            (material as THREE.MeshPhongMaterial).emissive = new THREE.Color(0x222222);
          }

          // 創建行星網格
          const planet = new THREE.Mesh(geometry, material);

          // 設置行星位置 - 使用螺旋分佈而不是圓形分佈
          const totalPlanets = planets.length - 1; // 減去太陽
          const sortedIndex = sortedIndexMap[index];

          // 使用均勻分佈的角度，確保行星不會集中在某一區域
          const angle = ((index - 1) / totalPlanets) * Math.PI * 2;

          // 使用遞增距離，較小的行星位置略微調整，避免遮擋
          const adjustedDistance = baseDistance + ((index - 1) * distanceIncrement);

          // 在垂直方向上也做一些變化，使小行星更容易被看到
          const heightOffset = index % 2 === 0 ? (index - 1) * 5 : -((index - 1) * 5);

          planet.position.x = Math.cos(angle) * adjustedDistance;
          planet.position.z = Math.sin(angle) * adjustedDistance;
          planet.position.y = heightOffset;

          // 添加到行星組和行星數組
          planetGroup.add(planet);
          const planetObj = {
            mesh: planet,
            data: planetData,
            angle: angle
          };
          planetObjects.push(planetObj);

          // 如果是土星，嘗試添加環（即使沒有紋理也創建一個簡單的環）
          if (planetData.name === "土星") {
            const ringGeometry = new THREE.RingGeometry(planetData.size * 1.4, planetData.size * 2.2, 64);
            let ringMaterial;

            if (planetData.ringUrl) {
              // 如果有環的紋理，使用紋理
              ringMaterial = new THREE.MeshBasicMaterial({
                map: loadTexture(planetData.ringUrl),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.7
              });
            } else {
              // 否則使用純色材質
              ringMaterial = new THREE.MeshBasicMaterial({
                color: 0xf0e2c9,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.5
              });
            }

            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            planet.add(ring);
          }
        }
      });
    };

    // 動畫相機移動到目標位置
    const animateCameraToTarget = (targetPosition: THREE.Vector3, closeUp: boolean = false, finalView: boolean = false) => {
      // 確保目標位置是有效的 Vector3
      if (!targetPosition || typeof targetPosition.x !== 'number') {
        console.error('無效的目標位置:', targetPosition);
        return; // 如果目標位置無效，直接返回，不執行動畫
      }

      // 計算目標相機位置 - 在行星上方偏移一定距離
      const offset = finalView
        ? new THREE.Vector3(45, 30, 45) // 調整為更適合新星球大小的視角
        : closeUp
          ? new THREE.Vector3(60, 40, 60) // 更近的視角
          : new THREE.Vector3(100, 70, 100); // 更遠的視角，增加差異

      const targetCameraPosition = new THREE.Vector3().copy(targetPosition).add(offset);

      // 保存動畫起始位置和目標
      const startPosition = camera.position.clone();
      const startLookAt = controls.target.clone();
      const startCameraRotation = camera.rotation.clone();

      // 使用共享的動畫時長
      const totalDuration = finalView ? finalDuration : baseDuration;

      // 記錄動畫開始時間
      const startTime = performance.now();

      // 清除可能存在的舊動畫
      if (globalCameraAnimation) {
        cancelAnimationFrame(globalCameraAnimation);
        globalCameraAnimation = null;
      }

      try {
        // 使用更簡單、更穩定的線性插值動畫
        // 這種方法不使用複雜的曲線計算，避免了可能的錯誤
        const animate = (currentTime: number) => {
          // 檢查動畫是否已被取消
          if (!globalCameraAnimation) return;

          // 計算經過的時間和進度百分比
          const elapsedTime = currentTime - startTime;
          let progress = Math.min(elapsedTime / totalDuration, 1.0);

          if (progress < 1.0) {
            try {
              // 使用加速曲線計算實際進度
              let easedProgress;
              if (finalView) {
                // 點擊或第二階段動畫：平滑加速
                easedProgress = progress < 0.6
                  ? 0.6 * Math.pow(progress / 0.6, 2) // 前60%：二次方加速
                  : 0.6 + 0.4 * (1 - Math.pow(1 - (progress - 0.6) / 0.4, 2)); // 後40%：平滑減速
              } else {
                // 滾輪第一階段：更快速加速
                easedProgress = progress < 0.4
                  ? 0.7 * Math.pow(progress / 0.4, 1.5) // 前40%：快速加速
                  : 0.7 + 0.3 * (1 - Math.pow(1 - (progress - 0.4) / 0.6, 2)); // 後60%：緩慢減速
              }

              // 使用簡單的線性插值計算當前位置
              // 這比使用複雜的曲線計算更穩定
              const newX = startPosition.x + (targetCameraPosition.x - startPosition.x) * easedProgress;
              const newY = startPosition.y + (targetCameraPosition.y - startPosition.y) * easedProgress;
              const newZ = startPosition.z + (targetCameraPosition.z - startPosition.z) * easedProgress;

              // 添加一個小的弧度效果，模擬曲線路徑
              const arcHeight = finalView ? 10 : 20;
              const arcEffect = Math.sin(easedProgress * Math.PI) * arcHeight;

              // 設置相機位置
              camera.position.set(newX, newY + arcEffect, newZ);

              // 平滑更新相機目標
              controls.target.lerpVectors(startLookAt, targetPosition, easedProgress);

              // 添加平滑的相機晃動效果，但僅在加速階段
              if (progress > 0.2 && progress < 0.8) {
                // 使用正弦函數創建平滑的抖動，頻率隨速度增加而增加
                // 針對不同類型的移動調整參數
                const frequency = finalView ? 12 : 18; // 點擊動畫震動頻率較低
                const amplitude = finalView
                  ? 0.0006 * Math.sin(progress * 20) // 點擊動畫震幅較小
                  : 0.0009 * Math.sin(progress * 25); // 滾輪動畫震幅稍大

                // 應用晃動效果到相機旋轉
                camera.rotation.z = startCameraRotation.z + amplitude * Math.sin(elapsedTime * 0.01 * frequency);
                camera.rotation.x = startCameraRotation.x + amplitude * 0.5 * Math.cos(elapsedTime * 0.01 * frequency);
              } else {
                // 平滑恢復相機原始旋轉
                camera.rotation.z = startCameraRotation.z;
                camera.rotation.x = startCameraRotation.x;
              }

              controls.update();

              // 繼續動畫
              globalCameraAnimation = requestAnimationFrame(animate);
            } catch (error) {
              console.error('動畫過程中發生錯誤:', error);
              // 發生錯誤時，直接跳到最終位置
              camera.position.copy(targetCameraPosition);
              controls.target.copy(targetPosition);
              camera.rotation.copy(startCameraRotation);
              controls.update();
              globalCameraAnimation = null;
            }
          } else {
            // 確保到達目標位置時精確定位
            camera.position.copy(targetCameraPosition);
            controls.target.copy(targetPosition);
            camera.rotation.copy(startCameraRotation);
            controls.update();
            globalCameraAnimation = null;

            // 如果是最終視角（第二階段動畫），且不處於放大模式，才顯示介紹區塊
            if (finalView && !isZoomedIn.value) {
              // 設置一個小延遲，讓相機完全停止後再顯示介紹區塊
              setTimeout(() => {
                emit('toggle-info-panel', true); // 顯示介紹區塊
              }, 150);
            }
          }
        };

        // 啟動動畫循環
        globalCameraAnimation = requestAnimationFrame(animate);
      } catch (error) {
        console.error('創建相機動畫時發生錯誤:', error);
        // 發生錯誤時，直接跳到最終位置
        camera.position.copy(targetCameraPosition);
        controls.target.copy(targetPosition);
        camera.rotation.copy(startCameraRotation);
        controls.update();

        // 如果是最終視角，顯示介紹區塊
        if (finalView && !isZoomedIn.value) {
          setTimeout(() => {
            emit('toggle-info-panel', true);
          }, 150);
        }
      }
    };

    // 移除所有光環的輔助函數 -> 改為移除框線效果
    const removeAllFrames = (planetMesh: THREE.Mesh) => {
      const frame = planetMesh.getObjectByName("sci-fi-frame");
      if (frame) {
        planetMesh.remove(frame);
      }
    };

    // 驗證框線是否存在的輔助函數
    const verifyFrameExists = (planetMesh: THREE.Mesh) => {
      const frame = planetMesh.getObjectByName("sci-fi-frame");

      // 如果框線不存在，重新添加
      if (!frame) {
        removeAllFrames(planetMesh);
        addSciFiFrame(planetMesh, (planetMesh as any).geometry.parameters.radius || 1);
      }
    };

    // 為星球添加科幻框線效果 (替代原來的光環效果)
    const addSciFiFrame = (planetMesh: THREE.Mesh, planetSize: number) => {
      // 創建一個組來容納所有框線
      const frameGroup = new THREE.Group();
      frameGroup.name = "sci-fi-frame";

      // 添加元數據，標記此組為框線，用於射線檢測時判斷
      frameGroup.userData = {
        isFrame: true,
        parentPlanet: planetMesh
      };

      // 設置框的大小 - 比行星稍大
      const boxSize = planetSize * 2.2;
      const cornerLength = boxSize * 0.3; // 每個角落線段長度為框總尺寸的30%

      // 創建框線材質 - 發光的藍色
      const frameMaterial = new THREE.LineBasicMaterial({
        color: 0x00ccff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending, // 使線條看起來更明亮
        linewidth: 2 // 注意：由於WebGL限制，線寬在某些平台上可能被忽略
      });

      // 定義八個角落的位置
      const cornerPositions = [
        new THREE.Vector3(-boxSize/2, -boxSize/2, -boxSize/2), // 下前左
        new THREE.Vector3( boxSize/2, -boxSize/2, -boxSize/2), // 下前右
        new THREE.Vector3(-boxSize/2,  boxSize/2, -boxSize/2), // 上前左
        new THREE.Vector3( boxSize/2,  boxSize/2, -boxSize/2), // 上前右
        new THREE.Vector3(-boxSize/2, -boxSize/2,  boxSize/2), // 下後左
        new THREE.Vector3( boxSize/2, -boxSize/2,  boxSize/2), // 下後右
        new THREE.Vector3(-boxSize/2,  boxSize/2,  boxSize/2), // 上後左
        new THREE.Vector3( boxSize/2,  boxSize/2,  boxSize/2)  // 上後右
      ];

      // 為每個角落創建三條線段 (x, y, z方向)
      cornerPositions.forEach((corner, index) => {
        // 計算每條線的終點
        const xEnd = new THREE.Vector3(
          corner.x > 0 ? corner.x - cornerLength : corner.x + cornerLength,
          corner.y,
          corner.z
        );

        const yEnd = new THREE.Vector3(
          corner.x,
          corner.y > 0 ? corner.y - cornerLength : corner.y + cornerLength,
          corner.z
        );

        const zEnd = new THREE.Vector3(
          corner.x,
          corner.y,
          corner.z > 0 ? corner.z - cornerLength : corner.z + cornerLength
        );

        // X方向線
        const xGeometry = new THREE.BufferGeometry().setFromPoints([corner, xEnd]);
        const xLine = new THREE.Line(xGeometry, frameMaterial);

        // Y方向線
        const yGeometry = new THREE.BufferGeometry().setFromPoints([corner, yEnd]);
        const yLine = new THREE.Line(yGeometry, frameMaterial);

        // Z方向線
        const zGeometry = new THREE.BufferGeometry().setFromPoints([corner, zEnd]);
        const zLine = new THREE.Line(zGeometry, frameMaterial);

        // 添加到框架組
        frameGroup.add(xLine);
        frameGroup.add(yLine);
        frameGroup.add(zLine);

        // 存儲動畫數據和星球引用
        xLine.userData = {
          animationOffset: index * 0.2,
          cornerIndex: index,
          direction: 'x',
          isFrameLine: true, // 標記為框線，用於射線檢測
          parentPlanet: planetMesh // 存儲所屬星球的引用
        };

        yLine.userData = {
          animationOffset: index * 0.2 + 0.1,
          cornerIndex: index,
          direction: 'y',
          isFrameLine: true,
          parentPlanet: planetMesh
        };

        zLine.userData = {
          animationOffset: index * 0.2 + 0.2,
          cornerIndex: index,
          direction: 'z',
          isFrameLine: true,
          parentPlanet: planetMesh
        };
      });

      // 添加到行星上
      planetMesh.add(frameGroup);
    };

    // 修改點擊事件處理函數，將放大功能移至雙擊處理
    const handlePlanetClick = (clickedPlanet: any) => {
      // 獲取當前時間
      const currentTime = new Date().getTime();

      // 檢查是否是雙擊同一星球（檢查雙擊時間間隔和點擊的是否是同一個星球）
      if (currentTime - lastClickTime < doubleClickDelay && lastClickedPlanet === clickedPlanet) {
        // 雙擊處理 - 只有當前已選中星球才執行放大功能
        if (selectedPlanet && selectedPlanet === clickedPlanet) {
          // 切換放大狀態
          isZoomedIn.value = !isZoomedIn.value;

          // 根據放大狀態顯示或隱藏介紹區塊
          if (isZoomedIn.value) {
            // 放大模式時，隱藏介紹區塊
            emit('toggle-info-panel', false);
          } else {
            // 退出放大模式時，顯示介紹區塊
            emit('toggle-info-panel', true);
          }

          // 獲取原始放大比例（標準聚焦大小）
          const originalScale = clickedPlanet.mesh.scale.x;
          // 計算目標比例 - 放大時增加70%，縮小時回到原始比例
          const targetScale = isZoomedIn.value ? originalScale * 1.7 : standardFocusSize / clickedPlanet.data.size;

          // 保存當前大小供動畫使用
          const currentScale = { value: originalScale };

          // 執行平滑的縮放動畫
          const animateScale = () => {
            if (isZoomedIn.value) {
              // 放大動畫
              currentScale.value += (targetScale - originalScale) / 20;

              // 應用新比例
              clickedPlanet.mesh.scale.set(currentScale.value, currentScale.value, currentScale.value);

              // 如果還未達到目標大小，繼續動畫
              if (currentScale.value < targetScale) {
                requestAnimationFrame(animateScale);
              }
            } else {
              // 縮小動畫
              currentScale.value -= (originalScale * 1.7 - targetScale) / 20;

              // 應用新比例
              clickedPlanet.mesh.scale.set(currentScale.value, currentScale.value, currentScale.value);

              // 如果還未達到目標大小，繼續動畫
              if (currentScale.value > targetScale) {
                requestAnimationFrame(animateScale);
              } else {
                // 確保最終大小精確
                clickedPlanet.mesh.scale.set(targetScale, targetScale, targetScale);
              }
            }
          };

          // 開始縮放動畫
          requestAnimationFrame(animateScale);

          // 重置點擊時間和目標，防止連續雙擊觸發
          lastClickTime = 0;
          return; // 已處理縮放效果，不執行後續代碼
        }
      }

      // 記錄本次點擊時間和目標，為檢測雙擊做準備
      lastClickTime = currentTime;
      lastClickedPlanet = clickedPlanet;

      // 如果當前處於放大模式，不執行普通的星球選擇邏輯
      if (isZoomedIn.value) {
        // 在放大模式下，單擊只用於準備檢測雙擊，不執行其他操作
        return;
      }

      // 只有在非放大模式下，才執行普通的星球選擇邏輯
      // 立即隱藏介紹區塊
      emit('toggle-info-panel', false);

      // 如果之前有選中的星球，恢復其原始大小並移除框線
      if (selectedPlanet && selectedPlanet !== clickedPlanet) {

        // 恢復原始大小
        const originalScale = originalScales[selectedPlanet.data.name] || 1;
        selectedPlanet.mesh.scale.set(originalScale, originalScale, originalScale);

        // 移除框線
        removeAllFrames(selectedPlanet.mesh);
      }

      // 設置新的選中星球
      selectedPlanet = clickedPlanet;

      // 計算需要的縮放倍數以達到標準聚焦大小
      const originalSize = clickedPlanet.data.size;
      const requiredScale = standardFocusSize / originalSize;

      // 保存原始縮放值（如果尚未保存）
      if (!originalScales[clickedPlanet.data.name]) {
        originalScales[clickedPlanet.data.name] = clickedPlanet.mesh.scale.x;
      }

      // 應用新的縮放
      clickedPlanet.mesh.scale.set(requiredScale, requiredScale, requiredScale);

      // 為焦點星球添加框線 (確保先移除可能已存在的框線)
      removeAllFrames(clickedPlanet.mesh);
      addSciFiFrame(clickedPlanet.mesh, clickedPlanet.data.size);

      // 額外檢查：確保只有當前星球有框線
      ensureSingleFocus();

      // 檢查框線是否成功添加
      verifyFrameExists(clickedPlanet.mesh);

      // 發出選擇事件
      emit('planet-selected', clickedPlanet.data);

      // 點擊行星時直接使用一階段動畫，直接移動到最終位置
      animateCameraToTarget(clickedPlanet.mesh.position, false, true);
    };

    // 修改滾輪事件處理函數，重置放大狀態
    const handleWheel = (event: WheelEvent) => {
      // 重置放大狀態，因為要切換到新的星球
      isZoomedIn.value = false;

      // 記錄上次的雙擊時間和對象，避免切換星球後立即雙擊導致誤觸發
      lastClickTime = 0;
      lastClickedPlanet = null;

      // 檢查滾輪事件是否發生在介紹區塊上
      const planetInfoPanel = document.querySelector('.planet-info-panel');
      if (planetInfoPanel && planetInfoPanel.classList.contains('active')) {
        // 檢查事件目標是否是介紹區塊或其子元素
        let targetElement = event.target as Node;
        while (targetElement) {
          if (targetElement === planetInfoPanel) {
            // 滾輪事件發生在介紹區塊上，不執行星球切換，允許正常滾動
            return;
          }
          targetElement = targetElement.parentNode as Node;
        }
      }

      // 立即隱藏介紹區塊
      emit('toggle-info-panel', false);

      // 移除滾動延遲，使切換更加流暢
      // 添加滾輪靈敏度控制，減小每次滾動的影響
      const wheelSensitivity = 20; // 數值越大，需要滾動越多才會切換星球

      // 只有當滾輪事件足夠大時才觸發切換
      if (Math.abs(event.deltaY) < wheelSensitivity) return;

      // 如果之前有選中的星球，恢復其原始大小並移除框線
      if (selectedPlanet) {

        // 恢復原始大小
        const originalScale = originalScales[selectedPlanet.data.name] || 1;
        selectedPlanet.mesh.scale.set(originalScale, originalScale, originalScale);

        // 移除框線
        removeAllFrames(selectedPlanet.mesh);
      }

      // 根據滾輪方向確定切換方向
      const direction = event.deltaY > 0 ? 1 : -1; // 向下滾動為正，向上為負

      // 計算新的焦點索引（跳過太陽，太陽始終保持在中心）
      currentFocusIndex = (currentFocusIndex + direction);

      // 邊界處理，確保索引在有效範圍內
      if (currentFocusIndex < 0) currentFocusIndex = planetObjects.length - 1;
      if (currentFocusIndex >= planetObjects.length) currentFocusIndex = 0;

      // 獲取當前焦點行星
      const targetPlanet = planetObjects[currentFocusIndex];

      // 如果是太陽，再次滾動
      if (targetPlanet.data.name === "太陽") {
        currentFocusIndex = (currentFocusIndex + direction);
        if (currentFocusIndex < 0) currentFocusIndex = planetObjects.length - 1;
        if (currentFocusIndex >= planetObjects.length) currentFocusIndex = 0;
      }

      // 獲取調整後的行星
      const adjustedPlanet = planetObjects[currentFocusIndex];

      // 計算需要的縮放倍數以達到標準聚焦大小
      const originalSize = adjustedPlanet.data.size;
      const requiredScale = standardFocusSize / originalSize;

      // 保存原始縮放值（如果尚未保存）
      if (!originalScales[adjustedPlanet.data.name]) {
        originalScales[adjustedPlanet.data.name] = adjustedPlanet.mesh.scale.x;
      }

      // 應用新的縮放
      adjustedPlanet.mesh.scale.set(requiredScale, requiredScale, requiredScale);

      // 為焦點星球添加框線 (確保先移除可能已存在的框線)
      removeAllFrames(adjustedPlanet.mesh);
      addSciFiFrame(adjustedPlanet.mesh, adjustedPlanet.data.size);

      // 額外檢查：確保只有當前星球有框線
      ensureSingleFocus();

      // 檢查框線是否成功添加
      verifyFrameExists(adjustedPlanet.mesh);

      // 生成行星選擇事件
      emit('planet-selected', adjustedPlanet.data);
      selectedPlanet = adjustedPlanet;

      // 修改：先移動到遠距離視角
      // 明確傳遞 false 作為兩個參數，表示這是遠距離視角
      animateCameraToTarget(adjustedPlanet.mesh.position, false, false);

      // 設置延遲計時器，在第一階段動畫完成後再執行第二階段
      setTimeout(() => {
        // 確保選中的星球沒有改變，避免在用戶快速滾動時產生衝突
        if (selectedPlanet === adjustedPlanet) {
          // 使用最終視角參數，確保與點擊聚焦效果完全一致
          animateCameraToTarget(adjustedPlanet.mesh.position, false, true);
        }
      }, baseDuration + 50); // 等待第一階段動畫完成後再執行第二階段
    };

    // 創建場景
    const createScene = () => {
      if (!container.value) return;

      // 設置渲染器
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.value.appendChild(renderer.domElement);

      // 設置相機位置 - 調整為更好的視角以觀察整個系統
      camera.position.set(200, 150, 200);
      camera.lookAt(0, 0, 0);

      // 添加環境光和方向光
      const ambientLight = new THREE.AmbientLight(0x404040, 2);
      scene.add(ambientLight);

      // 增強行星照明以突顯紋理
      const directionalLight = new THREE.DirectionalLight(0xffffff, 3); // 增強光照強度
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      // 添加對面的補光，讓行星背面也有適當照明
      const backLight = new THREE.DirectionalLight(0x404080, 1.5);
      backLight.position.set(-5, 2, -5);
      scene.add(backLight);

      // 添加頂部打光，強調行星表面細節
      const topLight = new THREE.DirectionalLight(0xffffff, 1);
      topLight.position.set(0, 10, 0);
      scene.add(topLight);

      // 添加控制器
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.07; // 增加阻尼系數，使相機移動更平滑
      controls.minDistance = 30;
      controls.maxDistance = 800;
      controls.maxPolarAngle = Math.PI / 1.5; // 限制垂直旋轉角度
      controls.enableZoom = false; // 禁用原始的縮放功能

      // 創建行星並添加到場景
      createPlanets();
      scene.add(planetGroup);

      // 添加天空盒
      const starsGeometry = new THREE.SphereGeometry(800, 64, 64);
      const starsMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('/assets/planets/8k_stars_milky_way.jpg'),
        side: THREE.BackSide
      });
      const starsMesh = new THREE.Mesh(starsGeometry, starsMaterial);
      scene.add(starsMesh);

      // 添加射線投射器進行行星選擇
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      // 監聽滑鼠點擊事件
      window.addEventListener('click', (event) => {
        // 計算滑鼠在標準化設備坐標系中的位置
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // 從相機通過滑鼠位置發射射線
        raycaster.setFromCamera(mouse, camera);

        // 獲取與射線相交的對象
        const intersects = raycaster.intersectObjects(planetGroup.children, true);

        if (intersects.length > 0) {
          // 找到第一個相交的對象
          const object = intersects[0].object;

          // 檢查是否點擊到了框線
          if (object.userData && (object.userData.isFrameLine || object.userData.isFrame)) {
            // 找到框線所屬的行星
            const parentPlanet = object.userData.parentPlanet;

            // 如果找到了行星引用，遍歷行星數組找到對應的行星對象
            if (parentPlanet) {
              // 尋找對應的行星對象
              for (const planetObj of planetObjects) {
                if (planetObj.mesh === parentPlanet) {
                  // 使用點擊處理函數
                  handlePlanetClick(planetObj);
                  return; // 處理完畢，不再繼續
                }
              }
            }
          } else {
            // 常規行星點擊邏輯
            // 遍歷行星對象數組找到被點擊的行星
            for (const planetObj of planetObjects) {
              if (planetObj.mesh === object || planetObj.mesh.children.includes(object)) {
                // 使用新的點擊處理函數
                handlePlanetClick(planetObj);
                break;
              }
            }
          }
        }
      });

      // 添加滑鼠移動監聽器，用於實現星球懸停效果
      window.addEventListener('mousemove', (event) => {
        // 計算滑鼠在標準化設備坐標系中的位置
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // 從相機通過滑鼠位置發射射線
        raycaster.setFromCamera(mouse, camera);

        // 獲取與射線相交的對象
        const intersects = raycaster.intersectObjects(planetGroup.children, true);

        // 如果滑鼠懸停在行星上，顯示指針游標
        if (intersects.length > 0) {
          document.body.style.cursor = 'pointer';
        } else {
          document.body.style.cursor = 'auto';
        }
      });

      // 添加滾輪事件監聽，用於切換行星焦點
      window.addEventListener('wheel', handleWheel);

      // 發出行星載入完成事件
      emit('planet-loaded');

      // 初始化第一個焦點星球（跳過太陽）
      setTimeout(() => {
        // 找到第一個不是太陽的行星
        const initialPlanet = planetObjects.find(p => p.data.name !== "太陽");
        if (initialPlanet) {
          // 使用點擊處理函數設置初始焦點
          handlePlanetClick(initialPlanet);
        }
      }, 1000); // 延遲1秒，確保所有資源都已加載
    };

    // 動畫循環
    const animate = () => {
      requestAnimationFrame(animate);

      // 更新控制器
      if (controls) {
        controls.dampingFactor = 0.07;
        controls.update();
      }

      // 更平滑地旋轉行星
      planetObjects.forEach((planet) => {
        // 基礎旋轉增量 - 直接根據每顆星球的rotationSpeed來旋轉
        let deltaRotation = planet.data.rotationSpeed * (1/60); // 基礎旋轉速度

        // 應用旋轉 - 確保行星本身旋轉
        planet.mesh.rotation.y += deltaRotation;

        // 處理地球雲層等特殊物體的旋轉
        planet.mesh.children.forEach((child: THREE.Object3D) => {
          if (child.userData && child.userData.isCloud) {
            // 雲層以自己的速度旋轉，與地球不同
            child.rotation.y += child.userData.rotationSpeed * (1/60);
          }
        });

        // 現有框線動畫代碼
        if (selectedPlanet && planet === selectedPlanet) {
          const frame = planet.mesh.getObjectByName("sci-fi-frame");

          if (frame) {
            const time = Date.now() * 0.001;

            // 框線旋轉速度與行星自轉速度關聯，但獨立於行星本身的旋轉
            // 這樣框線和行星以不同速度旋轉，使行星的旋轉更加明顯
            frame.rotation.y += Math.max(0.002, planet.data.rotationSpeed * 0.1);

            // 更新所有框線的動畫
            frame.children.forEach((line: THREE.Line) => {
              if (line.userData && line.userData.animationOffset !== undefined) {
                // 淡入淡出動畫
                const opacityFactor = Math.sin(time * 1.5 + line.userData.animationOffset) * 0.3 + 0.7;
                (line.material as THREE.LineBasicMaterial).opacity = opacityFactor;

                // 線條顏色脈動 - 與行星旋轉速度關聯
                const rotationFactor = planet.data.rotationSpeed * 5; // 根據旋轉速度調整顏色變化
                const hue = (time * rotationFactor + line.userData.cornerIndex * 0.05) % 1;
                const color = new THREE.Color().setHSL(hue * 0.1 + 0.55, 1, 0.6);
                (line.material as THREE.LineBasicMaterial).color = color;
              }
            });
          }
        }
      });

      // 渲染場景
      if (renderer) renderer.render(scene, camera);
    };

    // 處理窗口大小變化
    const handleResize = () => {
      if (!container.value) return;

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // 組件掛載後初始化
    onMounted(() => {
      createScene();
      animate();
      window.addEventListener('resize', handleResize);
    });

    // 確保只有聚焦的星球有框線
    const ensureSingleFocus = () => {
      // 遍歷所有行星，確保只有選中的行星有框線
      planetObjects.forEach((planet) => {
        // 如果此行星不是選中的行星，確保它沒有框線
        if (planet !== selectedPlanet) {
          // 檢查並移除所有可能的框線
          const frame = planet.mesh.getObjectByName("sci-fi-frame");
          if (frame) {
            planet.mesh.remove(frame);
          }

          // 確保未選中的行星尺寸恢復正常
          const originalScale = originalScales[planet.data.name] || 1;
          planet.mesh.scale.set(originalScale, originalScale, originalScale);
        }
      });
    };

    // 組件卸載前清理
    onBeforeUnmount(() => {
      // 清除事件監聽
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('wheel', handleWheel);

      // 清除可能正在運行的相機動畫
      if (globalCameraAnimation) {
        cancelAnimationFrame(globalCameraAnimation);
        globalCameraAnimation = null;
      }

      // 清除渲染器
      if (container.value && renderer) {
        container.value.removeChild(renderer.domElement);
      }
    });

    return {
      container
    };
  }
});
</script>

<style scoped>
.planet-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}
</style>
