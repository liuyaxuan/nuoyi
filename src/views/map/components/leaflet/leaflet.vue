<template>
	<div class="map-container-leaflet">
		<!-- leaflet map container -->
		<div id="map"></div>
		<!-- 接收输入数据多行文本框 -->
		<my-textarea
			:disabled="state.type === ''"
			:handleMapData="handleMapData"
		></my-textarea>
		<!-- 地图功能选项菜单 -->
		<my-maphistory
			:map="state.map"
		></my-maphistory>
		<!-- 地图配置项 -->
		<my-config></my-config>

		<!-- 工具栏 -->
		<div class="map-tools">
			<div :class="state.type === 'marker' ? 'map-tools-item map-tools-item-active' : 'map-tools-item'" @click="handleDraw('marker')">标记</div>
			<div :class="state.type === 'line' ? 'map-tools-item map-tools-item-active' : 'map-tools-item'" @click="handleDraw('line')">轨迹</div>
			<div :class="state.type === 'polygon' ? 'map-tools-item map-tools-item-active' : 'map-tools-item'" @click="handleDraw('polygon')">区域</div>
		</div>
	</div>
</template>

<script setup >
	import {
		reactive,
		ref,
		onBeforeMount,
		onMounted,
		onBeforeUpdate,
		onUpdated,
		watch,
		getCurrentInstance, // 获取当前组件的实例
		defineOptions,
		defineProps,
		defineComponent,
	} from 'vue';
	// leaflet map
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	// 引入 leaflet.markercluster
	import "leaflet.markercluster/dist/MarkerCluster.css"
	import "leaflet.markercluster/dist/MarkerCluster.Default.css"
	import "leaflet.markercluster";
	// 导入leaflet-heat
	import 'leaflet.heat';
	// 导入leaflet-polylinedecorator
	import  "leaflet-polylinedecorator";
	// 页面组件
	import myTextarea from './compo/textarea.vue'
	import myMaphistory from './compo/history.vue'
	import myConfig from './compo/config.vue'
	// 组合式函数
	import { useMarker } from './fns/marker.js'
	import { usePolyline } from './fns/lines.js'
	import { usePolygon } from './fns/polygon.js'

	defineOptions({
		name: 'mapLeaflet'
	})
	// 定义props
	const props = defineProps({
		
	})
	// 注册组件
	defineComponent({
		components: {
			myTextarea,
			myMaphistory,
			myConfig
		}
	})
	
	// 声明状态
	const app = getCurrentInstance(); // 获取当前组件的实例
	const map_cover = ref([]); // 地图深色遮罩
	const mapLayer = ref([]); // 绘制到地图的各layer层
	const state = reactive({
		map: {}, // 地图实例
		data: null, // 输入数据
		type: '', // 绘制类型
	});

	const init = () => {
		// 初始化地图实例
		state.map = L.map('map', {
			preferCanvas: false
		}).setView([30.662325, 104.065716], 9);
		// 移除默认的放大缩小按钮
		state.map.removeControl(state.map.zoomControl);
		state.map.removeControl(state.map.attributionControl);
		// 监听地图缩放事件
		state.map.on('zoomend', function() {
			handleMapZoomend();
		})
		state.map.on('dragend', function() {
			handleMapZoomend();
		})
		
		// 设置地图类型
		setMapType('osm');
		// 地图设置遮罩
		handleMapZoomend();
	}

	const setMapType = (type) => {
		if (!type) type = 'osm'
		// 高德底图
		if (type === 'amap') {
			const tiles = L.tileLayer(
				'https://wprd03.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&style=7&ltype=11', {
					maxZoom: 18,
					attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				}).addTo(state.map);
			return
		}

		// OSM底图（浅色）
		// const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		// 	maxZoom: 19,
		// 	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		// }).addTo(state.map);

		// Mapbox底图（深色）
		// const tiles = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoieGlhb3lpbmdsaSIsImEiOiJjangxM2NuZWcwNW0yNDNxcnZ2MWg4eWVxIn0.iL97JjzDipkcocfVTVbHfw", {
		// 	maxZoom: 19,
		// 	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		// }).addTo(state.map);

		// Mapbox底图（彩色卫星图）
		// const tiles = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoieGlhb3lpbmdsaSIsImEiOiJjangxM2NuZWcwNW0yNDNxcnZ2MWg4eWVxIn0.iL97JjzDipkcocfVTVbHfw", {
		// 	maxZoom: 19,
		// 	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		// }).addTo(state.map);
		
		// stadiamaps底图（深色）
		const tiles = L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png", {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(state.map);
	}
	
	// function: 在地图可视区域上增加深色遮罩
	const handleMapZoomend = () => {
		clearMap(map_cover.value);
		// 获取当前地图的边界
		const bounds = state.map.getBounds();
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
			fillColor: 'rgb(49, 62, 106)', // 填充颜色
			fillOpacity: 0 // 填充透明度
		}).addTo(state.map);
		map_cover.value.push(rectangle)
	}
	
	// 清除地图覆盖物
	// data参数：当前需要清理的覆盖物图层，数据类型只能是Array
	const clearMap = (data) => {
		for (let i = 0; i < data.length; i++) {
			state.map.removeLayer(data[i]);
		}
	}

	const handleAmap = () => {
		setMapType('amap')
	}

	const handleOSM = () => {
		setMapType('osm')
	}

	/**
	 * 工具栏选项
	 */
	const handleDraw = (type) => {
	    state.type = type;
		if (state.data) {
			handleMapData(state.data);
		}
	}

	const checkType = (data, type) => {
		// 检查传入的数据是否为数组
		if (Array.isArray(data)) {
			// 遍历数组中的每个对象
			for (let item of data) {
			// 检查每个对象的 type 属性是否为 MultiLineString
			if (item.type !== type) {
				return false; // 如果存在非 MultiLineString 的 type 属性值，返回 false
			}
			}
		} else {
			// 如果传入的数据不是数组，直接检查 type 属性
			if (data.type !== type) {
				return false; // 如果 type 属性不是 MultiLineString，返回 false
			}
		}
		return true; // 如果所有 type 属性都是 MultiLineString，返回 true
		}
	
	/**
	 * 地图layer绘制，接收输入数据
	 * @param {Array, Object} data 输入数据
	 */
	const handleMapData = (data) => {
		// 接收输入
		state.data = data || [];
		// 检查输入数据类型
		if (!data) {
			return
		}
		if (state.type === 'polygon' && !checkType(data, 'MultiPolygon')) {
			console.log('请输入数据中存在 type 不为 MultiPolygon 的数据')
			return
		}
		if (state.type === 'line' && !checkType(data, 'MultiLineString')) {
			console.log('请输入数据中存在 type 不为 MultiLineString 的数据')
			return
		}
		if (state.type === 'marker' && (checkType(data, 'MultiLineString') || checkType(data, 'MultiPolygon'))) {
			console.log('请输入数据中存在 type 不为 marker 的数据')
			return
		}
		// 绘制
		if(state.type === 'polygon') {
			usePolygon(state.map, state.data);
			return
		}

		if (state.type === 'line') {
			usePolyline(state.map, state.data);
			return
		}

		if (state.type === 'marker') {
			useMarker(state.map, state.data);
			return
		}
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
</script>

<style scoped lang="less">
	.map-container-leaflet {
		width: 100%;
		height: 100%;
		background-color: #f5f5f5;
		position: relative;

		#map {
			width: 100%;
			height: 100%;
		}

		.top {
			position: absolute;
			top: 10px;
			right: 10px;
		}

		// 地图工具栏
		.map-tools {
			position: absolute;
			top: 10px;
			left: 0;
			z-index: 999;
			background-color: #fff;
			padding: 10px;
			border-radius: 0 5px 5px 0;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
			display: flex;
			flex-direction: column;
			align-items: center;

			.map-tools-item {
				width: 40px;
				height: 40px;
				margin: 5px 0;
				font-size: 12px;
				font-weight: bold;
				color: #3f9eff;
				background-color: #f5f5f5;
				border-radius: 5px;
				display: flex;
				justify-content: center;
				align-items: center;
				cursor: pointer;

				&:hover {
					color: #fff;
					background-color: #3f9eff;
					animation: pulse 0.5s infinite;
				}

				@keyframes pulse {
					0% {
						transform: scale(1);
					}
					50% {
						transform: scale(1.2);
					}
					100% {
						transform: scale(1);
					}
				}
			}

			.map-tools-item-active {
				color: #fff;
				transform: scale(1.2);
				background-color: #3f9eff;
			}
		}
	}
</style>