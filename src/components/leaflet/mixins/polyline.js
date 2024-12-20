/**
 * polyline 负责地图折线、多线段绘制
 */
import redPoint from '@/assets/icons/start.png'
export const polyline = {
    methods: {
        /**
         * @param {*} jsonData
         * @description 绘制折线
         */
        handlePolyline() {
            const { map } = this
            if (this.current.length > 0) {
                // this.clearMap();
            }

            // 判断数据来源格式
            var latlngs = [];
            // 传入数组
            if (this.isArray(this.jsonData)) {
                if (this.isTwoDimensionalArray(this.jsonData) && this.jsonData.length > 1) {
                    for (let i=0; i<this.tempData.length; i++) {
                        let location = this.tempData[i].location || [];
                        for (let j=0; j<location.length; j++) {
                            const coordinates = location[j].coordinates || [];
                            for (let k=0; k<coordinates.length; k++) {
                                latlngs.push([coordinates[k][1], coordinates[k][0]])
                            }
                        }
                    }
                    // 二维数组
                    // latlngs = this.jsonData;
                } else {
                    // 一维数组
                    if (this.jsonData.length > 0 && this.jsonData[0].hasOwnProperty('coordinates')) {
                        let key = ''
                        for (let i = 0; i < this.jsonData.length; i++) {
                            if (this.jsonData[i].hasOwnProperty('coordinates')) {
                                key = 'coordinates'
                            }
                            let coordinates = this.jsonData[i]['coordinates'];
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
                            const polyline = L.polyline(latlngs, { color: 'rgba(255, 0, 0, 0.8)', weight: 3, fill: false }).addTo(map);
                            map.fitBounds(polyline.getBounds());
                        }
                        return
                    } else if (this.jsonData.length > 0 && this.jsonData[0].hasOwnProperty('geometry')) {
                        const { liuliangTempData } = this;
                        let baseData = JSON.parse(JSON.stringify(this.jsonData));
                        // 添加车流量数据
                        liuliangTempData.forEach(item => {
                            const baseItem = baseData.find(base => base.name === item.road_nm);
                            if (baseItem) {
                                baseItem.cnt = item.q;
                            }
                        });
                        // 路网车流量分级
                        const __max__ = baseData.sort((a, b) => a.cnt - b.cnt).reverse();
                        this.splitIntoFive(Number(__max__[0].cnt));
                        
                        // 绘制路网
                        let key = '', name = '', cnt = 0;
                        for (let i = 0; i < baseData.length; i++) {
                            const geometry = baseData[i].geometry;
                            name = baseData[i].name || '';
                            cnt = Number(baseData[i].cnt) || 0;
                            if (geometry.hasOwnProperty('coordinates')) {
                                key = 'coordinates'
                            }
                            let coordinates = geometry['coordinates'];
                            // 计算每个分段的总长度（单位:米）calculateDistance
                            let totalLength = 0;
                            for (let i = 0; i < coordinates.length; i++) {
                                const arr = coordinates[i];
                                for (let i = 0; i < arr.length - 1; i += 2) {
                                    let value1 = arr[i];
                                    let value2 = arr[i + 1];
                                    const km = this.calculateDistance(value1[1], value1[0], value2[1], value2[0]);
                                    totalLength += km;
                                }
                            }
                            baseData[i].length = totalLength;
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
                            let index = this.intervals.findIndex(interval => {
                                let [start, end] = interval.split("--").map(Number);
                                return cnt >= start && cnt <= end;
                            });
                            const polyline = L.polyline(latlngs, { color: colors(index), weight: 6, fill: false }).addTo(map);
                            // 自定义marker图标
                            const customIcon = L.divIcon({
                                className: 'custom-marker',
                                // html: '<i class="el-icon-location" style="font-size: 25px; font-weight: bold; color:red;"></i>',
                                    // + '<div style="display: ruby-text; width: auto; font-size: 12px; color: #333; margin-left: 5px; background-color: rgba(0, 0, 0, 0.5); padding: 5px 5px; border-radius: 5px;">'+name+'</div>',
                                iconSize: [15, 20], // 图标大小
                                iconAnchor: [10, 20] // 图标锚点
                            });
                            L.marker(
                                latlngs[0],
                                {
                                    icon: customIcon,
                                    draggable: false
                                }
                            ).addTo(map);
                            map.fitBounds(polyline.getBounds());
                        }
                        const arrData = []
                        for(let i = 0; i < baseData.length; i++) {
                            arrData.push(
                                {
                                    name: baseData[i].name,
                                    geometry: JSON.stringify(baseData[i].geometry),
                                    length: baseData[i].length,
                                    cnt: baseData[i].cnt || 0
                                }
                            )
                        }
                        // this.exportToJson(arrData, '环岛分段计数1650')
                        function colors(index) {
                            index = index + 1
                            let text = '#499c20'
                            if (index == 1) {
                                text = '#499c20'
                            }
                            if (index == 2) {
                                text = '#E6A23C'
                            }
                            if (index == 3) {
                                text = '#e00000'
                            }
                            if (index == 4) {
                                text = '#961e1e'
                            }
                            if (index == 5) {
                                text = '#490000'
                            }
                            return text
                        }
                        return
                    } else {
                        return this.$message.error('多段折线数据格式错误');
                    }
                }
            }
            // 传入对象
            if (this.isObject(this.jsonData)) {
                let key = ''
                if (this.jsonData.hasOwnProperty('coordinates')) {
                    key = 'coordinates'
                }
                let coordinates = this.jsonData[key];
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
            }

            var polyline = L.polyline(latlngs, { color: 'rgba(255, 0, 0, 0.8)', weight: 3, fill: false }).addTo(map);
            // this.current.push(polyline);
            map.fitBounds(polyline.getBounds());
        }
    },
}