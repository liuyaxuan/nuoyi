/**
 * @param {object} options
 * @description 绘制
 */

export const polygon = {
    data() {
        return {

        }
    },
    methods: {
        // 绘制区域
        hangleMultiPolygon(data) {
            // 判断数据来源方式 1、jsonData 2、data 参数传入
            const dataSource = data || this.jsonData;
            const { map } = this
            // 判断数据来源格式
            var latlngs = [];
            // 传入数组
            if (this.isArray(dataSource)) {
                if (this.isTwoDimensionalArray(dataSource) && dataSource.length > 1) {
                    // 二维数组
                    latlngs = dataSource;
                    // 绘制
                    this.drawPolygonPlace(latlngs);
                } else {
                    // 一维数组
                    if (dataSource.length > 0 && dataSource[0].hasOwnProperty('coordinates')) {
                        let key = ''
                        for (let i = 0; i < dataSource.length; i++) {
                            if (dataSource[i].hasOwnProperty('coordinates')) {
                                key = 'coordinates'
                            }
                            let coordinates = dataSource[i]['coordinates'];
                            // 检查数组深度，如果大于 2，则降低深度，如果不足 2，则增加深度
                            if (this.getArrayDepth(coordinates) > 2) {
                                coordinates = coordinates.flat();
                            }
                            // 遍历输入值，整理数据格式
                            for (let j = 0; j < coordinates.length; j++) {
                                if (this.isLongitude(coordinates[j][0]) && this.isLatitude(coordinates[j][1])) {
                                    latlngs = this.changeLatLng(coordinates);
                                } else {
                                    latlngs.push(coordinates[j]);
                                }
                            }
                            // 绘制
                            this.drawPolygonPlace(latlngs);
                        }
                        return
                    } else {
                        return this.$message.error('绘制多边形区域数据格式错误');
                    }
                }
            }
            // 传入对象
            if (this.isObject(dataSource)) {
                let key = ''
                if (dataSource.hasOwnProperty('coordinates')) {
                    key = 'coordinates'
                }
                let coordinates = dataSource[key];
                // 检查数组深度，如果大于 2，则降低深度，如果不足 2，则增加深度
                if (this.getArrayDepth(coordinates) > 2) {
                    coordinates = coordinates.flat();
                } else if (this.getArrayDepth(coordinates) == 1) {
                    coordinates = [coordinates];
                }
                // 遍历输入值，整理数据格式
                for (let j = 0; j < coordinates.length; j++) {
                    if (this.isLongitude(coordinates[j][0]) && this.isLatitude(coordinates[j][1])) {
                        latlngs = this.changeLatLng(coordinates);
                    } else {
                        latlngs.push(coordinates[j]);
                    }
                }
                
                // 绘制
                this.drawPolygonPlace(latlngs);
                return
            }
            // 测试数据
            // const test = [{"type": "MultiPolygon","coordinates": [ [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]]]}]
        },

        /**
         * 绘制多边形区域
         */
        drawPolygonPlace(latlngs) {
            const { map } = this;
            // 使用 L.polygon() 方法绘制多边形区域
            let polygon = L.polygon(latlngs, { color: '#000000' })
                .setStyle({fillColor: '#000000', fillOpacity: 0.05, weight: 1}).addTo(map);  // 设置填充色为红色
            this.current.push(polygon);

            // 自动缩放到可视区域数据格式为 [ [lat, lng], [lat, lng], [... ]
            const bounds = new L.LatLngBounds(latlngs);
            map.fitBounds(bounds);
        }
    },
}