<template>
    <div class="amap">
        <div id="map"></div>
        <!-- 工具 -->
        <div class="input-item" v-if="isMenu">
            <el-button type="primary" plain size="mini" @click="startAnimation">开始</el-button>
            <el-button type="primary" plain size="mini" @click="pauseAnimation">暂停</el-button>
            <el-button type="primary" plain size="mini" @click="resumeAnimation">继续</el-button>
            <el-button type="primary" plain size="mini" @click="stopAnimation">停止</el-button>
        </div>
    </div>
</template>
  
  
<!-- 高德地图key:851d81e25cefa7bbd1348dff846c08b8 -->
<!-- 高德地图安全密匙:97f864f05f4b65104ce24b71e963bf80 -->
<script>
// import AMapLoader from "@amap/amap-jsapi-loader"
import { initAMap } from './init.js'  // 使用离线地图，添加localstorge
// 图片
import carIcon from '../../assets/icons/car.png'

let heatmap;
export default {
    name: "move",
    components: {},
    props: {
        // 是否展示菜单
        isMenu: {
            type: Boolean,
            required: false,
            default: () => true
        },
        // 单条轨迹数据
        lineArr: {
            type: Array,
            required: false,
            default: () => []
        }
    },
    data() {
      return {
        carIcon,
        AMap: null,  // AMap实例
        map: null, // 地图
        marker: null
      };
    },
    watch: {
        'trajectoryData': function(o, n) {
            this.createMap();
        }
    },
    created() {
        // 安全密匙
        // window._AMapSecurityConfig = {
        //     securityJsCode: "97f864f05f4b65104ce24b71e963bf80",
        // };
    },
    mounted() {
        initAMap();
        require('./maps.js');
        this.createMap();
    },
    methods: {
        // loader() {
        //     AMapLoader.load({
        //         key: '851d81e25cefa7bbd1348dff846c08b8', // 高德地图key
        //         version: '1.4.15',
        //         plugin: [
        //             'AMap.Autocomplete',
        //             'AMap.PlaceSearch',
        //             'AMap.Scale',
        //             'AMap.OverView',
        //             'AMap.ToolBar',
        //             'AMap.MapType',
        //             'AMap.PolyEditor',
        //             'AMap.CircleEditor',
        //             'AMap.MarkerClusterer',
        //             'AMap.MoveAnimatio'
        //         ]
        //     }).then(AMap => {
        //         this.AMap = AMap;
        //         this.createMap();
        //     })
        // },
        createMap() {
            const that = this
            this.AMap = window.AMap
            const { AMap, lineArr } = this
            // 创建地图
            this.map = new AMap.Map("map", {
                resizeEnable: true,
                center: this.lineArr.length > 0 ? this.lineArr[0] : null,
                zoom: 10,
                zooms:[3,16],
                layers: [new AMap.TileLayer({
                    getTileUrl: function (x, y, z) {
                        // return require('@/assets/images/login-background.jpg');
                        return "http://172.16.5.39/amap_images/" + `${z}/${x}/${y}.png`;
                    },
                    visible: true,
                    opacity: 1,
                    zIndex: 0,
                })]
            });
            const { map } =  this
            // 创建车辆标记
            this.marker = new AMap.Marker({
                map: map,
                position: this.lineArr[0],
                icon: carIcon,
                offset: new AMap.Pixel(-10, -7),
                autoRotation: true,
                angle: -90,
            });
            // AMap.plugin('AMap.MoveAnimatio', () => {})

            // 创建轨迹
            let polyline = new AMap.Polyline({
                map: map,
                path: lineArr,
                showDir:true,
                strokeColor: "#28F",  //线颜色
                // strokeOpacity: 1,     //线透明度
                strokeWeight: 6,      //线宽
                // strokeStyle: "solid"  //线样式
            });

            var passedPolyline = new AMap.Polyline({
                map: map,
                strokeColor: "#AF5",  //线颜色
                strokeWeight: 6,      //线宽
            });

            this.marker.on('moving', function (e) {
                passedPolyline.setPath(e.passedPath);
                // 始终以移动车辆为中心
                // map.setCenter(e.target.getPosition(),true)
            });

            map.setFitView();
        },
        startAnimation () {
            const { lineArr } = this;
            this.marker.moveAlong(lineArr, 10000)
        },
        pauseAnimation() {
            this.marker.pauseMove();
        },
        resumeAnimation() {
            this.marker.resumeMove();
        },
        stopAnimation() {
            this.marker.stopMove();
        },
        destroyMap() {
            this.stopAnimation();
            this.map && this.map.destroy();
        },
    },
};
</script>

<style scoped lang="scss">
    .amap {
        width: 100%;
        height: 100%;
        position: relative;
    }
    #map {
        width: 100%;
        height: 100%;
        background-color: #fff;
        box-sizing: border-box;
        padding: 20px 20px;
    }
    .input-item {
        position: absolute;
        top: 10px;
        right: 10px;
    }
    ::v-deep .amap-icon img, .amap-marker-content img {
        width: 20x;
        height: 15px;
    }
</style>
  
  