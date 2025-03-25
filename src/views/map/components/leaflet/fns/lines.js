/**
 * usePolyline 负责地图折线、多线段绘制
 */
// 组合函数
import { useMarker } from './marker.js'
// 工具类
import { 
	isTwoDimensionalArray,
	getArrayDepth,
	isLongitude,
	isLatitude,
    changeLatLng,
    isObject,
} from '@/utils/index.js'

export function usePolyline(map, data, bigImage) {
    // 判断数据来源格式
    var latlngs = [];
    // 传入数组
    if (Array.isArray(data)) {
        if (isTwoDimensionalArray(data) && data.length > 1) {
            // 二维数组
            latlngs = data;
        } else {
            // 一维数组
            if (data.length > 0 && data[0].hasOwnProperty('coordinates')) {
                let key = ''
                for (let i = 0; i < data.length; i++) {
                    if (data[i].hasOwnProperty('coordinates')) {
                        key = 'coordinates'
                    }
                    let coordinates = data[i]['coordinates'];
                    // 检查数组深度，如果大于 2，则降低深度，如果不足 2，则增加深度
                    if (getArrayDepth(coordinates) > 2) {
                        coordinates = coordinates.flat();
                    }
                    // 遍历输入值，整理数据格式
                    for (let j = 0; j < coordinates.length; j++) {
                        if (isLongitude(coordinates[j][0]) && isLatitude(coordinates[j][1])) {
                            latlngs = changeLatLng(coordinates);
                        } else {
                            latlngs.push(coordinates[j]);
                        }
                    }
                    const polyline = L.polyline(latlngs, { color: 'rgba(255, 0, 255, 0.8)', weight: 1, fill: false }).addTo(map);
                    map.fitBounds(polyline.getBounds());
                }
                return
            } else {
                return this.$message.error('多段折线数据格式错误');
            }
        }
    }
    // 传入对象
    if (isObject(data)) {
        // 标记出起点、终点
        const start = data.coordinates[0][0];
        const end = data.coordinates[0][data.coordinates[0].length - 1];
        // 绘制起点、终点
        useMarker(map, start, 'start', bigImage);
        useMarker(map, end, 'end', bigImage);
        // 绘制路径
        let key = ''
        if (data.hasOwnProperty('coordinates')) {
            key = 'coordinates'
        }
        let coordinates = data[key];
        // 检查数组深度，如果大于 2，则降低深度，如果不足 2，则增加深度
        if (getArrayDepth(coordinates) > 2) {
            coordinates = coordinates.flat();
        } else if (getArrayDepth(coordinates) == 1) {
            coordinates = [coordinates];
        }
        // 遍历输入值，整理数据格式
        for (let j = 0; j < coordinates.length; j++) {
            if (isLongitude(coordinates[j][0]) && isLatitude(coordinates[j][1])) {
                latlngs = changeLatLng(coordinates);
            } else {
                latlngs.push(coordinates[j]);
            }
        }
    }

    var polyline = L.polyline(latlngs, { color: 'red', weight: 1, fill: false }).addTo(map);
    map.fitBounds(polyline.getBounds());
}