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
			// const map = ref(null);
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
				// 鼠标点击地图拾取经纬度
				refRac.map.removeControl(refRac.map.attributionControl);
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
			
			// 清除地图覆盖物
			const clearMap = () => {
				
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
				handleOSM
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