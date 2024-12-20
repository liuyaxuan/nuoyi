<template>
    <div class="amap">
        <div class="myMap" :id="'myMap' + id"></div>
        <div class="input-card">
            <div class="input-item" v-if="isMenu">
                <el-input placeholder="请输入内容" v-model="input" size="mini"></el-input>
                <el-button class="search-btn" type="primary" plain size="mini" @click="drawBounds">
                    查询
                </el-button>
            </div>
        </div>
        <!-- 标记 -->
        <div id="location" v-if="isLocation"></div>
        <!-- 右下角colorbar -->
        <div class="colorbar" v-if="isPathSimplifier" @mouseover="handleMouseover">
            <div class="colorbar-item">
                <div class="title">数据量统计</div>
            </div>
            <div class="colorbar-item">
                <div class="color green"></div>
                <div class="number">0 - 50000</div>
            </div>
            <div class="colorbar-item">
                <div class="color yellow"></div>
                <div class="number">50001 - 100000</div>
            </div>
            <div class="colorbar-item">
                <div class="color red1"></div>
                <div class="number">100001 - 149999</div>
            </div>
            <div class="colorbar-item">
                <div class="color red2"></div>
                <div class="number">150000 - 299999</div>
            </div>
            <div class="colorbar-item">
                <div class="color red3"></div>
                <div class="number">>300000</div>
            </div>
        </div>
        <!-- 信息窗口 -->
        <div id="information" class="information" v-if="isInfoShow">
            <div><span>名称：</span>{{ currentPickData.title || '--'}}</div>
            <div><span>在线车辆数：</span>{{ currentPickData.cnt || '0' }}</div>
        </div>
    </div>
</template>


<!-- 高德地图key:851d81e25cefa7bbd1348dff846c08b8 -->
<!-- 高德地图安全密匙:97f864f05f4b65104ce24b71e963bf80 -->

<script>
// import AMapLoader from "@amap/amap-jsapi-loader"  // 在线地图
import { mock } from './mock.js'  // 调试用离线数据
import { initAMap } from './init.js'  // 使用离线地图，添加localstorge
// 图片
import carIcon from '../../assets/icons/car.png'
import startIcon from '../../assets/icons/start.png'
// Api
import {
    getBoundariesMapData,
    getChinaArea,
    clusterer,
} from "@/api/maps/map";

let heatmap;
let district = null;
let polygon;
let currentView = null; // 当前视图可视范围
let defaultBaseData = [] // 默认基础数据，用于在前端页面上对数据进行简单的筛选
var cluster, markers = [];
var _renderClusterMarker = null;
export default {
    name: "myMap",
    components: {},
    props: {
        id: {
            type: String,
            required: false,
            default: () => '1'
        },
        isDeep: {
            type: Boolean,
            required: false,
            default: () => false
        },
        isZoomEnable: {
            type: Boolean,
            required: false,
            default: () => true
        },
        isResizeEnable: {
            type: Boolean,
            required: false,
            default: () => true
        },
        isDragEnable: {
            type: Boolean,
            required: false,
            default: () => true
        },
        // 地图中心点位置
        defaultCenter: {
            type: Array,
            required: false,
            default: () => []
        },
        defaultZoom: {
            type: Number,
            required: false,
            default: () => 0
        },
        isDashboard: {
            type: Boolean,
            required: false,
            default: () => false
        },
        // 是否是通过遮罩展示指定行政区域
        isMunicipalityMask: {
            type: Boolean,
            required: false,
            default: () => false
        },
        areaMarkerData: {
            type: Array,
            required: false,
            default: () => []
        },
        // 是否显示marker标记点
        isMaker: {
            type: Boolean,
            required: false,
            default: () => false
        },
        // marker标记点数据
        markerData: {
            type: Array,
            required: false,
            default: () => []
        },
        // 是否显示折线图(路径)
        isPolyline: {
            type: Boolean,
            required: false,
            default: () => false
        },
        // 折线轨迹
        polyLineArr: {
            type: Array,
            required: false,
            default: () => []
        },
        // 重点通道页面，基础路网数据
        baseRoadLine: {
            type: Array,
            required: false,
            default: () => []
        },
        // 是否允许编辑电子围栏
        isEditFence: {
            type: Boolean,
            required: false,
            default: () => false
        },
        // 是否显示电子围栏
        isFence: {
            type: Boolean,
            required: false,
            default: () => false
        },
        // 电子围栏数据
        fenceData: {
            type: Array,
            required: false,
            default: () => []
        },
        // 是否显示热力图
        isHeatmap: {
            type: Boolean,
            required: false,
            default: () => false
        },
        // 热力图数据
        hotMapData: {
            type: Array,
            required: false,
            default: () => []
        },
        // 热力图设置区间最大值
        heatmapMaxVal: {
            type: Number,
            required: false,
            default: () => 0
        },
        // 热力图单个圆圈半径
        radius: {
            type: Number,
            required: false,
            default: () => 25
        },
        // 是否显示巡航轨迹
        isPathSimplifier: {
            type: Boolean,
            required: false,
            default: () => false
        },
        // 巡航轨迹数据
        pathSimplifierData: {
            type: Array,
            required: false,
            default: () => []
        },
        // 是否显示海量点
        isPointSimplifier: {
            type: Boolean,
            required: false,
            default: () => false
        },
        // 海量点数据
        pointSimplifierData: {
            type: Array,
            required: false,
            default: () => []
        },
        // 点聚合
        isMarkerClusterer: {
            type: Boolean,
            required: false,
            default: () => false
        },
        markerClustererData: {
            type: Array,
            required: false,
            default: () => []
        },
        // 是否展示菜单
        isMenu: {
            type: Boolean,
            required: false,
            default: () => false
        },
        // 是否显示右下角详情
        isLocation: {
            type: Boolean,
            required: false,
            default: () => false
        },
        // 是否自动返回预设中心点
        autoBackCenter: {
            type: Boolean,
            required: false,
            default: () => false
        },
        // 是否自动返回预设缩放层级
        autoBackZoom: {
            type: Boolean,
            required: false,
            default: () => false
        },
        previousPage: {
            type: String,
            required: false,
            default: () => ''
        },
        // 全国行政边界
        nationwide: {
            type: Array,
            required: false,
            default: () => []
        },
        // 地图工具页
        isToolsPage: {
            type: Boolean,
            required: false,
            default: () => false
        },
        toolpageType: {
            type: String,
            required: false,
            default: () => ''
        },
        isLimitRadius: {
            type: Boolean,
            required: false,
            default: () => false
        },
        limitRadius: {
            type: String,
            required: false,
            default: () => ''
        },
        limitCenter: {
            type: String,
            required: false,
            default: () => ''
        },
        outsideColor: {
            type: String,
            required: false,
            default: () => ''
        },
        insideColor: {
            type: String,
            required: false,
            default: () => ''
        },
        coveColor: {
            type: String,
            required: false,
            default: () => ''
        },
        lnglatType: {
            type: String,
            required: false,
            default: () => 'amap'
        },
        limitRadiusType: {
            type: String,
            required: false,
            default: () => 'circular'
        },
    },
    data() {
        return {
            carIcon,
            startIcon,
            map: null,
            AMap: null,
            AMapUI: null,
            polyEditor: null,
            input: '',
            currentMapData: [],
            level: 8,
            currentCenter: {},
            gradient: {
                0.5: 'blue',
                0.65: 'rgb(117,211,248)',
                0.7: 'rgb(0, 255, 0)',
                0.9: '#ffea00',
                1.0: 'red'
            },
            opacity: [0, 0.7],
            currentPickData: {}, // 当前数据拾取的省份信息
            isInfoShow: false,
            fenceLnglat: [],
        };
    },
    watch: {
        'isDeep': function (n, o) {
            this.createMap();
        },
        'isHeatmap': function (n, o) {
            this.createMap();
        },
        'hotMapData': function (n, o) {
            // this.createMap();
            this.updateHeatmapView();
        },
        'markerData': function (n, o) {
            this.createMap();
        },
        'polyLineArr': function (n, o) {
            this.createMap();
        },
        'fenceData': function (n, o) {
            if (!this.isEditFence) {
                this.createMap();
            }
        },
        'pathSimplifierData': function (n, o) {
            this.createMap();
        },
        'markerClustererData': function (n, o) {
            this.createMap();
        },
        'radius': function (n, o) {
            this.createMap();
        },
        'areaMarkerData': function (n, o) {
            this.updateOnlineNum()
        },
        'pointSimplifierData': function (n, o) {
            this.createMap();
        },
        // 工具页
        'isLimitRadius': function (n ,o) {
            this.createMap();
        },
        'limitRadius': function (n, o) {
            if (n) {
                this.handleSelector();
            }
        },
        'limitCenter': function (n, o) {
            if (n) {
                this.handleSelector();
            }
        },
        'outsideColor': function (n, o) {
            if (n) {
                this.handleSelector();
            }
        },
        'insideColor': function (n, o) {
            if (n) {
                this.handleSelector();
            }
        },
        'lnglatType': function (n, o) {
            this.handleSelector();
        },
        'limitRadiusType': function (n, o) {
            if (n == 'polygon') {
                this.fenceLnglat = [];
            }
            this.handleSelector();
        },
        'coveColor': function (n, o) {
            if (n) {
                this.createMap();
            }
        },
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
        require('./amapui.js');
        this.createMap()
    },
    methods: {
        // loader() {
        //     AMapLoader.load({
        //         key: '851d81e25cefa7bbd1348dff846c08b8', // 高德地图key
        //         version: '1.4.15',
        //         plugin: [
        //             'AMap.HeatMap',
        //             'AMap.DistrictSearch'
        //         ]
        //     }).then(AMap => {
        //         this.AMap = AMap;
        //         this.createMap();
        //     })
        // },
        clearMap() {
            this.map.clearMap();
        },
        updateHeatmapView() {
            const {
                hotMapData,
                heatmapMaxVal
            } = this
            //设置数据集
            heatmap.setDataSet({
                data: hotMapData,
                max: heatmapMaxVal
            });
        },
        updateOnlineNum() {
            this.map.clearMap();
            // 地图配置信息
            this.AMap = window.AMap // 本地 AMap 库
            this.AMapUI = window.AMapUI  // 本地 AMapUI 库
            const that = this
            const {
                map,
                AMap,
                areaMarkerData,
                nationwide,
            } = this
            let marker = null
            // 获取所有省市中的在线车辆数最大值，除以 9 获得每一份的数量
            const step_val = Math.max(...areaMarkerData.map(item => { return item.cnt })) / 9;
            map.clearMap();
            for (let i = 0; i < areaMarkerData.length; i++) {
                var markerContent = '<div class="' + areaMarkerData[i].en_name + ' ' + that.setHotStatus(areaMarkerData[i].cnt) +'"></div>';
                if (this.areaMarkerData[i].en_name == '100000_JD') {
                    continue;
                };
                marker = new AMap.Marker({
                    map: this.map,
                    position: [areaMarkerData[i].lng, areaMarkerData[i].lat],
                    offset: new AMap.Pixel(-10, -10),
                    content: markerContent
                })
                // 绑定鼠标事件
                var polygonArr = [];
                if (nationwide.length > 0) {
                    polygonArr = JSON.parse(nationwide[i].geometry_coordinates)
                }
                let color = 'rgb(255, 0, 0)';
                let opacity = 0;
                if (step_val !== 0 && areaMarkerData[i].cnt >= (step_val * 9)) {
                    color = 'rgb(255, 0, 0)'
                    opacity = 0.9
                } else if (step_val !== 0 && areaMarkerData[i].cnt >= (step_val * 8)) {
                    color = 'rgb(255, 0, 0)'
                    opacity = 0.8
                } else if (step_val !== 0 && areaMarkerData[i].cnt >= (step_val * 7)) {
                    color = 'rgb(255, 0, 0)'
                    opacity = 0.7
                } else if (step_val !== 0 && areaMarkerData[i].cnt >= (step_val * 6)) {
                    color = 'rgb(255, 0, 0)'
                    opacity = 0.6
                } else if (step_val !== 0 && areaMarkerData[i].cnt >= (step_val * 5)) {
                    color = 'rgb(255, 0, 0)'
                    opacity = 0.5
                } else if (step_val !== 0 && areaMarkerData[i].cnt >= (step_val * 4)) {
                    color = 'rgb(255, 0, 0)'
                    opacity = 0.4
                } else if (step_val !== 0 && areaMarkerData[i].cnt >= (step_val * 3)) {
                    color = 'rgb(255, 0, 0)'
                    opacity = 0.3
                } else if (step_val !== 0 && areaMarkerData[i].cnt >= (step_val * 2)) {
                    color = 'rgb(255, 0, 0)'
                    opacity = 0.2
                } else if (step_val !== 0 && areaMarkerData[i].cnt >= (step_val * 1)) {
                    color = 'rgb(255, 0, 0)'
                    opacity = 0.1
                } else if (step_val !== 0 && areaMarkerData[i].cnt < (step_val * 1)) {
                    color = 'rgb(255, 234, 234)'
                    opacity = 0.1
                } else if (step_val !== 0 && areaMarkerData[i].cnt == 0) {
                    color = 'rgb(255, 0, 0)'
                    opacity = 0
                }
                if (step_val == 0) {
                    color = 'rgba(255, 0, 0, 0)'
                    opacity = 0
                }
                let fence = new AMap.Polygon({
                    path: polygonArr,
                    strokeColor: '#ffffff',
                    strokeWeight: 1,
                    strokeOpacity: 1,
                    fillOpacity: opacity, // 填充色透明度
                    fillColor: color, // 填充色
                    zIndex: 50,
                })
                // 高亮行政区域
                map.add(fence)
                fence.on('click', function (e) {
                    // map.remove(fence)
                    that.$emit('handleMapEvent')
                })
                fence.on('mousemove', function (e) {
                    // 隐藏非高亮行政区域 marker 标记ju'he
                    const dom1 = Array.from(document.getElementsByClassName('radiusMark'))
                    const dom2 = Array.from(document.getElementsByClassName('radiusMarkBlue'))
                    const dom = dom1.concat(dom2);
                    for (let j=0; j<dom.length; j++) {
                        if (dom[j] && dom[j].getAttribute("class").indexOf(areaMarkerData[i].en_name) == -1) {
                            dom[j].style.display = 'none'
                        } else {
                            that.$nextTick(() => {
                                that.currentPickData = areaMarkerData[i]
                                that.isInfoShow = true
                                if (document.getElementsByClassName('information')[0]) {
                                    document.getElementsByClassName('information')[0].style.top = e.pixel.y + 10 + 'px'
                                    document.getElementsByClassName('information')[0].style.left = e.pixel.x + 10 + 'px'
                                }
                            })
                        }
                    }
                })
                fence.on('mouseout', function (e) {
                    // 移除高亮行政区域
                    // map.remove(fence)
                    // 显示所有行政区域 marker 标记
                    const dom1 = Array.from(document.getElementsByClassName('radiusMark'))
                    const dom2 = Array.from(document.getElementsByClassName('radiusMarkBlue'))
                    const dom = dom1.concat(dom2);
                    for (let j=0; j<dom.length; j++) {
                        if (dom[j] && dom[j].getAttribute("class").indexOf(areaMarkerData[i].en_name) == -1) {
                            dom[j].style.display = 'block'
                        } else {
                            that.currentPickData = {}
                            that.isInfoShow = false
                        }
                    }
                })
                marker.setMap(map);
            }
        },
        createMap() {
            this.AMap = window.AMap // 本地 AMap 库
            this.AMapUI = window.AMapUI  // 本地 AMapUI 库
            const that = this
            const { AMap, radius, defaultCenter, defaultZoom, isZoomEnable, isResizeEnable, isDragEnable } = this
            const lng = that.hotMapData.length > 0 ? that.hotMapData[0].lng : 116.397428
            const lat = that.hotMapData.length > 0 ? that.hotMapData[0].lat : 39.90923
            let center = defaultCenter.length != 0 ? defaultCenter : [lng, lat]
            let zoom = defaultZoom > 0 ? defaultZoom : 7
            this.level = zoom
            this.map = new AMap.Map("myMap" + this.id, {
                zoomEnable: isZoomEnable,
                resizeEnable: isResizeEnable,
                dragEnable: isDragEnable,
                center: center,
                zoom: zoom,
                zooms: [3, 18],
                layers: [new AMap.TileLayer({
                    getTileUrl: function (x, y, z) {
                        return "https://wprd03.is.autonavi.com/appmaptile?x=" + x + "&y=" + y + "&z=" + z + "&style=7&ltype=11"
                        // if (!that.isDeep) {
                        //     // 浅色地图
                        //     return "http://172.16.5.39/amap_images/" + `${z}/${x}/${y}.png`;
                        // } else {
                        //     // 深色地图
                        //     return "http://172.16.5.39/amap_images_deep/" + `${z}/${x}/${y}.png`;
                        // }
                    },
                    visible: true,
                    opacity: 1,
                    zIndex: 0,
                })]
            });

            this.handleSelector();
            // 绑定地图移动事件，获取中心点经纬度
            this.map.on('mapmove', this.mapMove);
            this.map.on('moveend', this.mapMoveend);
            this.map.on('click', (e) => {
                if (this.limitRadiusType == 'polygon') {
                    if (this.fenceLnglat.length > 3) {
                        this.$confirm('此操作将清空当前绘制围栏, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.clearMap()
                            this.$emit('getCurrentLnglat', e.lnglat)
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                            });          
                        });
                    } else {
                        this.clearMap()
                        this.$emit('getCurrentLnglat', e.lnglat)
                    }
                } else {
                    this.$emit('getCurrentLnglat', e.lnglat)
                }
            })

            // 地图配置信息
            const {
                map,
                isHeatmap,
                isFence,
                isPolyline,
                isMaker,
                isDashboard,
                isMunicipalityMask,
                isToolsPage,
                toolpageType,
                fenceData,
                markerData,
                areaMarkerData,
                isMarkerClusterer,
                markerClustererData,
                gradient,
                opacity,
                nationwide,
            } = this
            // 首页仪表盘省市标记
            if (isDashboard) {
                let marker = null
                // 获取所有省市中的在线车辆数最大值，除以 9 获得每一份的数量
                const step_val = Math.max(...areaMarkerData.map(item => { return item.cnt })) / 9;
                for (let i = 0; i < areaMarkerData.length; i++) {
                    var markerContent = '<div class="' + areaMarkerData[i].en_name + ' ' + that.setHotStatus(areaMarkerData[i].cnt) +'"></div>';
                    if (this.areaMarkerData[i].en_name == '100000_JD') {
                        continue;
                    };
                    marker = new AMap.Marker({
                        map: this.map,
                        position: [areaMarkerData[i].lng, areaMarkerData[i].lat],
                        offset: new AMap.Pixel(-10, -10),
                        content: markerContent
                    })
                    // 绑定鼠标事件
                    var polygonArr = [];
                    if (nationwide.length > 0) {
                        polygonArr = JSON.parse(nationwide[i].geometry_coordinates)
                    }
                    let color = 'rgb(255, 0, 0)';
                    let opacity = 0;
                    if (step_val !== 0 && areaMarkerData[i].cnt >= (step_val * 9)) {
                        color = 'rgb(255, 0, 0)'
                        opacity = 0.9
                    } else if (step_val !== 0 && areaMarkerData[i].cnt >= (step_val * 8)) {
                        color = 'rgb(255, 0, 0)'
                        opacity = 0.8
                    } else if (step_val !== 0 && areaMarkerData[i].cnt >= (step_val * 7)) {
                        color = 'rgb(255, 0, 0)'
                        opacity = 0.7
                    } else if (step_val !== 0 && areaMarkerData[i].cnt >= (step_val * 6)) {
                        color = 'rgb(255, 0, 0)'
                        opacity = 0.6
                    } else if (step_val !== 0 && areaMarkerData[i].cnt >= (step_val * 5)) {
                        color = 'rgb(255, 0, 0)'
                        opacity = 0.5
                    } else if (step_val !== 0 && areaMarkerData[i].cnt >= (step_val * 4)) {
                        color = 'rgb(255, 0, 0)'
                        opacity = 0.4
                    } else if (step_val !== 0 && areaMarkerData[i].cnt >= (step_val * 3)) {
                        color = 'rgb(255, 0, 0)'
                        opacity = 0.3
                    } else if (step_val !== 0 && areaMarkerData[i].cnt >= (step_val * 2)) {
                        color = 'rgb(255, 0, 0)'
                        opacity = 0.2
                    } else if (step_val !== 0 && areaMarkerData[i].cnt >= (step_val * 1)) {
                        color = 'rgb(255, 0, 0)'
                        opacity = 0.1
                    } else if (step_val !== 0 && areaMarkerData[i].cnt < (step_val * 1)) {
                        color = 'rgb(255, 234, 234)'
                        opacity = 0.1
                    } else if (step_val !== 0 && areaMarkerData[i].cnt == 0) {
                        color = 'rgb(255, 0, 0)'
                        opacity = 0
                    }
                    let fence = new AMap.Polygon({
                        path: polygonArr,
                        strokeColor: '#ffffff',
                        strokeWeight: 1,
                        strokeOpacity: 1,
                        fillOpacity: opacity, // 填充色透明度
                        fillColor: color, // 填充色
                        zIndex: 50,
                    })
                    // 高亮行政区域
                    map.add(fence)
                    fence.on('click', function (e) {
                        // map.remove(fence)
                        that.$emit('handleMapEvent')
                    })
                    fence.on('mousemove', function (e) {
                        // 隐藏非高亮行政区域 marker 标记ju'he
                        const dom1 = Array.from(document.getElementsByClassName('radiusMark'))
                        const dom2 = Array.from(document.getElementsByClassName('radiusMarkBlue'))
                        const dom = dom1.concat(dom2);
                        for (let j=0; j<dom.length; j++) {
                            if (dom[j] && dom[j].getAttribute("class").indexOf(areaMarkerData[i].en_name) == -1) {
                                dom[j].style.display = 'none'
                            } else {
                                that.$nextTick(() => {
                                    that.currentPickData = areaMarkerData[i]
                                    that.isInfoShow = true
                                    if (document.getElementsByClassName('information')[0]) {
                                        document.getElementsByClassName('information')[0].style.top = e.pixel.y + 10 + 'px'
                                        document.getElementsByClassName('information')[0].style.left = e.pixel.x + 10 + 'px'
                                    }
                                })
                            }
                        }
                    })
                    fence.on('mouseout', function (e) {
                        // 移除高亮行政区域
                        // map.remove(fence)
                        // 显示所有行政区域 marker 标记
                        const dom1 = Array.from(document.getElementsByClassName('radiusMark'))
                        const dom2 = Array.from(document.getElementsByClassName('radiusMarkBlue'))
                        const dom = dom1.concat(dom2);
                        for (let j=0; j<dom.length; j++) {
                            if (dom[j] && dom[j].getAttribute("class").indexOf(areaMarkerData[i].en_name) == -1) {
                                dom[j].style.display = 'block'
                            } else {
                                that.currentPickData = {}
                                that.isInfoShow = false
                            }
                        }
                    })
                    marker.setMap(map);
                }
            }
            // 行政区域遮罩
            if(isMunicipalityMask) {
                this.drawBounds();
            }
            // 热力图
            if (isHeatmap) {
                map.plugin([
                    "AMap.Heatmap",
                    "AMap.DistrictSearch"
                ], function () {
                    //初始化heatmap对象
                    heatmap = new AMap.Heatmap(map, {
                        radius: radius, //给定半径
                        opacity: opacity,
                        gradient: gradient,
                        key: 1
                    });
                    //设置数据集
                    heatmap.setDataSet({
                        data: that.hotMapData,
                        max: 10000
                    });
                });
            }
            // 电子围栏
            if (isFence) {
                // 添加 电子围栏 标记点
                for (let i = 0; i < fenceData.length; i++) {
                    const color = this.getRandomColor()
                    let fence = new AMap.Polygon({
                        path: fenceData[i],
                        strokeColor: color,
                        strokeWeight: 2,
                        strokeOpacity: 0.8,
                        fillOpacity: 0.3, // 填充色透明度
                        fillColor: 'transparent',//color, // 填充色
                        zIndex: 50,
                    })
                    // fence.on('mousemove', function (e) {

                    // })
                    map.add(fence)
                    // 编辑电子围栏
                    if (this.isEditFence) {
                        this.polyEditor = new AMap.PolyEditor(map, fence)
                        this.polyEditor.open()
                        // this.polyEditor.on('end', function(event) {
                        // })
                    }
                }
            }

            // 点聚合
            if(isMarkerClusterer) {
                    const that = this;
                    const points = markerClustererData;
                    markers = [];
                    for (var i = 0; i < points.length; i += 1) {
                        let marker = new AMap.Marker({
                            position: points[i]['lnglat'],
                            name: points[i]['name'],
                            content: '<i class="el-icon-info" style="color: rgba(255, 231, 0, 0.6); font-size: 30px;"></i>',
                            // content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
                            offset: new AMap.Pixel(-15, -15)
                        })
                        marker.on('click', function (e) {
                            that.$emit('handleCompanyInfo', e)
                        })
                        markers.push(marker)
                    }

                    var count = markers.length;
                    _renderClusterMarker = function (context) {
                        var factor = Math.pow(context.count / count, 1 / 18);
                        var div = document.createElement('div');
                        var Hue = 180 - factor * 180;
                        var bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
                        var fontColor = 'hsla(' + Hue + ',100%,20%,1)';
                        var borderColor = 'hsla(' + Hue + ',100%,40%,1)';
                        var shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
                        div.style.backgroundColor = bgColor;
                        var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
                        div.style.width = div.style.height = size + 'px';
                        div.style.border = 'solid 1px ' + borderColor;
                        div.style.borderRadius = size / 2 + 'px';
                        div.style.boxShadow = '0 0 1px ' + shadowColor;
                        div.innerHTML = context.count;
                        div.style.lineHeight = size + 'px';
                        div.style.color = fontColor;
                        div.style.fontSize = '14px';
                        div.style.textAlign = 'center';
                        context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
                        context.marker.setContent(div)
                    };

                    this.addCluster(2);
            }

            // 巡航轨迹
            if (that.isPathSimplifier) {
                var emptyLineStyle = {
                    lineWidth: 0,
                    fillStyle: null,
                    strokeStyle: null,
                    borderStyle: null
                };
                this.AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function (PathSimplifier, $) {
                    if (!PathSimplifier.supportCanvas) {
                        alert('当前环境不支持 Canvas！');
                        return;
                    }
                    // 数据
                    defaultBaseData = JSON.parse(JSON.stringify(that.pathSimplifierData))
                    let path = that.pathSimplifierData || []
                    //创建组件实例
                    var pathSimplifierIns = new PathSimplifier({
                        zIndex: 100,
                        autoSetFitView: true, // 是否启用自动缩放到全局视图
                        map: that.map, //所属的地图实例
                        getPath: function (pathData, pathIndex) {
                            //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
                            return pathData.path;
                        },
                        getHoverTitle: function (pathData, pathIndex, pointIndex) {
                            return '当前【' + pathData.name + '】段长度:' + pathData.km + 'km';
                            //返回鼠标悬停时显示的信息
                            // if (pointIndex >= 0) {
                            //     //鼠标悬停在某个轨迹节点上
                            //     return pathData.name + '，点:' + pointIndex + '/' + pathData.path.length;
                            // }
                            //鼠标悬停在节点之间的连线上
                            // return pathData.name + '，点数量' + pathData.path.length;
                        },
                        renderOptions: {
                            //轨迹线的样式
                            pathLineStyle: {
                                lineWidth: 0,
                                fillStyle: null,
                                strokeStyle: null,
                                borderStyle: null,
                                dirArrowStyle: false
                            },
                            // pathLineStyle: emptyLineStyle,
                            // pathLineSelectedStyle: emptyLineStyle,
                            pathLineHoverStyle: {
                                strokeStyle: '#67C23A',
                                borderStyle: '#fff',
                                dirArrowStyle: true
                            },
                            keyPointStyle: emptyLineStyle,
                            startPointStyle: emptyLineStyle,
                            endPointStyle: emptyLineStyle,
                            keyPointHoverStyle: emptyLineStyle,
                            keyPointOnSelectedPathLineStyle: emptyLineStyle,
                            getPathStyle: function (pathItem, zoom) {
                                return {
                                    pathLineStyle: {
                                        strokeStyle: pathItem.pathData.traffic || 'green',
                                        lineWidth: 5
                                    }
                                }
                            }
                        }
                    });
                    // 点击事件
                    pathSimplifierIns.on('pathClick', function(e, info){
                        console.log('info->', info)
                    });

                    //这里构建轨迹
                    pathSimplifierIns.setData(path);

                    //创建一个巡航器
                    // var navg0 = pathSimplifierIns.createPathNavigator(0, //关联第1条轨迹
                    //     {
                    //         loop: true, //循环播放
                    //         speed: 1000000
                    //     });
                    // navg0.start();
                });
            }

            // 海量点
            if (that.isPointSimplifier) {
                that.AMapUI.load(['ui/misc/PointSimplifier', 'lib/$'], function (PointSimplifier, $) {
                    if (!PointSimplifier.supportCanvas) {
                        alert('当前环境不支持 Canvas！');
                        return;
                    }

                    // console.log(that.isPointSimplifier, that.pointSimplifierData)
                    let pointSimplifierIns = new PointSimplifier({
                        map: map, //所属的地图实例
                        autoSetFitView: true, // 是否启用自动缩放到全局视图

                        getPosition: function (item) {
                            if (!item) {
                                return null;
                            }
                            var parts = item.split(',');
                            //返回经纬度
                            return [parseFloat(parts[0]), parseFloat(parts[1])];
                        },
                        getHoverTitle: function (dataItem, idx) {
                            // return idx + ': ' + dataItem;
                        },
                        renderOptions: {
                            //点的样式
                            pointStyle: {
                                width: 7,
                                height: 7,
                                fillStyle: 'rgba(255, 0, 0, 0.5)'
                            },
                            //鼠标hover时的title信息
                            hoverTitleStyle: {
                                show: false,
                                position: 'top'
                            }
                        }
                    });
                    
                    pointSimplifierIns.setData(that.pointSimplifierData);

                    pointSimplifierIns.on('pointClick pointMouseover pointMouseout', function (e, record) {
                        //console.log(e.type, record);
                    });
                });
            }

            // 形式路径（折线）
            if (isPolyline) {
                const { polyLineArr } = this
                if (!polyLineArr) return
                for (let i = 0; i < polyLineArr.length; i++) {
                    const path = polyLineArr[i]
                    var polyline = new AMap.Polyline({
                        path: path,
                        isOutline: true,
                        outlineColor: '#ffeeff',
                        showDir: true, // 是否延路径显示白色方向箭头,默认false。建议折线宽度大于6时使用
                        borderWeight: 2,
                        strokeColor: this.getRandomColor(),
                        strokeOpacity: 0.7,
                        strokeWeight: 10,
                        // 折线样式还支持 'dashed'
                        strokeStyle: "solid",
                        // strokeStyle是dashed时有效
                        strokeDasharray: [10, 5],
                        lineJoin: 'round', // 折线拐点的绘制样式，默认值为'miter'尖角，其他可选值：'round'圆角、'bevel'斜角
                        lineCap: 'butt', // 折线两端线帽的绘制样式，默认值为'butt'无头，其他可选值：'round'圆头、'square'方头
                        zIndex: 50,
                    })
                    polyline.setMap(map)
                    // 电子围栏页面，需跟随路径创建起点标记
                    if (this.previousPage == 'fence') {
                        var icon = new AMap.Icon({
                            size: new AMap.Size(40, 50),    // 图标尺寸
                            image: startIcon,  // Icon的图像
                            imageSize: new AMap.Size(40, 50)   // 根据所设置的大小拉伸或压缩图片
                        });
                        this.marker = new AMap.Marker({
                            position: path[0],
                            icon: icon,
                            offset: new AMap.Pixel(-20, -50),
                            label: '起点',
                        });
                        this.marker.setLabel({
                            offset: new AMap.Pixel(-20, 30),  //设置文本标注偏移量
                            content: "起", //设置文本标注内容
                            direction: 'right' //设置文本标注方位
                        })
                        this.map.add(this.marker)
                    }
                }
                // 缩放地图到合适的视野级别
                this.map.setFitView([polyline])
            }
            // 添加 marker 标记点
            if (isMaker) {
                let marker = null
                for (let i = 0; i < markerData.length; i++) {
                    var icon = new AMap.Icon({
                        size: new AMap.Size(25, 20),    // 图标尺寸
                        image: require("../../assets/icons/poi-marker-default.png"),  // Icon的图像
                        imageSize: new AMap.Size(25, 20)   // 根据所设置的大小拉伸或压缩图片
                    });
                    marker = new AMap.Marker({
                        map: this.map,
                        title: markerData[i].title,
                        position: [markerData[i].lon, markerData[i].lat],
                        icon: icon, //require("../../assets/icons/poi-marker-default.png"),
                        visible: true,
                    })
                    marker.setLabel({
                        show: false,
                        visible: false,
                        offset: new AMap.Pixel(-5, 20),//修改label相对于maker的位置
                        content: markerData[i].title || '',
                        direction: 'right' //设置文本标注方位
                    });
                    // 绑定点击事件
                    marker.on('click', function (e) {
                        // that.$message({
                        //     message: e.target?.w?.title,
                        //     type: 'success'
                        // });
                        // marker.markOnAMAP({
                        //     name:'首开广场',
                        //     // position:marker.getPosition()
                        // })
                        var content = '<div class="info-title">详细信息</div><div class="info-content">' +
                            markerData[i].title + '详细信息</div>';
                        var infowindow1 = new AMap.AdvancedInfoWindow({
                            content: content,
                            closeWhenClickMap: true, // 点击地图关闭信息窗
                            placeSearch: false, // 是否支持显示周边搜索，默认是true（离线环境，不支持搜索）
                            driving: false, // 是否支持驾车路径规划，默认是true（离线环境，不支持搜索）
                            walking: false, // 是否支持步行路径规划，默认是true（离线环境，不支持搜索）
                            transit: false, // 是否支持公交路径规划，默认是true（离线环境，不支持搜索）
                            asOrigin: false, // 是否支持作为路径规划的起点，默认是true（离线环境，不支持搜索）
                            asDestination: false, // 是否支持作为路径规划的终点，默认是true（离线环境，不支持搜索）
                            offset: new AMap.Pixel(0, -30)
                        });
                        infowindow1.open(map, [markerData[i].lon, markerData[i].lat])
                    })
                }
                if (markerData.length > 0) {
                    this.map.setCenter(new AMap.LngLat(markerData[0].lon, markerData[0].lat))
                }
            }

            // 地图工具页
            if (isToolsPage) {
                // 折线
                if (toolpageType == 'lines') {
                    const {
                        polyLineArr,
                        coveColor
                    } = this
                    if (!polyLineArr) return
                    for (let i = 0; i < polyLineArr.length; i++) {
                        const path = polyLineArr[i]
                        let arr = []
                        for (let j = 0; j < path.length; j++) {
                            let dom = path[j].replace("'", "").replace("'", "")
                            let index = path[j].replace("'", "").replace("'", "").indexOf(',')
                            let start = Number(dom.slice(0, index));
                            let end = Number(dom.slice(index + 1));
                            arr.push([start, end])
                        }
                        var polyline = new AMap.Polyline({
                            path: arr,
                            isOutline: true,
                            outlineColor: 'transparent',
                            borderWeight: 1,
                            strokeColor: coveColor,
                            strokeOpacity: 0.8,
                            strokeWeight: 3,
                            // 折线样式还支持 'dashed'
                            strokeStyle: "solid",
                            // strokeStyle是dashed时有效
                            strokeDasharray: [10, 5],
                            lineJoin: 'round',
                            lineCap: 'round',
                            zIndex: 50,
                        })
                        polyline.setMap(map)
                    }
                }
                // 点
                if (toolpageType == 'marker') {
                    if (markerData.length == 0) return
                    let marker = null
                    for (let i = 0; i < markerData.length; i++) {
                        var icon = new AMap.Icon({
                            size: new AMap.Size(15, 20),    // 图标尺寸
                            image: require("../../assets/icons/poi-marker-default.png"),  // Icon的图像
                            imageSize: new AMap.Size(15, 20)   // 根据所设置的大小拉伸或压缩图片
                        });
                        marker = new AMap.Marker({
                            map: this.map,
                            title: markerData[i].title || '',
                            position: [markerData[i].lng, markerData[i].lat],
                            icon: icon,
                            visible: true,
                        })
                        // marker.setLabel({
                        //     show: false,
                        //     visible: false,
                        //     offset: new AMap.Pixel(-5, 20),//修改label相对于maker的位置
                        //     content: markerData[i].title || '',
                        //     direction: 'right' //设置文本标注方位
                        // });
                        // 绑定点击事件
                        marker.on('click', function (e) {
                            // that.$message({
                            //     message: e.target?.w?.title,
                            //     type: 'success'
                            // });
                            // marker.markOnAMAP({
                            //     name:'首开广场',
                            //     // position:marker.getPosition()
                            // })
                            var content = '<div class="info-title">详细信息</div><div class="info-content">' +
                                markerData[i].title + '详细信息</div>';
                            var infowindow1 = new AMap.AdvancedInfoWindow({
                                content: content,
                                closeWhenClickMap: true, // 点击地图关闭信息窗
                                placeSearch: false, // 是否支持显示周边搜索，默认是true（离线环境，不支持搜索）
                                driving: false, // 是否支持驾车路径规划，默认是true（离线环境，不支持搜索）
                                walking: false, // 是否支持步行路径规划，默认是true（离线环境，不支持搜索）
                                transit: false, // 是否支持公交路径规划，默认是true（离线环境，不支持搜索）
                                asOrigin: false, // 是否支持作为路径规划的起点，默认是true（离线环境，不支持搜索）
                                asDestination: false, // 是否支持作为路径规划的终点，默认是true（离线环境，不支持搜索）
                                offset: new AMap.Pixel(0, -30)
                            });
                            infowindow1.open(map, [markerData[i].lng, markerData[i].lat])
                        })
                    }
                    if (markerData.length > 0) {
                        this.map.setCenter(new AMap.LngLat(markerData[0].lng, markerData[0].lat))
                    }
                }
                // 热力图
                if (toolpageType == 'heatmap') {
                    const {
                        map,
                        radius,
                        opacity,
                        gradient,
                        hotMapData,
                        heatmapMaxVal
                    } = this
                    map.plugin([
                        "AMap.Heatmap",
                        "AMap.DistrictSearch"
                    ], function () {
                        //初始化heatmap对象
                        heatmap = new AMap.Heatmap(map, {
                            radius: radius, //给定半径
                            opacity: opacity,
                            gradient: gradient,
                            key: 1
                        });
                        //设置数据集
                        heatmap.setDataSet({
                            data: hotMapData,
                            max: heatmapMaxVal
                        });
                    });
                }
            }
        },
        addCluster(tag) {
            if (cluster) {
                cluster.setMap(null);
            }
            if (tag == 2) {//完全自定义
                cluster = new AMap.MarkerClusterer(this.map, markers, {
                    gridSize: 80,
                    renderClusterMarker: _renderClusterMarker
                });
            } else if (tag == 1) {//自定义图标
                var sts = [{
                    url: "https://a.amap.com/jsapi_demos/static/images/blue.png",
                    size: new AMap.Size(32, 32),
                    offset: new AMap.Pixel(-16, -16)
                }, {
                    url: "https://a.amap.com/jsapi_demos/static/images/green.png",
                    size: new AMap.Size(32, 32),
                    offset: new AMap.Pixel(-16, -16)
                }, {
                    url: "https://a.amap.com/jsapi_demos/static/images/orange.png",
                    size: new AMap.Size(36, 36),
                    offset: new AMap.Pixel(-18, -18)
                }, {
                    url: "https://a.amap.com/jsapi_demos/static/images/red.png",
                    size: new AMap.Size(48, 48),
                    offset: new AMap.Pixel(-24, -24)
                }, {
                    url: "https://a.amap.com/jsapi_demos/static/images/darkRed.png",
                    size: new AMap.Size(48, 48),
                    offset: new AMap.Pixel(-24, -24)
                }];
                cluster = new AMap.MarkerClusterer(this.map, markers, {
                    styles: sts,
                    gridSize: 80
                });
            } else {//默认样式
                cluster = new AMap.MarkerClusterer(this.map, markers, {gridSize: 80});
            }
        },
        // 定义高德地图坐标系转换为WGS-84坐标系的函数
        gcj02ToWgs84(lng, lat) {
            var dlat = this.transformLat(lng - 105.0, lat - 35.0);
            var dlng = this.transformLng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * Math.PI;
            var magic = Math.sin(radlat);
            magic = 1 - 0.00669342162296594323 * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((6378245.0 * (1 - 0.00669342162296594323)) / (magic * sqrtmagic) * Math.PI);
            dlng = (dlng * 180.0) / (6378245.0 / sqrtmagic * Math.cos(radlat) * Math.PI);
            var mglat = lat + dlat;
            var mglng = lng + dlng;

            return [lng * 2 - mglng, lat * 2 - mglat];
        },
        // 辅助函数：计算纬度转换
        transformLat(lng, lat) {
            var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
            ret += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(lat * Math.PI) + 40.0 * Math.sin(lat / 3.0 * Math.PI)) * 2.0 / 3.0;
            ret += (160.0 * Math.sin(lat / 12.0 * Math.PI) + 320 * Math.sin(lat * Math.PI / 30.0)) * 2.0 / 3.0;
            return ret;
        },
        // 辅助函数：计算经度转换
        transformLng(lng, lat) {
            var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
            ret += (20.0 * Math.sin(6.0 * lng * Math.PI) + 20.0 * Math.sin(2.0 * lng * Math.PI)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(lng * Math.PI) + 40.0 * Math.sin(lng / 3.0 * Math.PI)) * 2.0 / 3.0;
            ret += (150.0 * Math.sin(lng / 12.0 * Math.PI) + 300.0 * Math.sin(lng / 30.0 * Math.PI)) * 2.0 / 3.0;
            return ret;
        },
        handleSetLimitPlace() {
            let index = this.limitCenter.indexOf(',')
            let start = Number(this.limitCenter.slice(0, index));
            let end = Number(this.limitCenter.slice(index + 1));
            const centerPoint =[start, end]
            let lngLatLimit = []
            const that = this
            // 根据设置的限制区域类型，生成初始围栏范围 polygon:代表多边形不规则区域
            if (this.limitRadiusType == 'polygon') {
                const baseCenter = (start && end) ? centerPoint : [this.currentCenter.lng, this.currentCenter.lat];
                this.clearMap();
                if (this.fenceLnglat.length > 3) {
                    for (let i=0; i < this.fenceLnglat.length; i++) {
                        let arr = [this.fenceLnglat[i].lng, this.fenceLnglat[i].lat]
                        lngLatLimit.push(arr)
                    }
                } else {
                    lngLatLimit = [
                        baseCenter,
                        [baseCenter[0] + 0.03, baseCenter[1] + 0.03],
                        [baseCenter[0] + 0.03, baseCenter[1] + 0.06]
                    ]
                }
            } else {
                lngLatLimit = this.computedCircle(
                    start && end ? centerPoint : [this.currentCenter.lng, this.currentCenter.lat],
                    this.limitRadius ? this.limitRadius :this.map.getScale()*0.1
                )
            }
            // 根据选择类型，转换经纬度坐标
            this.fenceLnglat = lngLatLimit || []
            if (this.lnglatType == 'amap') {
                this.fenceLnglat = lngLatLimit
            } else {
                const newLnglat = []
                for (let i=0; i<lngLatLimit.length; i++) {
                    newLnglat.push(this.gcj02ToWgs84(lngLatLimit[i][0], lngLatLimit[i][1]))
                }
                this.fenceLnglat = newLnglat
            }
            const color = this.getRandomColor()
            if (currentView) {
                this.map.remove(currentView)
            }
            currentView = new AMap.Polygon({
                path: this.fenceLnglat,
                strokeColor: this.outsideColor || '#ff0000',//color,
                strokeWeight: 2,
                strokeOpacity: 0.5,
                fillOpacity: 0.1, // 填充色透明度
                fillColor: this.insideColor || '#ff0000',//color, // 填充色
                zIndex: 50,
            })
            this.map.add(currentView)
            // 编辑电子围栏
            if (this.isEditFence) {
                this.polyEditor = new AMap.PolyEditor(this.map, currentView)
                this.polyEditor.open()
                this.polyEditor.on('adjust', function(e) {
                    that.$emit('getPolygonLnglat', e.target.w.path)
                })
            } else {
                if (this.polyEditor == null) return
                this.polyEditor.close()
            }
        },
        // 拖动地图获取中心位置
        handleSelector() {
            let timer = null
            var zoom = this.map.getZoom(); //获取当前地图级别
            var center = this.map.getCenter(); //获取当前地图级别
            let str = '当前地图:' + zoom + '级' + '中心点坐标:' + center.toString()
            this.level = zoom
            this.currentCenter = {lng: center.lng, lat: center.lat}
            if (this.isLimitRadius) {
                // 根据中心点获取半径范围的边界经纬度
                this.handleSetLimitPlace();
                // 遍历经纬度是否存在于规定范围内
                // const arr = []
                // this.hotMapData.forEach(el => {
                //     if (this.isPointInPolygon(lngLatLimit, el)) {
                //         arr.push(el)
                //     }
                // });
                // ------
                if (this.level > 15) {
                    this.opacity = [0.4, 1]
                } else {
                    setTimeout(() => {
                        if (zoom >= 10) {
                            // heatmap.show()
                        } else {
                            // heatmap.hide()
                        }
                    }, 0)
                    this.opacity = [0, 0.7]
                }
                this.$emit('handleRadiusScale', this.level, center)
            }
            if (this.autoBackCenter) {
                const lng = center.lng
                const lat = center.lat
                if ((lng !== this.defaultCenter[0] || lat !== this.defaultCenter[1]) && zoom <= 8) {
                    if (timer !== null) { clearTimeout(timer) }
                    timer = setTimeout(() => {
                        this.createMap()
                        clearTimeout(timer)
                    }, 500)
                }
            }
            // 控制是否渲染右下角详细信息
            if (!this.isLocation) return
            document.getElementById('location').innerHTML = str
        },
        handleDropMap(data) {
            const {
                isHeatmap,
                isFence,
                isPolyline,
                isMaker
            } = this
            // 热力图
            if (isHeatmap) {
                heatmap.setDataSet({
                    data: data,
                    max: 1000
                });
            }
        },
        mapMove() {
            // this.handleDropMap([]);
            this.$emit('handleVisibleInfo')
        },
        mapMoveend() {
            // 拖动地图时移除渲染层，减少卡顿
            // this.handleDropMap(this.hotMapData);
            // this.handleSelector();
        },

        handleShow() {
            heatmap.show();
        },
        handleHide() {
            heatmap.hide();
        },
        drawBounds() {
            const { AMap, map } = this
            const that = this
            map.plugin([
                "AMap.DistrictSearch"
            ], function () {
                //加载行政区划插件
                if (!district) {
                    //实例化DistrictSearch
                    var opts = {
                        subdistrict: 0,   //获取边界不需要返回下级行政区
                        extensions: 'all',  //返回行政区边界坐标组等具体信息
                        level: 'district'  //查询行政级别为 市
                    };
                    district = new AMap.DistrictSearch(opts);
                }
                //行政区查询
                district.setLevel('district')
                getBoundariesMapData({
                    type: '成都市'
                }).then(result => {
                    if (polygon) {
                        map.remove(polygon)//清除上次结果
                        polygon = null;
                    }
                    // 外多边形坐标数组和内多边形坐标数组
                    let outer = [
                        new AMap.LngLat(-360,90,true),
                        new AMap.LngLat(-360,-90,true),
                        new AMap.LngLat(360,-90,true),
                        new AMap.LngLat(360,90,true),
                    ];
                    let pathArray = [
                        outer
                    ];

                    let bounds = result.data.features[0].geometry.coordinates;
                    for (let i=0; i<bounds.length; i++) {
                        pathArray.push.apply(pathArray, bounds[i])
                        polygon = new AMap.Polygon({
                            strokeWeight: 1,
                            path: pathArray,
                            fillOpacity: 0.1,
                            fillColor: 'rgba(255, 255, 255, 0.5)',
                            strokeColor: '#0091ea'
                        });
                        map.add(polygon)
                    }
                    // map.setFitView(polygon);//视口自适应
                }).catch(err => {

                })
            });
        },
        // 过滤数据并更新热力图数据集
        filterDataAndUpdateHeatmap(data) {
            var filteredData = [];

            for (var i = 0; i < data.length; i++) {
                var point = new AMap.LngLat(data[i].lng, data[i].lat);
                if (polygon.contains(point)) {
                    filteredData.push(data[i]);
                }
            }
            return filteredData
        },
        runMarker() {
            const { polyLineArr } = this
            const path = JSON.parse(JSON.stringify(polyLineArr[0]))
            let arr = []
            for (let i = 0; i < path.length; i++) {
                arr.push([path[i].lng, path[i].lat])
            }
            // 创建车辆标记
            let icon = new AMap.Icon({
                size: new AMap.Size(25, 20),
                image: carIcon,
            })
            this.marker = new AMap.Marker({
                map: this.map,
                position: arr,
                icon: icon,
                offset: new AMap.Pixel(-10, -7),
                autoRotation: true,
                // circlable: true,
                angle: -90,
            });
            this.marker.moveAlong(arr, 100000)
        },
        // 随机生成 RGB 颜色
        getRandomColor() {
            const min = 128;
            const max = 255;
            const r = Math.floor(Math.random() * (max - min + 1)) + 20;
            const g = Math.floor(Math.random() * (max - min + 1)) + 30;
            const b = Math.floor(Math.random() * (max - min + 1)) + 40;
            return `rgb(${r}, ${g}, ${b})`;
        },
        // 启用编辑
        handleEditFence() {
            this.polyEditor.open()
        },
        // 完成编辑
        handleCloseEditFence() {
            this.polyEditor.close()
        },
        computedCircle(lnglat, radius) {
            // lnglat = [104.308173, 30.846514]
            // radius = 5000
            let r = 6371000.79
            let phase = 2 * Math.PI / 360
            let point = []
            for (let i = 0; i < 360; i++) {
                let dx = radius * Math.cos(i * phase)
                let dy = radius * Math.sin(i * phase)

                let lng = dx / (r * Math.cos(lnglat[1] * Math.PI / 180) * Math.PI / 180)
                let lat = dy / (r * Math.PI / 180)
                let newLng = lnglat[0] + lng
                point.push([Number(newLng.toFixed(4)), Number((lnglat[1] + lat).toFixed(4))])
            }
            return point
        },
        //判断一个点在不在一个圈里面
        isPointInPolygon(pts,point) {
            //pts [{lat:xxx,lng:xxx},{lat:xxx,lng:xxx}]
            //point {lat:xxx,lng:xxx}
            var N = pts.length;  
            var boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
            var intersectCount = 0;//cross points count of x
            var precision = 2e-10; //浮点类型计算时候与0比较时候的容差
            var p1, p2;//neighbour bound vertices
            var p = point; 
            p1 = pts[0];//left vertex
            for(var i = 1; i <= N; ++i){//check all rays
                if((p.lat==p1.lat)&&(p.lng==p1.lng)){
                    console.log(boundOrVertex)
                    return boundOrVertex;//p is an vertex
                }
                p2 = pts[i % N];//right vertex
                if(p.lat < Math.min(p1.lat, p2.lat) || p.lat > Math.max(p1.lat, p2.lat)){
                    //ray is outside of our interests
                    p1 = p2;
                    continue;//next ray left point
                }
                if(p.lat > Math.min(p1.lat, p2.lat) && p.lat < Math.max(p1.lat, p2.lat)){
                    //ray is crossing over by the algorithm (common part of)
                    if(p.lng <= Math.max(p1.lng, p2.lng)){
                        //x is before of ray
                        if(p1.lat == p2.lat && p.lng >= Math.min(p1.lng, p2.lng)){
                            //overlies on a horizontal ray
                            return boundOrVertex;
                        }
                        if(p1.lng == p2.lng){//ray is vertical
                            if(p1.lng == p.lng){//overlies on a vertical ray
                                return boundOrVertex;
                            }else{//before ray
                                ++intersectCount;
                            }
                        }else{//cross point on the left side
                                var xinters = (p.lat - p1.lat) * (p2.lng - p1.lng) / (p2.lat - p1.lat) + p1.lng;//cross point of lng
                                if(Math.abs(p.lng - xinters) < precision){//overlies on a ray
                                    return boundOrVertex;
                                }
                                if(p.lng < xinters){//before ray
                                ++intersectCount;
                                }
                        }
                    }
                }else{
                    //special case when ray is crossing through the vertex
                    if(p.lat == p2.lat && p.lng <= p2.lng){
                        //p crossing over p2
                        var p3 = pts[(i+1) % N]; //next vertex
                        if(p.lat >= Math.min(p1.lat, p3.lat) && p.lat <= Math.max(p1.lat, p3.lat)){
                            //p.lat lies between p1.lat & p3.lat
                            ++intersectCount;
                        }else{
                            intersectCount += 2;
                        }
                    }
                }
                p1 = p2;//next ray left point
            }
            if(intersectCount % 2 == 0){//偶数在多边形外
                return false;
            } else { //奇数在多边形内
                return true;
            }
        },
        setHotStatus(cnt) {
            if (cnt > 31000) {
                return 'radiusMark'
            } else {
                return 'radiusMarkBlue'
            }
        },
        handleMouseover(e) {
            return
            const dom = document.getElementsByClassName('colorbar')[0]
            const top = Number(window.getComputedStyle(dom).top.replace('px', ''))
            const bottom = Number(window.getComputedStyle(dom).bottom.replace('px', ''))
            if (top > bottom) {
                dom.style.bottom = 'unset'
                dom.style.top = '30px'
            } else {
                dom.style.bottom = '30px'
                dom.style.top = 'unset'
                return
            }
        },
        handleSetFitView() {
            //视口自适应
            this.map.setFitView(currentView);
        }
    }
};
</script>

<style scoped lang="scss">
.amap {
    width: 100%;
    height: 100%;
    position: relative;
    .colorbar {
        padding: 10px 10px;
        background-color: rgba(255, 255, 255, 0.6);
        border-radius: 4px 4px;
        box-shadow: 3px 3px 3px rgba(255, 255, 255, 0.6);
        position: absolute;
        top: 30px;
        right: 10px;
        .colorbar-item {
            font-size: 12px;
            font-weight: bold;
            display: flex;
            justify-content: left;
            margin-top: 5px;
            // 绿色
            .green {
                background-color: #67C23A;
            }
            // 黄色
            .yellow {
                background-color: #E6A23C;
            }
            // 红色
            .red1 {
                background-color: #F56C6C;
            }
            .red2 {
                background-color: rgb(245, 30, 30);
            }
            .red3 {
                background-color: rgb(110, 1, 1);
            }
            .title  {
                font-size: 13px;
            }
            .color {
                width: 20px;
                height: 10px;
                border-radius: 3px;
            }
            .color:hover {
                cursor: pointer;
            }
            .number {
                width: auto;
                height: 10px;
                line-height: 10px;
                text-align: center;
                margin-left: 5px;
            }
        }
    }
}

.myMap {
    width: 100%;
    height: 100%;
    background-color: #fff;
    box-sizing: border-box;
    padding: 20px 20px;
}

.input-card {
    position: absolute;
    top: 30px;
    right: 20px;
    display: flex;
    justify-content: right;

    .input-item {
        display: flex;
        margin-right: 10px;

        .search-btn {
            margin-left: 10px;
        }
    }
}

// 信息窗口
.information {
    width: 200px;
    height: 60px;
    border-radius: 12px;
    box-sizing: border-box;
    padding: 10px 10px;
    background-color: rgba(0, 0, 0, 0.8);
    position: absolute;
    left: 0px;
    bottom: 0px;
    font-size: 13px;
    font-weight: bold;
    color: rgba(216, 100, 248, 1);
    display: flex;
    flex-direction: column;
    justify-content: left;
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2);
    div {
        margin-right: 10px;
        span {
            color: #fff;
            font-weight: bold;
        }
    }
}

::v-deep .radiusMark {
    width: 5px;
    height: 5px;
    background-color: #fff; // rgba(216, 100, 248, 0.6);
    // animation: blink 1s infinite alternate;// 省会城市闪烁动画
    border-radius: 10px;
    cursor: pointer;
}

::v-deep .radiusMarkBlue {
    width: 5px;
    height: 5px;
    background-color: #fff; //rgba(75, 204, 236, 0.6);
    // animation: blue 1s infinite alternate;// 省会城市闪烁动画
    border-radius: 10px;
    cursor: pointer;
}

// 省会城市闪烁动画
@keyframes blue {
    0% {
        box-shadow: 0 0 0px 0px rgba(75, 204, 236, 0.6), 0 0 1px 1px rgba(75, 204, 236, 0.6);
    }

    50% {
        box-shadow: 0 0 3px 3px rgba(75, 204, 236, 0.6), 0 0 6px 6px rgba(75, 204, 236, 0.6);
    }

    100% {
        box-shadow: 0 0 0px 0px rgba(75, 204, 236, 0.6), 0 0 1px 1px rgba(75, 204, 236, 0.6);
    }
}

@keyframes blink {
    0% {
        box-shadow: 0 0 0px 0px rgba(216, 100, 248, 0.6), 0 0 1px 1px rgba(216, 100, 248, 0.6);
    }

    50% {
        box-shadow: 0 0 3px 3px rgba(216, 100, 248, 0.6), 0 0 6px 6px rgba(216, 100, 248, 0.6);
    }

    100% {
        box-shadow: 0 0 0px 0px rgba(216, 100, 248, 0.6), 0 0 1px 1px rgba(216, 100, 248, 0.6);
    }
}
.viewerBtn {
    position: absolute;
    top: 30px;
    right: 100px;
    z-index: 999;
}
#location {
    width: auto;
    height: 20px;
    position: absolute;
    bottom: 3px;
    right: 10px;
    font-size: 12px;
    color: rgba(0, 0, 0, 1);
}

::v-deep .amap-icon img,
.amap-marker-content img {
    width: 10px;
    height: auto;
}

// 信息窗体
::v-deep .info-title {
    color: white;
    font-size: 14px;
    background-color: #25A5F7;
    line-height: 26px;
    padding: 0px 0 0 6px;
    font-weight: lighter;
    letter-spacing: 1px
}

::v-deep .info-content {
    font: 12px Helvetica, 'Hiragino Sans GB', 'Microsoft Yahei', '微软雅黑', Arial;
    padding: 4px;
    color: #666666;
    line-height: 23px;
}
</style>