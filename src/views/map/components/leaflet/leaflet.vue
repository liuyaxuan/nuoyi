<template>
	<div class="map-container-leaflet">
		<!-- leaflet map container -->
		<div id="map"></div>
		<!-- 接收输入数据多行文本框 -->
		<my-textarea
			:handleMapData="handleMapData"
		></my-textarea>
		<!-- 地图功能选项菜单 -->
		<my-maphistory
			:map="state.map"
		></my-maphistory>
		<!-- 地图配置项 -->
		<my-config></my-config>
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
		getCurrentInstance, // 获取当前组件的实例
		defineOptions,
		defineProps,
		defineComponent,
	} from 'vue';
	// leaflet map
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	// 页面组件
	import myTextarea from './compo/textarea.vue'
	import myMaphistory from './compo/history.vue'
	import myConfig from './compo/config.vue'
	// 组合式函数
	import { useMarker } from './fns/marker.js'

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
		data: [], // 输入数据
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

		// OSM底图
		const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
			fillOpacity: 0.1 // 填充透明度
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
	 * 地图layer绘制，接收输入数据
	 * @param {Array, Object} data 输入数据
	 */
	const handleMapData = (data) => {
		// 接收输入
		state.data = data || [];
		// 增加layer绘制类型判断
		useMarker(state.map, state.data);
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
	}
</style>