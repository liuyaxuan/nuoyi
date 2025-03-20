/**
 * @param {object} options
 * @description 绘制
 */

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
    changeLatLng,
	isLongitude,
	isLatitude,
    isArray,
    isObject,
} from '@/utils/index.js'

export function usePolygon(map, data, color) {
    let latlngs = [];
    // 传入数组
    if (isArray(data)) {
        if (isTwoDimensionalArray(data) && data.length > 1) {
            // 二维数组
            latlngs = data;
            // 绘制
            drawPolygonPlace(map, latlngs);
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
                        if (isLongitude(coordinates[j][0][0])) {
                            latlngs = changeLatLng(coordinates[j]);
                        } else {
                            latlngs.push(coordinates[j]);
                        }
                    }
                    // 绘制
                    drawPolygonPlace(map, latlngs);
                }
                return
            } else {
                return this.$message.error('绘制多边形区域数据格式错误');
            }
        }
    }
    // 传入对象
    if (isObject(data)) {
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
        
        // 绘制
        drawPolygonPlace(map, latlngs);
        return
    }
    // 测试数据
    // const test = [{"type": "MultiPolygon","coordinates": [ [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]]]}]
}

function drawPolygonPlace(map, latlngs) {
    // 使用 L.polygon() 方法绘制多边形区域
    let polygon = L.polygon(latlngs, { color: 'red' })
        .setStyle({fillColor: 'yellow', fillOpacity: 0.05, weight: 1}).addTo(map);  // 设置填充色为红色

    // 自动缩放到可视区域数据格式为 [ [lat, lng], [lat, lng], [... ]
    const bounds = new L.LatLngBounds(latlngs);
    map.fitBounds(bounds);
}