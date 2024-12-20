/**
 * @param {object} options
 * @description leaflet map 主入口，创建地图实例
 */

// 导入 leaflet
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// 引入 leaflet.markercluster
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import "leaflet.markercluster";
// 导入leaflet-heat
import 'leaflet.heat';
// 导入leaflet-polylinedecorator
import  "leaflet-polylinedecorator"
// 导入leaflet-contextmenu
import "leaflet-contextmenu/dist/leaflet.contextmenu.css";
import "leaflet-contextmenu/dist/leaflet.contextmenu";

export const main = {
    data() {
        return {
            mouseMoveTimer: false,           
            isClickPickLnglat: false, 
        }  
    },
    created() {
        const that = this;
        // 右键菜单
        document.addEventListener('contextmenu', function(event) {
            // 阻止默认的右键菜单显示
            event.preventDefault();
            // 展示右键菜单，设置菜单位置
            that.$nextTick(() => {
                that.isContextMenuVisible = true;
                that.pageX = event.pageX;
                that.pageY = event.pageY;
            })
        });
    },
    mounted() {
        this.init();
    },

    methods: {
        // 初始化地图
        init() {
            const that = this;
            this.map = L.map('map', {
                preferCanvas: false,
                // 右键菜单
                contextmenu: false,
                contextmenuWidth: 140,
                contextmenuKeepOpen: false,
                contextmenuZIndex: 1000,
                contextmenuItems: [{
                    text: '瓦片底图',
                    callback: function () {
                        that.handleShowDialog('mapType')
                    }
                }, '-' ,{
                    text: '搜索指定道路',
                    callback: function () {
                        that.handleShowDialog('mapSearch')
                    }
                }]
            }).setView([30.662325, 104.065716], 9);
            // 移除默认的放大缩小按钮
            this.map.removeControl(this.map.zoomControl);
            // 鼠标点击地图拾取经纬度
            this.map.on("click", ({ latlng }) => {
                that.isContextMenuVisible = false; // 隐藏右键菜单
                this.isClickPickLnglat = true;
                this.setState('pickupLnglat', Number(latlng.lng).toFixed(6) + ',' + Number(latlng.lat).toFixed(6));
            })
            // 设置地图类型
            this.setMapType()
        },

        // 设置地图类型
        setMapType() {
            // 移除默认的版权控件
            this.map.attributionControl.setPrefix('地图类型: ' + this.mapType);
            this.map.removeControl(this.map.attributionControl);
            // 高德
            if (this.mapType === 'amap') {
                const tiles = L.tileLayer('https://wprd03.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=7&ltype=11', {
                    maxZoom: 18,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(this.map);
            }

            // openstreetmap
            if (this.mapType === 'osm') {
                const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(this.map);
            }
        },

        // 清除地图上的所有覆盖物
        clearMap() {
            for (let i = 0; i < this.current.length; i++) {
                this.map.removeLayer(this.current[i]);
            }
        },

        // 复制经纬度
        copySuccess() {
            this.$message.success('复制成功')
        },

        // 清除经纬度
        handleClearPickupLnglat() {
            this.isClickPickLnglat = false;
            this.setState('pickupLnglat', '');
        },
    }
}