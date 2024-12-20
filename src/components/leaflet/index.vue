<template>
    <div class="tools-leaflet-container">
        <div class="left">
            <!--- 右键菜单 --->
            <myContextMenu :isVisble="isContextMenuVisible" :pageX="pageX" :pageY="pageY"></myContextMenu>
            <!-- loading状态 -->
            <my-loading v-if="laoding"></my-loading>
            <!-- 工具菜单 -->
            <div class="filter-switch">
                <div v-for="item in tabsMenu" :key="item.id" :id="item.id" class="switch-item"
                    :class="active == item.id ? ' active' : ''" @click="handleClickMenu(item.id, item.type)">
                    <i :id="item.id" :class="item.icon">
                        {{ item.name }}
                    </i>
                </div>
                <!-- 绘制多边形时，展示按钮【排除区域内路段】 -->
                <el-button v-if="type == 'drawPolygon'" :disabled="polygonPoints.length == 1" type="primary" size="mini"
                    style="margin-left: 10px; position: absolute; right: -5px; top: 40px;"
                    @click="filterRoads">排除区域内路段</el-button>
            </div>
            <!-- color Bar -->
            <div class="colorbar" v-if="true">
                <div style="font-size: 12px; color: #ffffff; font-weight: bold;">分段流量</div>
                <div class="colorbar-item" v-for="(item, index) in intervals" :key="index">
                    <div :class="getColor(index)"></div>
                    <div class="number">{{ item }}</div>
                </div>
            </div>
            <!-- 拾取经纬度 -->
            <div class="pickupLnglat" v-if="pickupLnglat">
                {{ pickupLnglat }}
                <el-button v-if="isClickPickLnglat" type="primary" size="mini" style="margin-left: 10px;"
                    :disabled="!pickupLnglat" v-clipboard:copy="pickupLnglat" @click="copySuccess">复制</el-button>
                <!-- 关闭按钮 -->
                <i class="el-icon-error closeLatlngTip" @click="this.handleClearPickupLnglat"></i>
            </div>

            <!-- 提示信息窗口 -->
            <my-msg :type="type"></my-msg>
            <!-- 地图展示 -->
            <div id="map" class="map"></div>

            <!-- 右侧-弹窗 -->
            <my-dialog :dialogVisble="isEditVisble" unfold="right">
                <template #content>
                    <div class="json-place">
                        <json-editor class="jsonEditor" v-model="jsonData" mode="code"></json-editor>
                    </div>
                </template>
                <template #footer>
                    <div class="search-item" style="margin-top: 10px; display: flex; justify-content: end;">
                        <el-button type="primary" size="mini" @click="closeDialog">关闭</el-button>
                    </div>
                </template>
            </my-dialog>

            <!-- 左侧-弹窗 -->
            <my-dialog
                :dialogVisble="isVisble"
                unfold="left"
            >
                <template #content v-if="dialogType == 'mapType'">
                    <div class="search-item">
                        <div class="search-title">瓦片图类型:</div>
                        <el-select class="input" v-model="mapType" placeholder="请选择" size="mini">
                            <el-option key="amap" label="高德" value="amap"></el-option>
                            <el-option key="osm" label="osm" value="osm"></el-option>
                        </el-select>
                    </div>
                </template>
                <template #content v-else-if="dialogType == 'mapSearch'">
                    <div class="search-item">
                        <div class="search-title">行政区域:</div>
                        <el-select class="input" v-model="administrativeAreaValue" placeholder="请选择" size="mini">
                            <el-option v-for="item in administrativeArea" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search-item">
                        <div class="search-title">道路名:</div>
                        <el-select class="input" v-model="roadName" placeholder="请选择" size="mini" filterable :disabled="roadNameList.length == 0">
                            <el-option v-for="item in roadNameList" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </template>
                <template #footer>
                    <div
                        class="search-item"
                        style="margin-top: 10px; display: flex; justify-content: end;"
                    >
                        <el-button
                            type="primary"
                            size="mini"
                            @click="closeDialog"
                        >关闭</el-button>
                    </div>
                </template>
            </my-dialog>
        </div>
        <div class="right" v-if="false">
            <el-divider class="el-divider-mt" content-position="left">重点通道</el-divider>
            <div class="search-item" style="flex-direction: column; align-items: unset;">
                <div style="display: flex; align-items: center;">
                    <div class="search-title">开启:</div>
                    <el-radio-group v-model="roadWeb" size="mini" v-removeAriaHidden>
                        <el-radio :label="false">关闭</el-radio>
                        <el-radio :label="true">开启</el-radio>
                    </el-radio-group>
                </div>
                <div style="display: flex; align-items: center;">
                    <div class="search-item" style="flex-direction: column; align-items: unset;">
                        <el-button type="primary" size="mini" style="margin-top: 10px;"
                            @click="filterRoads">获取被排除的通道ID</el-button>
                    </div>
                </div>
                <!-- 通道列表 -->
                <div class="table-body" v-if="roadWeb">
                    <div v-for="(item, index) in tableData"
                        :class="selectedId == (index + 1) ? 'table-body-row active' : 'table-body-row'" :key="index"
                        @click.stop="handleRoadWebPick(index + 1, item)">
                        <div class="table-column txt_left">
                            <el-tooltip class="item" effect="dark" :content="item.name" placement="left">
                                <span><i class="el-icon-location"></i>{{ item.name || '--' }}</span>
                            </el-tooltip>
                        </div>
                        <div class="table-column">{{ item.cnt || '--' }}</div>
                    </div>
                </div>
            </div>
            <el-divider class="el-divider-mt" content-position="left">热力图</el-divider>
            <div class="search-item">
                <div class="search-title">开启:</div>
                <el-radio-group v-model="heatmap" size="mini" v-removeAriaHidden>
                    <el-radio :label="false">关闭</el-radio>
                    <el-radio :label="true">开启</el-radio>
                </el-radio-group>
            </div>
        </div>
    </div>
</template>

<script>
// VUEX 状态管理
import { mapState } from 'vuex'
// turf工具库
import * as turf from '@turf/turf'
// xlsx 插件
import * as XLSX from 'xlsx';
// vue-json-editor 插件
import JsonEditor from 'vue-json-editor'
// loading 状态组件
import myLoading from './components/loading.vue'
// 消息提示窗口
import myMsg from './components/my-msg.vue'
// Dialog弹窗
import myDialog from './components/my-dialog.vue'
// 右键菜单组件
import myContextMenu from './components/my-contextMenu.vue'
// list组件
import myList from './components/my-list.vue'
// 载入mixins文件
import { main } from './mixins/main.js'
import { utils } from './mixins/utils.js'
import { stater } from './mixins/stater.js';
import { markers } from './mixins/marker.js';
import { polyline } from './mixins/polyline.js';
import { polygon } from './mixins/polygon.js';
import { drawCircle } from './mixins/drawCircle.js';
import { drawPolygon } from './mixins/drawPolygon.js';
import { keyRoads } from './mixins/keyRoads.js';
import { heatMap } from './mixins/heatMap.js';
// api请求
import {
    getChengduDistrict,
    getRoadName,
    getRoadData
} from "@/api/maps/map.js";
import hotRoad from './roadWeb.json'
import echartPie from '@/components/echart/pie/index'
import sanyaData from './mixins/sanyadata.json'
import liuliangData from './mixins/liuliang.json'

// 原始重点通道数据
let roadPath2 = JSON.parse(JSON.stringify(hotRoad))

export default {
    name: "leafletMap",
    mixins: [
        main, // 地图主体
        utils, // 工具类
        stater, // 地图状态管理
        markers, // 地图标记
        polyline, // 多线段
        polygon, // 多边形区域，内部可有填充色
        drawCircle, // 绘制圆形
        drawPolygon, // 绘制多边形
        keyRoads, // 重点道路
        heatMap, // 热力图
    ],
    components: {
        JsonEditor,
        myContextMenu,
        myLoading,
        myMsg,
        myDialog,
        myList,
        echartPie
    },
    computed: {
        ...mapState({
            sidebar: state => state.app.sidebar,
        }),
    },
    data() {
        return {
            tempData: sanyaData,
            liuliangTempData: liuliangData,
            laoding: false,
            active: '0', // 当前激活的菜单tab id
            type: 'move', // 当前激活的菜单类型
            tabsMenu: [
                { id: 0, name: '移动', icon: 'el-icon-rank', type: 'move', content: '鼠标拖拽移动地图' },
                { id: 1, name: '清除', icon: 'el-icon-delete', type: 'clear', content: '清除所有图层' },
                { id: 2, name: '复制', icon: 'el-icon-document-copy', type: 'copy', content: '复制当前选中坐标' },
                { id: 3, name: '查询点分布', icon: 'el-icon-location-information', type: 'marker', content: '地图添加标记点' },
                { id: 4, name: '查询线/折线', icon: 'el-icon-edit-outline', type: 'lines' },
                { id: 5, name: '查询区域围栏', icon: 'el-icon-menu', type: 'polygon' },
                { id: 6, name: '绘制圆形', icon: 'el-icon-coin', type: 'drawCircle' },
                { id: 7, name: '绘制多边形', icon: 'el-icon-crop', type: 'drawPolygon' },
            ],
            mapType: 'osm',
            typeOption: [
                {
                    label: '查询线/折线',
                    value: 'lines',
                },
                {
                    label: '查询点分布',
                    value: 'marker',
                },
                {
                    label: '查询区域围栏',
                    value: 'polygon',
                }
            ],
            roadWeb: false,
            roadWebData: [],
            drawPolygon: false, // 绘制多边形
            tableData: [],
            jsonData: [],
            intervals: [],
        };
    },
    watch: {
        'sidebar.opened': function (val) {
            // setTimeout(() => {

            // }, 300)
        },
        'heatmap': function (val) {
            if (val) {
                this.laoding = true
                setTimeout(() => {
                    this.handleHeatMap([{ "lat": 30.80337, "lng": 104.220135, "value": 1.2847222222 }])
                    this.laoding = false
                }, 2000)
            } else {
                this.map.removeLayer(this.heatmapLayer)
                this.heatmapLayer = {}
            }
        },
        'jsonData': function (val) {
            if (val.length == 0) return
            if (this.type === 'lines') {
                this.handlePolyline();
            }
            if (this.type === 'marker') {
                this.handleMarker();
            }
            if (this.type === 'polygon') {
                this.hangleMultiPolygon();
            }
        },
        // 根据选择的行政区域查询道路
        'administrativeAreaValue': function (val) {
            if (val) {
                this.getProvinceRoadName(val);
            }
        },
        // 根据选择的道路查询道路数据
        'roadName': function (val) {
            if (val) {
                this.getProvinceRoadData(val)
            }
        }
    },
    created() {
        // 窗口大小变化，重绘Echart图表
        window.addEventListener('resize', () => {
            // 调整地图大小
            this.map.invalidateSize();
        });
        // 添加拖拽结束的监听事件
        document.addEventListener('mouseup', this.handleMouseUp);
    },
    beforeDestroy() {

    },
    mounted() {
        // 行政区域
        // getChengduDistrict().then(res => {
        //     this.handleFilterArea(cdFence);
        // })
    },
    methods: {
        // 筛选按钮拖拽
        handleMove() {
            // 设置拖拽状态为true
            this.isDragging = true;
        },
        handleDrawer() {
            // 创建计时器，如果是点击，则执行点击事件
            this.clickTimer = setTimeout(() => {
                if (!this.isDragging) {
                    // 点击事件的处理逻辑
                    this.drawer = true
                }
            }, 100); // 设置点击的最大延迟时间
        },
        handleMouseUp() {
            // 当拖拽操作结束时，清除计时器并设置拖拽状态为false
            clearTimeout(this.clickTimer);
            this.isDragging = false;
        },
        handleClose() {
            this.checkboxList = [];
            this.drawer = false;
        },
        // 关闭 dialog 窗口
        closeDialog() {
            this.isVisble = false;
            this.isEditVisble = false;
        },
        // 获取行政区下所有路名
        getProvinceRoadName(name = '') {
            if (name) {
                this.roadNameList = [];
                this.laoding = true
                getRoadName({ province: name }).then(res => {
                    this.laoding = false
                    if (~~res?.code == 200) {
                        const data = res?.data || [];
                        for (let i = 0; i < data.length; i++) {
                            this.roadNameList.push({
                                label: data[i],
                                value: data[i]
                            })
                        }
                    }
                }).catch((e) => {
                    this.laoding = false
                })
            }
        },
        // 获取指定道路的数据
        getProvinceRoadData(name = '') {
            if (name == '') return
            this.laoding = true
            getRoadData({ road_name: name }).then(res => {
                this.laoding = false
                if (~~res?.code == 200) {
                    let data = res?.data || [];
                    data.forEach(item => {
                        item.name = name;
                        item.cnt = item.cnt || 0;
                        item.line_string = [JSON.parse(item.geometry).coordinates] || [];
                        delete item.geometry;
                    })
                    this.handleRoadWeb(data);
                    // 添加到 checkbox list
                    this.checkboxList.push(data)
                }
            }).catch((e) => {
                this.laoding = false;
            })
        },
        // 点击地图菜单
        handleClickMenu(id, type) {
            this.type = type;
            const that = this;
            const doms = document.getElementsByClassName('switch-item');
            this.isContextMenuVisible = false;
            if (this.active == Number(id)) return
            // 清除所有菜单选中状态
            for (let i = 0; i < doms.length; i++) {
                doms[i].classList.remove('active');
            }
            // 选择 复制 、 清除 按钮后，默认选中第一个菜单“移动”
            if (type == 'copy' || type == 'clear') {
                // setTimout在这里是为了展示出两个按钮切换时的样式
                setTimeout(() => {
                    that.active = '0';
                    return
                }, 50)
            }
            // 选中当前点击的按钮
            this.active = Number(id);

            //取消监听事件
            this.map.off("mousedown");
            this.map.off("mouseup");
            this.map.off("mousemove");
            this.map.off("dblclick");
            this.map.off("click");
            this.map.off("dblclick");

            // 拖拽地图启用
            this.map.dragging.enable();
            // 根据选择类型启用绘图功能
            // 移动拖拽地图
            if (type == 'move') {
                this.closeDialog();
            }

            // 清除地图图层
            if (type == 'clear') {
                this.clearMap();
                this.map.remove()
                this.closeDialog();
                this.init(); // 重新渲染地图
                return
            }

            // 查询点分布
            if (type == 'marker') {
                this.isEditVisble = true;
            }

            // 查询线/折线分布
            if (type == 'lines') {
                this.isEditVisble = true;
            }

            // 查询区域围栏
            if (type == 'polygon') {
                this.isEditVisble = true;
            }

            // 绘制圆形区域
            if (type == 'drawCircle') {
                this.drawCircleFunc();
                return
            }

            // 绘制多边形区域
            if (type == 'drawPolygon') {
                this.drawPolygonFunc();
                return
            }
        },
        setTrafficStatus(data) {
            let status = '#499c20'
            let intervalColor = []
            for (let i = 0; i < this.intervals.length; i++) {
                const arr = this.intervals[i].split('--')
                intervalColor.push(arr)
            }
            if (Number(data) > intervalColor[0][0] * 0.2 && Number(data) <= intervalColor[0][1] * 0.2) {
                status = '#499c20'
            }
            if (Number(data) > intervalColor[1][0] * 0.2 && Number(data) <= intervalColor[1][1] * 0.2) {
                status = '#E6A23C'
            }
            if (Number(data) > intervalColor[2][0] * 0.2 && Number(data) <= intervalColor[2][1] * 0.2) {
                status = '#F56C6C'
            }
            if (Number(data) > intervalColor[3][0] * 0.2 && Number(data) <= intervalColor[3][1] * 0.2) {
                status = 'rgb(245, 30, 30)'
            }
            if (Number(data) > intervalColor[4][0] * 0.2) {
                status = 'rgb(110, 1, 1)'
            }
            return status
        },
        getColor(index) {
            index = index + 1
            let text = 'color green'
            if (index == 1) {
                text = 'color green'
            }
            if (index == 2) {
                text = 'color yellow'
            }
            if (index == 3) {
                text = 'color red1'
            }
            if (index == 4) {
                text = 'color red2'
            }
            if (index == 5) {
                text = 'color red3'
            }
            return text
        },
        splitIntoFive(number) {
            let interval = number / 5;
            let intervals = [];
            for (let i = 0; i < 5; i++) {
                let start = i * interval;
                let end = start + interval;
                intervals.push(parseInt(start) + '--' + parseInt(end));
            }
            this.intervals = intervals;
        },
    }
};
</script>

<style scoped lang="scss">
.custom-marker {
    background-color: black;
    color: white;
    padding: 5px;
    border-radius: 3px;
    text-align: center;
    display: inline-block;
}
.custom-marker .icon {
    display: inline-block;
    margin-right: 5px;
}
.tools-leaflet-container {
    cursor: pointer;
    width: 100%;
    height: calc(100vh - 84px);
    background-color: #011a33;
    box-sizing: border-box;
    padding: 10px 10px;
    display: flex;
    justify-content: center;

    // 左侧地图
    .left {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        position: relative;

        // 工具菜单
        .filter-switch {
            width: auto;
            height: 30px;
            line-height: 30px;
            border-radius: 30px;
            padding: 5px 20px;
            font-size: 12px;
            font-weight: bold;
            color: aliceblue;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 999;
            background-color: rgba(0, 0, 0, 0.2);
            /* 半透明黑色背景 */
            backdrop-filter: blur(10px);
            /* 毛玻璃效果 */
            -webkit-backdrop-filter: blur(10px);
            /* 兼容Safari */

            .switch-item {
                width: auto;
                padding: 5px 5px;
                margin-right: 5px;
                opacity: 1;
                line-height: 1;
            }

            .switch-item:hover {
                cursor: pointer;
                border-radius: 30px;
                background-color: rgba(24, 144, 255, 0.8);
                backdrop-filter: blur(30px);
                /* 毛玻璃效果 */
            }

            .active {
                border-radius: 30px;
                background-color: rgba(24, 144, 255, 0.8);
                backdrop-filter: blur(30px);
                /* 毛玻璃效果 */
            }
        }

        .map {
            width: 100%;
            height: 100%;
        }


        // 筛选条件
        .flex-direction-column {
            flex-direction: column;
        }

        .search-item {
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 10px;

            .search-row {
                width: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 5px;
            }

            .el-input,
            .el-select {
                width: calc(100% - 140px)
            }

            .el-radio {
                color: #fff;
            }

            .search-title {
                width: 90px;
                font-size: 14px;
                text-align: right;
                color: #000;
                box-sizing: border-box;
                padding-right: 5px;
            }
        }

        // 经纬度数据
        .json-place {
            width: 100%;
            height: auto;
            padding: 10px 10px;
            box-sizing: border-box;
        }

        // 拾取经纬度
        .pickupLnglat {
            width: auto;
            height: 40px;
            line-height: 40px;
            border-radius: 40px;
            color: #fff;
            font-size: 20px;
            font-weight: bold;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            position: absolute;
            left: 50%;
            bottom: 3%;
            -webkit-transform: translate(-50%, 0%);
            transform: translate(-50%, 0%);
            padding: 0px 20px;

            .closeLatlngTip {
                width: 70px;
                height: 70px;
                position: absolute;
                right: -55px;
                top: -10px;
                color: rgb(92, 92, 92);
                cursor: pointer;
            }
        }
    }

    // 路网表格
    .table-body {
        width: 100%;
        height: 600px;
        overflow-y: auto;

        .table-body-row {
            width: 100%;
            height: 43px;
            line-height: 43px;
            text-align: center;
            box-sizing: border-box;
            padding-left: 15px;
            border-bottom: 1px #013968 solid;
            border-left: 1px #013968 solid;
            border-right: 1px #013968 solid;
            display: flex;
            justify-content: flex-start;
        }

        .table-body-row:hover {
            cursor: pointer;
            box-shadow: 3px 3px 5px rgba(230, 159, 249, 0.3);
            background: linear-gradient(to right, rgba(216, 100, 248, 0.1) 30%, rgba(216, 100, 248, 0.7) 50%) right;
            background-size: 120%;
            transition: .5s ease-in-out;

            /* 应用动画到元素 */
            .bouncy {
                animation: bounce 0.7s infinite;
            }
        }

        .active {
            background-color: rgba(216, 100, 248, 0.7);
            font-size: 15px;
        }

        .txt_left {
            text-align: left;
        }

        /* 定义弹跳动画 */
        @keyframes bounce {

            0%,
            100% {
                transform: translateY(0);
            }

            50% {
                transform: translateY(-5px);
            }
        }
    }

    .table-column {
        width: calc(100% / 2);
        height: 100%;
        color: #fff;
        overflow: hidden;
        /* 确保溢出的内容会被隐藏 */
        white-space: nowrap;
        /* 确保文本在一行内显示，不换行 */
        text-overflow: ellipsis;
        /* 使用省略号表示文本溢出 */
    }

}

// color bar
.colorbar {
    padding: 10px 10px;
    background-color: rgb(0 0 0 / 60%);
    border-radius: 4px 4px;
    -webkit-box-shadow: 3px 3px 3px rgb(0 0 0 / 60%);
    box-shadow: 3px 3px 3px rgb(0 0 0 / 60%);
    position: absolute;
    top: 10px;
    right: 10%;
    color: #fff;
    z-index: 999;
    .colorbar-item {
        font-size: 12px;
        font-weight: bold;
        display: flex;
        justify-content: left;
        margin-top: 5px;

        // 蓝色
        .blue {
            background-color: #6f6cfb;
        }

        // 绿色
        .green {
            background-color: #499c20;
        }

        // 黄色
        .yellow {
            background-color: #E6A23C;
        }

        // 红色
        .red1 {
            background-color: #e00000;
        }

        .red2 {
            background-color: #961e1e;
        }

        .red3 {
            background-color: #490000;
        }

        .title {
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

::v-deep .radius-label-text {
    display: block;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 5px;
    border-radius: 5px;
    font-size: 10px;
    font-weight: bold;
    width: auto !important;
    min-width: 100px !important;
    height: auto !important;
}

::v-deep .jsonEditor {
    width: 300px;
    height: 500px;
}

::v-deep .json-place {
    height: 100% !important;
}

::v-deep .jsoneditor-vue {
    width: 100%;
    height: 100%;
}

::v-deep .jsoneditor-poweredBy {
    display: none;
}

#pie-chart-container {
    width: 300px;
    height: 300px;
    position: absolute;
    top: 10%;
    right: 5%;
    z-index: 999;
}
</style>
