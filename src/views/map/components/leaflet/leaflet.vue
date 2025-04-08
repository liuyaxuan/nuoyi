<template>
	<div ref="leafletMap" class="map-container-leaflet">
		<!-- leaflet map container -->
		<div id="map"></div>
		<!-- 下载图片时，隐藏template 中的工具菜单和配置菜单 -->
		<template v-if="visibleConfig">
			<!-- 接收输入数据多行文本框 -->
			<my-textarea
				:disabled="state.type === ''"
				:handleMapData="handleMapData"
			></my-textarea>
			<!-- 地图功能选项菜单 -->
			<my-maphistory
				:map="state.map"
				:data="state.listData"
				:handleMapData="handleMapData"
			></my-maphistory>
			<!-- 地图配置项 -->
			<my-config></my-config>
			<!-- 弹窗 -->
			<ny-dialog
				:title='dialog.title'
				:show="dialog.isVisible"
				:width="400"
				@close="dialog.isVisible = false"
			>
				<label>选择省:</label>
				<select class="select-province" v-model="selectedProvince" @change="handleProvinceChange">
					<option value="">请选择</option> <!-- 默认选项 -->
					<option
						class="province-item"
						v-for="item in provinces"
						:key="item.code"
						:value="item.code"
					>{{ item.name }}</option>
				</select>
			</ny-dialog>

			<!-- 工具栏 -->
			<div class="map-tools">
				<div
					:class="state.type === 'marker' ? 'map-tools-item map-tools-item-active' : 'map-tools-item'"
					@mouseover="tipsType = 'marker'"
					@mouseleave="tipsType = ''"
					@click="handleDraw('marker')"
				>
					<img :src="markerIcon" />
					<div class="map-tools-item-name" v-if="tipsType === 'marker'">坐标点</div>
				</div>
				<div
					:class="state.type === 'line' ? 'map-tools-item map-tools-item-active' : 'map-tools-item'"
					@mouseover="tipsType = 'line'"
					@mouseleave="tipsType = ''"
					@click="handleDraw('line')"
				>
					<img :src="lineIcon" />
					<div class="map-tools-item-name" v-if="tipsType === 'line'">线</div>
				</div>
				<div
					:class="state.type === 'polygon' ? 'map-tools-item map-tools-item-active' : 'map-tools-item'"
					@mouseover="tipsType = 'polygon'"
					@mouseleave="tipsType = ''"
					@click="handleDraw('polygon')"
				>
					<img :src="polygonIcon" />
					<div class="map-tools-item-name" v-if="tipsType === 'polygon'">区域</div>
				</div>
				<div
					:class="state.type === 'drawnPolygon' ? 'map-tools-item map-tools-item-active' : 'map-tools-item'"
					@mouseover="tipsType = 'drawnPolygon'"
					@mouseleave="tipsType = ''"
					@click="handleDraw('drawnPolygon')"
				>
					<img :src="drawnPolygonIcon" />
					<div class="map-tools-item-name" v-if="tipsType === 'drawnPolygon'">绘制多边形</div>
				</div>
				<div
					:class="state.type === 'drawCircle' ? 'map-tools-item map-tools-item-active' : 'map-tools-item'"
					@mouseover="tipsType = 'drawCircle'"
					@mouseleave="tipsType = ''"
					@click="handleDraw('drawCircle')"
				>
					<img :src="drawCircleIcon" />
					<div class="map-tools-item-name" v-if="tipsType === 'drawCircle'">绘制圆形</div>
				</div>
				<div
					:class="state.type === 'search' ? 'map-tools-item map-tools-item-active' : 'map-tools-item'"
					@mouseover="tipsType = 'search'"
					@mouseleave="tipsType = ''"
					@click="handleDraw('search')"
				>
					<img :src="searchIcon" />
					<div class="map-tools-item-name" v-if="tipsType === 'search'">搜索</div>
				</div>
				<div
					:class="state.type === 'download' ? 'map-tools-item map-tools-item-active' : 'map-tools-item'"
					@mouseover="tipsType = 'download'"
					@mouseleave="tipsType = ''"
					@click="downloadImg('download')"
				>
					<img :src="downloadIcon" />
					<div class="map-tools-item-name" v-if="tipsType === 'download'">地图快照</div>
				</div>
			</div>
		</template>
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
	// 引入 vuex
	import { useStore } from 'vuex'
	// api请求
	import {
		getRoadName,
		getRoadData
	} from "@/api/map/road.js";
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
	//	导入 leaflet-bigimage
	import "leaflet.bigimage/dist/Leaflet.BigImage.min.js";
	import "leaflet.bigimage/dist/Leaflet.BigImage.min.css";
	// 导入 leaflet-image
	import leafletImage from 'leaflet-image';
	// 导入 dom-to-image
	import domtoimage from 'dom-to-image';
	// 页面组件
	import myTextarea from './compo/textarea.vue'
	import myMaphistory from './compo/history.vue'
	import myConfig from './compo/config.vue'
	import nyDialog from '@/components/dialog/index.vue'
	// 组合式函数
	import { useMarker } from './fns/marker.js'
	import { usePolyline } from './fns/lines.js'
	import { usePolygon } from './fns/polygon.js'
	import { useDrawPolygon } from './fns/drawnPolygon.js'
	import { useDrawCircle } from './fns/drawCircle.js'
	// 行政区域名称配置
	import { provinces } from '@/utils/config.js'
	// icon
	import markerIcon from '@/assets/icons/blue/marker.svg'
	import lineIcon from '@/assets/icons/blue/line.svg'
	import polygonIcon from '@/assets/icons/blue/polygon.svg'
	import drawnPolygonIcon from '@/assets/icons/blue/editPolygon.svg'
	import drawCircleIcon from '@/assets/icons/blue/bubble-chart.svg'
	import searchIcon from '@/assets/icons/blue/search.svg'
	import downloadIcon from '@/assets/icons/blue/download.svg'

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
	const store = useStore();
	const app = getCurrentInstance(); // 获取当前组件的实例
	const map_cover = ref([]); // 地图深色遮罩
	const mapLayer = ref([]); // 绘制到地图的各layer层
	const state = reactive({
		map: {}, // 地图实例
		bigImage: null, // 下载地图实例
		data: null, // 输入数据
		type: '', // 绘制类型
		listData: [], // 数据列表
		isVisible: false, // 弹窗显示
	});
	const dialog = reactive({
		isVisible: false, // 弹窗显示
	})
	const visibleConfig = ref(true); // 是否下载图片中
	const leafletMap = ref(null); // refs获取leafletMap的引用
	const selectedProvince = ref(''); // 选中的省份
	const tipsType = ref(''); // 鼠标悬停提示

	watch(() => state.type, (newVal, oldVal) => {
	    if (newVal === 'download') {
			document.querySelector('.leaflet-control-container').style.display = 'block';
		} else {
			document.querySelector('.leaflet-control-container').style.display = 'none'
		}
	})

	const init = () => {
		// 初始化地图实例
		state.map = L.map('map', {
			preferCanvas: true
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

	const downloadImg = () => {
		store.commit('system/SET_LOADING', true);
		setTimeout(() => {
			visibleConfig.value = false;
			const options = {
				style: {
					margin: '0'
				},
				filter: null,
				quality: 1,
				cacheBust: true,
				useCORS: true
			};
			domtoimage.toPng(leafletMap.value, options) // 将DOM节点转换为PNG图片
			.then(function (dataUrl) {
				let link = document.createElement('a'); // 创建一个a元素来下载图片
				link.download = 'screenshot.png'; // 设置下载文件名
				link.href = dataUrl; // 设置下载链接为图片的dataURL
				link.click(); // 模拟点击下载图片
				visibleConfig.value = true;
				store.commit('system/SET_LOADING', false);
			})
			.catch(function (error) {
				store.commit('system/SET_LOADING', false);
				console.error('wrong!', error);
			});
		}, 3000)
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
		if (type === 'search') {
			dialog.title = '选择省(直辖市)';
			dialog.isVisible = true;
			return
		}
		if (type == 'drawnPolygon') {
			useDrawPolygon(state.map);
			return
		}
		if (type == 'drawCircle') {
			useDrawCircle(state.map);
			return
		}
		if (state.data) {
			handleMapData(state.data);
		}
	}

	// 选择省份
	const handleProvinceChange = (data) => {
		getRoadName({ province: selectedProvince.value }).then(res => {
			if (~~res?.code == 200) {
				const data = res?.data || [];
				console.log(data)
				for (let i = 0; i < data.length; i++) {
					// this.roadNameList.push({
					// 	label: data[i],
					// 	value: data[i]
					// })
				}
			}
		}).catch((e) => {

		});
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

		// 列表
		// state.listData = data;

		// 绘制
		if(state.type === 'polygon') {
			usePolygon(state.map, state.data);
			return
		}

		if (state.type === 'line') {
			usePolyline(state.map, state.data, state.bigImage);
			return
		}

		if (state.type === 'marker') {
			useMarker(state.map, state.data, 'start');
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
				width: 30px;
				height: 30px;
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
				position: relative;

				& img {
					width: 15px;
					height: 15px;
				}

				&:hover {
					background-color: #cde3fa;
				}

				&:hover > img {
					color: #fff;
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

				// 按钮名称
				.map-tools-item-name {
					width: 50px;
					position: absolute;
					bottom: 15%;
					left: 130%;
					transform: translateX(-50%, -15%);
					font-size: 10px;
					font-weight: bold;
					color: #3f9eff;
					border: 1px solid #3f9eff;
					background-color: #fff;
					border-radius: 5px;
					padding: 2px 5px;

					&::before {
						content: '';
						position: absolute;
						top: 4px;
						left: -7px;
						width: 0;
						height: 0;
						border-top: 5px solid transparent;
						border-right: 7px solid #3f9eff;
						border-bottom: 5px solid transparent;
					}
				}
			}

			.map-tools-item-active {
				color: #fff;
				transform: scale(1.2);
				background-color: #cde3fa;
			}
		}
	}

	::v-deep .leaflet-control-container {
		display: none;
	}
	::v-deep .leaflet-top {
		top: 173px;
	}
	::v-deep .leaflet-left {
		left: 55px;
	}
	::v-deep .leaflet-control-down {
		font-size: 10px;
		font-weight: bold;
		border-radius: 6px;
		color: #fff;
		background: #3f9eff;
		border-bottom: 0px;
	}
	::v-deep .leaflet-control-down:hover {
		color: #fff;
		background: #3f9eff;
		cursor: pointer;
	}
	::v-deep .download-button {
		background: #3f9eff;
	}
	::v-deep .radius-label-text {
		display: block;
		color: rgba(0, 0, 0, 0.8);
		background-color: rgba(255, 255, 255, 0.5);
		padding: 5px;
		border-radius: 5px;
		font-size: 10px;
		font-weight: bold;
		width: auto !important;
		min-width: 100px !important;
		height: auto !important;
	}
</style>