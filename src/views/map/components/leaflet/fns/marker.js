import {
	ref,
	onMounted,
	onUnmounted,
	getCurrentInstance
} from 'vue'
// 工具类
import { 
	isTwoDimensionalArray,
	getArrayDepth,
	isLongitude,
	isLatitude,
} from '@/utils/index.js'

// 静态图片资源
import redPoint from '@/assets/icons/start.png'

export function useMarker(map, data) {
	let latlngs = [];
	// 自定义marker图标
	const customIcon = L.icon({
		iconUrl: redPoint,
		iconSize: [15, 20], // 图标的大小
	});
	let coordinates = [];
	if (Array.isArray(data)) {
		// 判断当前输入值是一维数组还是二维数组
		if (isTwoDimensionalArray(data)) {
			// 二维数组
			coordinates = data;
		} else {
			// 一维数组
			coordinates = [data];
		}
	} else if (typeof data === "object") {
		let key = ''
		if (data.hasOwnProperty('coordinates')) {
			key = 'coordinates'
		}
		coordinates = data[key];
		// 检查数组深度，如果大于 2，则降低深度，如果不足 2，则增加深度
		if (getArrayDepth(coordinates) > 2) {
			coordinates = coordinates.flat();
		} else if (getArrayDepth(coordinates) == 1) {
			coordinates = [coordinates];
		}
	}
	// 遍历输入值，整理数据格式
	for (let i = 0; i < coordinates.length; i++) {
		if (isLongitude(coordinates[i][0]) && isLatitude(coordinates[i][1])) {
			latlngs.push([coordinates[i][1], coordinates[i][0]]);
		} else {
			latlngs.push(coordinates[i]);
		}
	}
	// latlngs数据量过大时，使用聚合处理
	if (latlngs.length > 10000) {
		// markerClusterGroup()处理数据聚合
		const markerClusterGroup = L.markerClusterGroup();
		for (let i = 0; i < latlngs.length; i++) {
			const marker = markerClusterGroup.addLayer(L.marker(latlngs[i] || [], {
				icon: customIcon,
				draggable: false
			}).bindPopup('<p>' + 'lng:' + latlngs[i][1] + ', lat:' + latlngs[i][0] + '</p>'));
			// this.current.push(marker);
		}
		map.addLayer(markerClusterGroup);
	} else {
		// 绘制
		for (let i = 0; i < latlngs.length; i++) {
			const markers = L.marker(latlngs[i] || [], {
				icon: customIcon,
				draggable: false
			}).bindPopup('<p>' + 'lng:' + latlngs[i][1] + ', lat:' + latlngs[i][0] + '</p>').addTo(map);
			markers.on('mouseover', function(e) {
				// 鼠标悬停显示内容
			});
			// 添加到layers中，方便后续操作回看
		}
	}
	// 处理需要放入可视区域的点
	const bounds = new L.LatLngBounds(latlngs);
	// 自动缩放到可视区域数据格式为 [ [lat, lng], [lat, lng], [... ]
	map.fitBounds(bounds);
}