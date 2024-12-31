<template>
	<div class="map-container-leaflet">
		<div id="map"></div>
	</div>
</template>

<script>
	import {
		reactive,
		ref,
		onBeforeMount,
		onMounted,
		onBeforeUpdate,
		onUpdated,
		getCurrentInstance, // 获取当前组件的实例
	} from 'vue';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';

	export default {
		name: 'map-leaflet',
		components: {},
		setup() {
			const app = getCurrentInstance(); // 获取当前组件的实例
			const map_cover = ref([]);
			const refRac = reactive({
				map: {},
			});

			function init() {
				// 初始化地图实例
				refRac.map = L.map('map', {
					preferCanvas: false
				}).setView([30.662325, 104.065716], 9);
				// 移除默认的放大缩小按钮
				refRac.map.removeControl(refRac.map.zoomControl);
				refRac.map.removeControl(refRac.map.attributionControl);
				// 监听地图缩放事件
				refRac.map.on('zoomend', function() {
					handleMapZoomend();
				})
				refRac.map.on('dragend', function() {
					handleMapZoomend();
				})
				
				// 设置地图类型
				setMapType('osm')
			}

			function setMapType(type) {
				if (!type) type = 'osm'
				// 高德底图
				if (type === 'amap') {
					const tiles = L.tileLayer(
						'https://wprd03.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=7&ltype=11', {
							maxZoom: 18,
							attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
						}).addTo(refRac.map);
					return
				}

				// OSM底图
				const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
					maxZoom: 19,
					attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				}).addTo(refRac.map);
			}
			
			// function: 在地图可视区域上增加深色遮罩
			function handleMapZoomend() {
				clearMap(map_cover.value);
				// 获取当前地图的边界
				const bounds = refRac.map.getBounds();
				// 获取四个角的经纬度
				const northWest = bounds.getNorthWest(); // 左上角
				const northEast = bounds.getNorthEast(); // 右上角
				const southWest = bounds.getSouthWest(); // 左下角
				const southEast = bounds.getSouthEast(); // 右下角
				// 创建半透明矩形图层
				const rectangle = L.rectangle([
					[northWest.lat, northWest.lng],
					[southEast.lat, southEast.lng]
				], {
					color: 'transparent', // 边框颜色
					weight: 0, // 边框宽度
					fillColor: 'black', // 填充颜色
					fillOpacity: 0.1 // 填充透明度
				}).addTo(refRac.map);
				map_cover.value.push(rectangle)
			}
			
			// 清除地图覆盖物
			// data参数：当前需要清理的覆盖物图层，数据类型只能是Array
			const clearMap = (data) => {
				for (let i = 0; i < data.length; i++) {
					refRac.map.removeLayer(data[i]);
				}
			}

			function handleAmap() {
				setMapType('amap')
			}

			function handleOSM() {
				setMapType('osm')
			}

			onBeforeMount(() => {

			});

			onMounted(() => {
				init();
			});

			onBeforeUpdate(() => {

			});

			onUpdated(() => {

			});


			return {
				// 函数
				init,
				handleAmap,
				handleOSM,
				handleMapZoomend,
				clearMap
			};
		}
	}
</script>

<style scoped>
	.map-container-leaflet {
		width: 100%;
		height: 100%;
		background-color: #f5f5f5;

		#map {
			width: 100%;
			height: 100%;
		}

		.top {
			position: absolute;
			top: 10px;
			right: 10px;
		}
	}
</style>