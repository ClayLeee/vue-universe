export const planets = [
    {
        name: "太陽",
        textureUrl: "./assets/planets/8k_sun.jpg",
        size: 20, // 太陽比例上應該更大，但為了適應介面做了縮小處理
        distance: 0, // 太陽位於中心
        rotationSpeed: 0.002,
        description: "太陽是太陽系的中心天體，是一顆G型主序星，質量約為地球的333,000倍。太陽主要由氫（約73%）和氦（約25%）組成，其核心溫度高達約1,500萬攝氏度。太陽的能量來源是核聚變反應，每秒將約600萬噸氫轉化為氦，釋放出驚人的能量。",
        details: [
            { title: "直徑", content: "1,392,700 公里" },
            { title: "表面溫度", content: "5,500°C" },
            { title: "核心溫度", content: "約1,500萬°C" },
            { title: "年齡", content: "約46億年" },
            { title: "質量", content: "地球的333,000倍" },
            { title: "自轉週期", content: "約25天（在赤道處）" }
        ]
    },
    {
        name: "月球",
        textureUrl: "./assets/planets/8k_moon.jpg",
        size: 1.5,
        distance: 9.5, // 調整位置使其接近地球但不重疊
        rotationSpeed: 0.003,
        description: "月球是地球的唯一天然衛星，是太陽系中第五大衛星。月球與地球的距離平均約為384,400公里。月球沒有大氣層，表面布滿隕石坑、山脈和平原。月球已經完成潮汐鎖定，所以從地球上只能看到月球的一面。",
        details: [
            { title: "直徑", content: "3,474 公里" },
            { title: "軌道週期", content: "27.3 天" },
            { title: "自轉週期", content: "27.3 天（與公轉同步）" },
            { title: "平均溫度", content: "-20°C（日間可達120°C，夜間可降至-130°C）" },
            { title: "表面重力", content: "地球的 0.17 倍" },
            { title: "距離地球", content: "平均384,400公里" }
        ]
    },
    {
        name: "谷神星",
        textureUrl: "./assets/planets/4k_ceres_fictional.jpg",
        size: 1.7,
        distance: 13, // 位於火星和木星之間的小行星帶
        rotationSpeed: 0.009,
        description: "谷神星是太陽系小行星帶中最大的天體，也是一顆矮行星。它約有945公里直徑，佔據了小行星帶總質量的三分之一。谷神星表面有許多明亮的區域，這些可能是由鹽類沉積物組成的。NASA的黎明號探測器於2015年抵達谷神星並進行了詳細觀測。",
        details: [
            { title: "直徑", content: "945 公里" },
            { title: "軌道週期", content: "4.6 年" },
            { title: "自轉週期", content: "9 小時" },
            { title: "平均溫度", content: "-106°C" },
            { title: "表面重力", content: "地球的 0.03 倍" },
            { title: "發現年份", content: "1801年" }
        ]
    },
    {
        name: "水星",
        textureUrl: "./assets/planets/8k_mercury.jpg",
        size: 1.5,
        distance: 5,
        rotationSpeed: 0.01,
        description: "水星是太陽系中最小且最接近太陽的行星，沒有衛星。它表面布滿隕石坑，因為沒有大氣層保護。水星的溫差非常大，白天可達430°C，夜間可降至-180°C。",
        details: [
            { title: "直徑", content: "4,879.4 公里" },
            { title: "軌道週期", content: "88 天" },
            { title: "自轉週期", content: "58.6 天" },
            { title: "平均溫度", content: "167°C (−173°C 至 427°C)" },
            { title: "表面重力", content: "地球的 0.38 倍" },
            { title: "衛星數量", content: "0" }
        ]
    },
    {
        name: "金星",
        textureUrl: "./assets/planets/8k_venus_surface.jpg",
        size: 2,
        distance: 7,
        rotationSpeed: 0.005,
        description: "金星是太陽系中第二顆行星，也被稱為「地球的孿生兄弟」，因為它的大小和密度與地球相似。然而，金星擁有濃密的二氧化碳大氣層，造成嚴重的溫室效應，使其表面溫度達到約465°C，高於水星。金星的自轉方向與其他行星相反。",
        details: [
            { title: "直徑", content: "12,104 公里" },
            { title: "軌道週期", content: "225 天" },
            { title: "自轉週期", content: "243 天 (逆轉)" },
            { title: "平均溫度", content: "462°C" },
            { title: "表面重力", content: "地球的 0.9 倍" },
            { title: "衛星數量", content: "0" }
        ]
    },
    {
        name: "地球",
        textureUrl: "./assets/planets/8k_earth_daymap.jpg",
        // 由於缺少雲層紋理，將使用一般紋理
        color: 0x1a4d7c, // 備用顏色
        size: 2.2,
        distance: 9,
        rotationSpeed: 0.01,
        description: "地球是太陽系中第三顆行星，是目前已知唯一孕育和支持生命的天體。地球表面的71%被水覆蓋，其餘為陸地，有活躍的大氣層和磁場，能保護表面免受太陽輻射和微小隕石的侵害。地球有一個自然衛星——月球。",
        details: [
            { title: "直徑", content: "12,742 公里" },
            { title: "軌道週期", content: "365.25 天" },
            { title: "自轉週期", content: "23.93 小時" },
            { title: "平均溫度", content: "15°C" },
            { title: "表面重力", content: "9.8 m/s²" },
            { title: "衛星數量", content: "1 (月球)" }
        ]
    },
    {
        name: "火星",
        textureUrl: "./assets/planets/8k_mars.jpg",
        size: 1.8,
        distance: 11,
        rotationSpeed: 0.008,
        description: "火星是太陽系中第四顆行星，因表面富含氧化鐵而呈現紅色，故有「紅色星球」之稱。火星有稀薄的大氣層，主要由二氧化碳組成。表面特徵包括撞擊坑、火山、山谷、沙漠和極地冰帽。科學家發現了液態水存在的證據，這使火星成為尋找地外生命的重點目標。",
        details: [
            { title: "直徑", content: "6,779 公里" },
            { title: "軌道週期", content: "687 天" },
            { title: "自轉週期", content: "24.6 小時" },
            { title: "平均溫度", content: "-65°C" },
            { title: "表面重力", content: "地球的 0.38 倍" },
            { title: "衛星數量", content: "2 (火衛一、火衛二)" }
        ]
    },
    {
        name: "木星",
        textureUrl: "./assets/planets/8k_jupiter.jpg",
        size: 11.2,
        distance: 16,
        rotationSpeed: 0.02,
        description: "木星是太陽系中最大的行星，質量是地球的318倍。它是一個氣體巨行星，主要由氫和氦組成，沒有固體表面。木星最顯著的特徵是大紅斑，這是一個持續數百年的巨大風暴。木星至少有79顆衛星，其中最著名的是伽利略發現的四顆大衛星：木衛一、木衛二、木衛三和木衛四。",
        details: [
            { title: "直徑", content: "139,820 公里" },
            { title: "軌道週期", content: "11.86 年" },
            { title: "自轉週期", content: "9.93 小時" },
            { title: "平均溫度", content: "-145°C (雲層頂部)" },
            { title: "表面重力", content: "地球的 2.4 倍" },
            { title: "衛星數量", content: "至少 79 顆" }
        ]
    },
    {
        name: "土星",
        textureUrl: "./assets/planets/8k_saturn.jpg",
        // 由於缺少環的紋理，將使用一般紋理
        color: 0xc3a992, // 備用顏色
        size: 9.45,
        distance: 21,
        rotationSpeed: 0.018,
        description: "土星是太陽系中第二大行星，以其壯觀的環系統而聞名。這些環主要由冰粒、塵埃和岩石碎片組成，直徑超過27萬公里，但厚度僅為10-20米。土星是一個氣體巨行星，密度低於水。它有至少83顆已知衛星，最大的是土衛六，是太陽系中唯一一個擁有濃密大氣層的衛星。",
        details: [
            { title: "直徑", content: "116,460 公里" },
            { title: "軌道週期", content: "29.46 年" },
            { title: "自轉週期", content: "10.7 小時" },
            { title: "平均溫度", content: "-178°C (雲層頂部)" },
            { title: "表面重力", content: "地球的 1.07 倍" },
            { title: "衛星數量", content: "至少 83 顆" },
            { title: "環系統", content: "寬度約 270,000 公里，厚度僅 10-20 米" }
        ]
    },
    {
        name: "天王星",
        textureUrl: "./assets/planets/2k_uranus.jpg",
        size: 4.01,
        distance: 24,
        rotationSpeed: 0.015,
        description: "天王星是太陽系中第七大行星，被分類為冰巨行星。它因其獨特的自轉軸而聞名，與其軌道平面幾乎垂直，使其看起來像是「側躺」著旋轉。天王星的大氣層主要由氫、氦和甲烷組成，甲烷氣體吸收紅光並反射藍綠色光，賦予其獨特的藍綠色外觀。天王星有13個已知的環和27顆已知的衛星。",
        details: [
            { title: "直徑", content: "50,724 公里" },
            { title: "軌道週期", content: "84.01 年" },
            { title: "自轉週期", content: "17.24 小時" },
            { title: "平均溫度", content: "-197°C" },
            { title: "表面重力", content: "地球的 0.89 倍" },
            { title: "衛星數量", content: "27" }
        ]
    },
    {
        name: "海王星",
        textureUrl: "./assets/planets/2k_neptune.jpg",
        size: 3.88,
        distance: 27,
        rotationSpeed: 0.017,
        description: "海王星是太陽系中最遠的行星（自冥王星降格後），也是第八大行星。它與天王星一樣被分類為冰巨行星。海王星的大氣層富含甲烷，這使它呈現鮮豔的藍色。它有強烈的風暴系統，包括「大黑斑」，這是一個類似木星大紅斑的巨大風暴區。海王星有14顆已知的衛星，最大的是海衛一，佔海王星質量的99.5%。",
        details: [
            { title: "直徑", content: "49,244 公里" },
            { title: "軌道週期", content: "164.8 年" },
            { title: "自轉週期", content: "16.11 小時" },
            { title: "平均溫度", content: "-201°C" },
            { title: "表面重力", content: "地球的 1.14 倍" },
            { title: "衛星數量", content: "14" }
        ]
    },
    {
        name: "妊神星",
        textureUrl: "./assets/planets/4k_haumea_fictional.jpg",
        size: 1.6,
        distance: 30,
        rotationSpeed: 0.025,
        description: "妊神星是太陽系中的一顆矮行星，因其奇特的橢圓形狀而聞名。它是已知自轉最快的太陽系大型天體，每3.9小時自轉一次。妊神星有兩顆已知的衛星，並且擁有一個環系統，這在矮行星中極為罕見。它主要由岩石物質組成，表面覆蓋著結晶水冰。",
        details: [
            { title: "直徑", content: "約1,632 × 996 公里" },
            { title: "軌道週期", content: "284 年" },
            { title: "自轉週期", content: "3.9 小時" },
            { title: "平均溫度", content: "-241°C" },
            { title: "發現年份", content: "2004年" },
            { title: "衛星數量", content: "2" }
        ]
    },
    {
        name: "鳥神星",
        textureUrl: "./assets/planets/4k_makemake_fictional.jpg",
        size: 1.8,
        distance: 33,
        rotationSpeed: 0.015,
        description: "鳥神星是太陽系中的一顆矮行星，位於柯伊伯帶，是繼冥王星和鬩神星後第三大被發現的柯伊伯帶天體。它的表面呈現紅色，可能是由甲烷和乙烷等有機物質構成。鳥神星非常寒冷，表面主要由甲烷冰、乙烷冰和氮冰組成。2016年，天文學家發現鳥神星有一顆衛星。",
        details: [
            { title: "直徑", content: "約1,430 公里" },
            { title: "軌道週期", content: "309 年" },
            { title: "自轉週期", content: "約23 小時" },
            { title: "平均溫度", content: "-239°C" },
            { title: "發現年份", content: "2005年" },
            { title: "衛星數量", content: "1" }
        ]
    },
    {
        name: "鬩神星",
        textureUrl: "./assets/planets/4k_eris_fictional.jpg",
        size: 2,
        distance: 36,
        rotationSpeed: 0.01,
        description: "鬩神星是太陽系中最大的矮行星之一，直徑與冥王星相當，但質量略大。它位於柯伊伯帶之外的散佈盤中，軌道高度傾斜。鬩神星表面覆蓋著甲烷冰和氮冰。它有一顆衛星名為混沌，直徑約400公里。鬩神星的發現促使天文學家重新考慮行星的定義，最終導致冥王星被重新分類為矮行星。",
        details: [
            { title: "直徑", content: "約2,326 公里" },
            { title: "軌道週期", content: "558 年" },
            { title: "自轉週期", content: "約25.9 小時" },
            { title: "平均溫度", content: "-243°C" },
            { title: "發現年份", content: "2005年" },
            { title: "衛星數量", content: "1 (混沌)" }
        ]
    }
];
export default {
    getAllPlanets() {
        return planets;
    },
    getPlanetByName(name) {
        return planets.find(planet => planet.name === name);
    }
};
