
export const keyRoads = {
    data() {
        return {
            defaultData: [], // 原数据格式，默认道路数据
            defaultRoadWeb: [], // 重新组装以后的默认道路数据
            needRemoveRoad: [], // 需要移除的道路数据
        }
    },
    methods: {
        /**
         * @description 绘制重点道路通道路线 
         */
        handleRoadWeb(data, color) {
            const { map } = this
            this.defaultData = Object.assign([], data);
            const coordinates = data;
            const road = []
            this.tableData = []
            // 合并数组中的相同对象
            const mergedItems = coordinates.reduce((acc, item) => {
                const existingItem = acc.find(i => i.name === item.name);
                if (existingItem) {
                    // 如果已经存在，累加 cnt 属性
                    existingItem.cnt = Number(existingItem.cnt) + Number(item.cnt);
                } else {
                    // 如果不存在，添加到结果数组中
                    acc.push(item);
                }
                return acc;
            }, []);
             // 路网列表
            this.tableData = mergedItems.sort((a, b) => a.cnt - b.cnt).reverse();

            // Colorbar分级
            this.splitIntoFive(this.tableData[0]?.cnt)

            // 重组数据结构，这里需要使用原始数据coordinates
            for (let i=0; i<coordinates.length; i++) {
                road.push(
                    {
                        "type": "MultiLineString",
                        "coordinates": typeof (coordinates[i].line_string) == 'String' ? JSON.parse(coordinates[i].line_string) : coordinates[i].line_string,
                        "cnt": coordinates[i].cnt || 0,
                        "name": coordinates[i].name || '无名路',
                        "id": coordinates[i].id
                    }
                )
            }
            // 重新组装以后的默认道路数据
            this.defaultRoadWeb = Object.assign([], road)
            // 绘制道路
            let latlngs = [], roadWeb = {}, roadNames = {};
            for (let l = 0; l < road.length; l++) {
                latlngs = []
                const r = road[l];
                const coordinates = r.coordinates || [];
                const count = r?.id
                const name = r?.name
                for (let i = 0; i < coordinates.length; i++) {
                    const el = coordinates[i];
                    if (el.length == 0) continue;
                    for (let j = 0; j < el.length; j++) {
                        const el2 = el[j];
                        for (let k = 0; k < el2.length; k++) {
                            const el3 = el2[k];
                            if (this.isLongitude(el3[0]) && this.isLatitude(el3[1])) {
                                latlngs.push([el3[1], el3[0]]);
                            } else {
                                latlngs.push(el3);
                            }
                        }
                    }
                    roadWeb[count] = latlngs
                    roadNames[count] = name
                }
            }
            for (let key in roadWeb) {
                this.roadWebLayer = L.polyline(roadWeb[key], { color: color ? color : 'rgba(255, 0, 0, 0.5)', weight: 6 }).bindPopup('<p>' + roadNames[key] + '</p>').addTo(map);
                this.roadWebLayer.on("click", ({ latlng }) => {
                    console.log(latlng)
                })
                this.current.push(this.roadWebLayer);
            }
            // map.fitBounds(this.roadWebLayer.getBounds());
        },

        /**
         * @description 拾取指定道路单独显示 
         */
        handleRoadWebPick(index, row) {
            // 清理画布
            for (let i = 0; i < this.current.length; i++) {
                this.map.removeLayer(this.current[i]);
            }
            this.roadWebLayer = {}
            // 当前选中行
            if (this.selectedId == index) {
                index = ''
            }
            this.selectedId = index
            if (this.selectedId == '') {
                this.defaultData = JSON.parse(JSON.stringify(hotRoad))
                this.handleRoadWeb(this.defaultData)
                return
            }
            // 更新地图道路展示
            const road = [];
            let filter = [];
            const roadName = row?.name
            filter = this.defaultData.filter(el => el.name == roadName)
            // 重组数据结构
            for (let i=0; i<filter.length; i++) {
                road.push(
                    {
                        "type": "MultiLineString",
                        "coordinates": JSON.parse(filter[i].line_string),
                        "cnt": filter[i].cnt || 0,
                        "id": filter[i].id,
                    }
                )
            }
            // 绘制道路
            let latlngs = []
            road.forEach(r => {
                latlngs = []
                const coordinates = r.coordinates;
                const count = r?.cnt
                coordinates.forEach(el => {
                    el.forEach(el2 => {
                        latlngs.push([el2[1], el2[0]]);
                    })
                })
                this.roadWebLayer = L.polyline(latlngs, { color: this.setTrafficStatus(count) }).addTo(this.map);
                this.current.push(this.roadWebLayer);
            })
        },

        /**
         * @description 排除框选的区域内的道路
         */
        filterRoads() {
            const that = this;
            const road = this.defaultRoadWeb;
            // filter函数私有方法，判断点是否在多边形内。
            function isPointInPolygon2(point, polygon) {
                let x = point[0], y = point[1];

                let inside = false;
                for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                    let xi = polygon[i][0], yi = polygon[i][1];
                    let xj = polygon[j][0], yj = polygon[j][1];

                    let intersect = ((yi > y) != (yj > y))
                        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                    if (intersect) inside = !inside;
                }

                return inside;
            }
            // 遍历 road中的 coordinates，通过isPointInPolygon方法找出包含在 this.polygonPoints 中的坐标点所在对象的 id
            const roadId = []
            for (let i = 0; i < road.length; i++) {
                const coordinates = road[i].coordinates;
                const id = road[i].id;
                for (let j=0; j<coordinates.length; j++) {
                    const point = coordinates[j];
                    for( let k=0; k<point.length; k++) {
                        // 遍历this.polygonPoints，判断point[k]是否在多边形内
                        const node = point[k];
                        for (let m=0; m<node.length; m++) {
                            for (let l=0; l<this.polygonPoints.length; l++) {
                                if (isPointInPolygon2([node[m][0], node[m][1]], this.polygonPoints[l])) {
                                    roadId.push(id)
                                }
                            }
                        }
                    }
                }
            }
            // 排除框选区域内的道路后，重新绘制道路
            this.needRemoveRoad = [...new Set(roadId)];
            this.handlePaichu(this.needRemoveRoad);
            // 导出
            this.exportToJson(
                { ids: [...new Set(roadId)] },
                '被排除的道路ID'
            )
        },
        // 根据 ID 筛选出剩余道路
        handlePaichu(data) {
            const arr = [];
            const idMap = new Map();


            this.needRemoveRoad.forEach(item => {
                idMap.set(item, true);
            });


            this.defaultRoadWeb.forEach(item => {
                if (!idMap.has(item.id)) {
                    arr.push(item);
                }
            });
            if (arr.length > 0) {
                const categorizedItems = arr.reduce((acc, item) => {
                    const { name } = item;
                    if (!acc[name]) {
                        acc[name] = [];
                    }
                    acc[name].push(item);
                    return acc;
                }, {})
                this.clearMap();
                for (let key in categorizedItems) {
                    const arr = [];
                    for (let i = 0; i < categorizedItems[key].length; i++) {
                        const item = categorizedItems[key][i];
                        arr.push({
                            id: item.id,
                            name: item.name,
                            cnt: item.cnt,
                            line_string: item.coordinates,
                        })
                    }
                    this.handleRoadWeb(arr);
                }
            }
        }
    }
}