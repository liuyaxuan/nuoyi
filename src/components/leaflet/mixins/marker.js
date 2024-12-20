/**
 * 负责地图图形、文字描述标记
 */
import redPoint from '@/assets/icons/start.png'

export const markers = {
    methods: {
        handleMarker() {
            const { map } = this
            let bounds = [], latlngs = [];
            if (this.current.length > 0) {
                // this.clearMap();
            }
            // 自定义marker图标
            const customIcon = L.icon({
                iconUrl: redPoint,
                iconSize: [15, 20], // 图标的大小
            });

            // 判断数据来源格式
            let coordinates = [];
            if (Array.isArray(this.jsonData)) {
                // 判断当前输入值是一维数组还是二维数组
                if (this.isTwoDimensionalArray(this.jsonData)) {
                    // 二维数组
                    coordinates = this.jsonData;
                } else {
                    // 一维数组
                    coordinates = [this.jsonData];
                }
            } else if (typeof this.jsonData === "object") {
                let key = ''
                if (this.jsonData.hasOwnProperty('coordinates')) {
                    key = 'coordinates'
                }
                coordinates = this.jsonData[key];
                // 检查数组深度，如果大于 2，则降低深度，如果不足 2，则增加深度
                if (this.getArrayDepth(coordinates) > 2) {
                    coordinates = coordinates.flat();
                } else if (this.getArrayDepth(coordinates) == 1) {
                    coordinates = [coordinates];
                }
            }

            // 遍历输入值，整理数据格式
            for (let i = 0; i < coordinates.length; i++) {
                if (this.isLongitude(coordinates[i][0]) && this.isLatitude(coordinates[i][1])) {
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
                    const marker = markerClusterGroup.addLayer(L.marker(latlngs[i] || [], { icon: customIcon, draggable: false }).bindPopup('<p>' + 'lng:' + latlngs[i][1] + ', lat:' + latlngs[i][0] + '</p>'));
                    this.current.push(marker);
                }
                map.addLayer(markerClusterGroup);
            } else {
                // 绘制
                for (let i = 0; i < latlngs.length; i++) {
                    const markers = L.marker(latlngs[i] || [], { icon: customIcon, draggable: false }).bindPopup('<p>' + 'lng:' + latlngs[i][1] + ', lat:' + latlngs[i][0] + '</p>').addTo(map);
                    
                    // 为每个marker标记点添加名称 
                    // L.marker({lat: latlngs[i][0], lng: latlngs[i][1]}, {
                    //     icon: L.divIcon({
                    //         className: 'radius-label-text',
                    //         iconAnchor: [-5, -5],
                    //         html: names[i]
                    //     })
                    // }).addTo(map);
                    markers.on('mouseover', function(e) {
                        // 鼠标悬停显示内容
                    });
                    this.current.push(markers);
                }
            }
            // 处理需要放入可视区域的点
            bounds = new L.LatLngBounds(latlngs);
            // 自动缩放到可视区域数据格式为 [ [lat, lng], [lat, lng], [... ]
            map.fitBounds(bounds);
        },
    },
}