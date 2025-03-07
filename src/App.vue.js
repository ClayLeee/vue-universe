import { defineComponent, ref } from 'vue';
import LoadingScreen from './components/LoadingScreen.vue';
import Instructions from './components/Instructions.vue';
import PlanetViewer from './components/PlanetViewer.vue';
import PlanetInfo from './components/PlanetInfo.vue';
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
        const selectedPlanet = ref(null);
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
        const handlePlanetSelected = (planet) => {
            selectedPlanet.value = planet;
            // 不在此處控制面板顯示，而是由動畫系統控制
        };
        // 處理介紹面板顯示/隱藏
        const handleInfoPanelToggle = (shouldShow) => {
            if (shouldShow) {
                // 顯示面板時使用動畫
                isPlanetInfoVisible.value = true;
                shouldAnimatePanel.value = true;
            }
            else {
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
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
const __VLS_componentsOption = {
    LoadingScreen,
    Instructions,
    PlanetViewer,
    PlanetInfo
};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "app" }));
const __VLS_0 = {}.LoadingScreen;
/** @type {[typeof __VLS_components.LoadingScreen, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    isLoading: (__VLS_ctx.isLoading),
}));
const __VLS_2 = __VLS_1({
    isLoading: (__VLS_ctx.isLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const __VLS_4 = {}.Instructions;
/** @type {[typeof __VLS_components.Instructions, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4(Object.assign({ class: ({ fade: __VLS_ctx.shouldFadeInstructions }) })));
const __VLS_6 = __VLS_5(Object.assign({ class: ({ fade: __VLS_ctx.shouldFadeInstructions }) }), ...__VLS_functionalComponentArgsRest(__VLS_5));
const __VLS_8 = {}.PlanetViewer;
/** @type {[typeof __VLS_components.PlanetViewer, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8(Object.assign(Object.assign({ 'onPlanetLoaded': {} }, { 'onPlanetSelected': {} }), { 'onToggleInfoPanel': {} })));
const __VLS_10 = __VLS_9(Object.assign(Object.assign({ 'onPlanetLoaded': {} }, { 'onPlanetSelected': {} }), { 'onToggleInfoPanel': {} }), ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onPlanetLoaded: (__VLS_ctx.handlePlanetLoaded)
};
const __VLS_16 = {
    onPlanetSelected: (__VLS_ctx.handlePlanetSelected)
};
const __VLS_17 = {
    onToggleInfoPanel: (__VLS_ctx.handleInfoPanelToggle)
};
var __VLS_11;
const __VLS_18 = {}.PlanetInfo;
/** @type {[typeof __VLS_components.PlanetInfo, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(__VLS_18, new __VLS_18(Object.assign({ 'onClose': {} }, { planet: (__VLS_ctx.selectedPlanet), isActive: (__VLS_ctx.isPlanetInfoVisible), shouldAnimate: (__VLS_ctx.shouldAnimatePanel) })));
const __VLS_20 = __VLS_19(Object.assign({ 'onClose': {} }, { planet: (__VLS_ctx.selectedPlanet), isActive: (__VLS_ctx.isPlanetInfoVisible), shouldAnimate: (__VLS_ctx.shouldAnimatePanel) }), ...__VLS_functionalComponentArgsRest(__VLS_19));
let __VLS_22;
let __VLS_23;
let __VLS_24;
const __VLS_25 = {
    onClose: (...[$event]) => {
        __VLS_ctx.isPlanetInfoVisible = false;
    }
};
var __VLS_21;
/** @type {__VLS_StyleScopedClasses['app']} */ ;
/** @type {__VLS_StyleScopedClasses['fade']} */ ;
var __VLS_dollars;
let __VLS_self;
