var _a;
import { defineComponent, ref, watch, computed } from 'vue';
export default defineComponent({
    name: 'PlanetInfo',
    props: {
        planet: {
            type: Object,
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
        const formatId = (num) => {
            if (num < 10)
                return '00' + num;
            if (num < 100)
                return '0' + num;
            return num.toString();
        };
        // 計算自轉速度的文字顯示
        const getRotationSpeedText = computed(() => {
            if (!props.planet)
                return '';
            // 將數值映射到可理解的文字描述
            const speed = props.planet.rotationSpeed;
            if (speed >= 0.02)
                return '極快';
            if (speed >= 0.015)
                return '很快';
            if (speed >= 0.01)
                return '快速';
            if (speed >= 0.005)
                return '適中';
            return '緩慢';
        });
        // 計算自轉動畫樣式
        const getRotationStyle = computed(() => {
            if (!props.planet)
                return {};
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
        const handleWheel = (event) => {
            // 只有在面板激活時才阻止事件冒泡
            if (event.currentTarget && event.currentTarget.classList.contains('active')) {
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
debugger; /* PartiallyEnd: #3632/script.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['top-left']} */ ;
/** @type {__VLS_StyleScopedClasses['corner-light']} */ ;
/** @type {__VLS_StyleScopedClasses['top-right']} */ ;
/** @type {__VLS_StyleScopedClasses['corner-light']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-left']} */ ;
/** @type {__VLS_StyleScopedClasses['corner-light']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-right']} */ ;
/** @type {__VLS_StyleScopedClasses['corner-light']} */ ;
/** @type {__VLS_StyleScopedClasses['horizontal-line']} */ ;
/** @type {__VLS_StyleScopedClasses['horizontal-line']} */ ;
/** @type {__VLS_StyleScopedClasses['sci-fi-box']} */ ;
/** @type {__VLS_StyleScopedClasses['planet-info-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['planet-info-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['planet-info-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['planet-info-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['planet-info-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['planet-info-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['close-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['close-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['close-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['close-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['close-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['close-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['planet-info-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['planet-info-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['planet-info-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['rotation-visual']} */ ;
/** @type {__VLS_StyleScopedClasses['rotation-data']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-content']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-content']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-content']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-content']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign(Object.assign({ onWheel: (__VLS_ctx.handleWheel) }, { class: "planet-info-panel" }), { class: ({
        active: __VLS_ctx.isActive,
        'animate-in': __VLS_ctx.animationActive
    }) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "panel-overlay" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "panel-grid" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "panel-decorator top-left" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "corner-light" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "panel-decorator top-right" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "corner-light" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "panel-decorator bottom-left" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "corner-light" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "panel-decorator bottom-right" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "corner-light" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "scanning-line" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "horizontal-line top" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "horizontal-line bottom" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "panel-header" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "header-box" }));
if (__VLS_ctx.planet) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign({ class: "planet-id" }));
    (__VLS_ctx.formatId(__VLS_ctx.planet.name.length));
    (__VLS_ctx.planet.name);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "header-line" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(Object.assign({ onClick: (...[$event]) => {
        __VLS_ctx.$emit('close');
    } }, { class: "close-btn" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(Object.assign({ class: "close-icon" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "panel-content" }));
if (__VLS_ctx.planet) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "planet-desc sci-fi-box" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "box-corner tl" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "box-corner tr" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "box-corner bl" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "box-corner br" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "box-title" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "data-content" }));
    (__VLS_ctx.planet.description);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "data-indicator" }));
}
if (__VLS_ctx.planet) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "rotation-indicator sci-fi-box" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "box-corner tl" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "box-corner tr" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "box-corner bl" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "box-corner br" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "box-title" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "rotation-visual" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "rotation-circle-container" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "rotation-circle" }, { style: (__VLS_ctx.getRotationStyle) }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "rotation-marker" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "rotation-ring" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "rotation-data" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "rotation-speed-value" }));
    ((((_a = __VLS_ctx.props.planet) === null || _a === void 0 ? void 0 : _a.rotationSpeed) || 0) * 500);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "rotation-label" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.getRotationSpeedText);
}
if (__VLS_ctx.planet) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "planet-details" }));
    for (const [detail, index] of __VLS_getVForSourceType((__VLS_ctx.planet.details))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ key: (index) }, { class: "detail-card sci-fi-box" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "box-corner tl" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "box-corner tr" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "box-corner bl" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "box-corner br" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "box-title" }));
        (detail.title);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "data-content" }));
        (detail.content);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "data-indicator" }, { style: ({ opacity: 0.3 + Math.random() * 0.7 }) }));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(Object.assign({ class: "bottom-spacer" }));
}
/** @type {__VLS_StyleScopedClasses['planet-info-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['active']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-in']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-overlay']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-decorator']} */ ;
/** @type {__VLS_StyleScopedClasses['top-left']} */ ;
/** @type {__VLS_StyleScopedClasses['corner-light']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-decorator']} */ ;
/** @type {__VLS_StyleScopedClasses['top-right']} */ ;
/** @type {__VLS_StyleScopedClasses['corner-light']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-decorator']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-left']} */ ;
/** @type {__VLS_StyleScopedClasses['corner-light']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-decorator']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-right']} */ ;
/** @type {__VLS_StyleScopedClasses['corner-light']} */ ;
/** @type {__VLS_StyleScopedClasses['scanning-line']} */ ;
/** @type {__VLS_StyleScopedClasses['horizontal-line']} */ ;
/** @type {__VLS_StyleScopedClasses['top']} */ ;
/** @type {__VLS_StyleScopedClasses['horizontal-line']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-box']} */ ;
/** @type {__VLS_StyleScopedClasses['planet-id']} */ ;
/** @type {__VLS_StyleScopedClasses['header-line']} */ ;
/** @type {__VLS_StyleScopedClasses['close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['close-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-content']} */ ;
/** @type {__VLS_StyleScopedClasses['planet-desc']} */ ;
/** @type {__VLS_StyleScopedClasses['sci-fi-box']} */ ;
/** @type {__VLS_StyleScopedClasses['box-corner']} */ ;
/** @type {__VLS_StyleScopedClasses['tl']} */ ;
/** @type {__VLS_StyleScopedClasses['box-corner']} */ ;
/** @type {__VLS_StyleScopedClasses['tr']} */ ;
/** @type {__VLS_StyleScopedClasses['box-corner']} */ ;
/** @type {__VLS_StyleScopedClasses['bl']} */ ;
/** @type {__VLS_StyleScopedClasses['box-corner']} */ ;
/** @type {__VLS_StyleScopedClasses['br']} */ ;
/** @type {__VLS_StyleScopedClasses['box-title']} */ ;
/** @type {__VLS_StyleScopedClasses['data-content']} */ ;
/** @type {__VLS_StyleScopedClasses['data-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['rotation-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['sci-fi-box']} */ ;
/** @type {__VLS_StyleScopedClasses['box-corner']} */ ;
/** @type {__VLS_StyleScopedClasses['tl']} */ ;
/** @type {__VLS_StyleScopedClasses['box-corner']} */ ;
/** @type {__VLS_StyleScopedClasses['tr']} */ ;
/** @type {__VLS_StyleScopedClasses['box-corner']} */ ;
/** @type {__VLS_StyleScopedClasses['bl']} */ ;
/** @type {__VLS_StyleScopedClasses['box-corner']} */ ;
/** @type {__VLS_StyleScopedClasses['br']} */ ;
/** @type {__VLS_StyleScopedClasses['box-title']} */ ;
/** @type {__VLS_StyleScopedClasses['rotation-visual']} */ ;
/** @type {__VLS_StyleScopedClasses['rotation-circle-container']} */ ;
/** @type {__VLS_StyleScopedClasses['rotation-circle']} */ ;
/** @type {__VLS_StyleScopedClasses['rotation-marker']} */ ;
/** @type {__VLS_StyleScopedClasses['rotation-ring']} */ ;
/** @type {__VLS_StyleScopedClasses['rotation-data']} */ ;
/** @type {__VLS_StyleScopedClasses['rotation-speed-value']} */ ;
/** @type {__VLS_StyleScopedClasses['rotation-label']} */ ;
/** @type {__VLS_StyleScopedClasses['planet-details']} */ ;
/** @type {__VLS_StyleScopedClasses['detail-card']} */ ;
/** @type {__VLS_StyleScopedClasses['sci-fi-box']} */ ;
/** @type {__VLS_StyleScopedClasses['box-corner']} */ ;
/** @type {__VLS_StyleScopedClasses['tl']} */ ;
/** @type {__VLS_StyleScopedClasses['box-corner']} */ ;
/** @type {__VLS_StyleScopedClasses['tr']} */ ;
/** @type {__VLS_StyleScopedClasses['box-corner']} */ ;
/** @type {__VLS_StyleScopedClasses['bl']} */ ;
/** @type {__VLS_StyleScopedClasses['box-corner']} */ ;
/** @type {__VLS_StyleScopedClasses['br']} */ ;
/** @type {__VLS_StyleScopedClasses['box-title']} */ ;
/** @type {__VLS_StyleScopedClasses['data-content']} */ ;
/** @type {__VLS_StyleScopedClasses['data-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-spacer']} */ ;
var __VLS_dollars;
let __VLS_self;
