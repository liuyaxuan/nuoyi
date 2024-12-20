/**
 * @param {object} options
 * @description 实现鼠标点击绘制多边形，并获取多边形的所有边界坐标
 */

// 多边形
let points = [];
let polygon;
let polygonGroup;
let timer; // 定时器

export const drawPolygon = {
    data() {
        return {
            polygonPoints: [],
        }
    },
    methods: {
        // 关闭绘制多边形绘制
        offDraw() {
            const { map } = this
            polygon.setLatLngs(points);
            //触发双击事件，结束绘制
            map.fire("dblclick");
            map.off("click");
            map.off("dblclick");
        },
        // 清除多边形涂层组
        deleteDraw() {
            const { map } = this
            map.removeLayer(polygon);
        },
        // 绘制多边形
        drawPolygonFunc() {
            const { map } = this
            const that = this;
            if (polygonGroup) {
                this.deleteDraw();
            }
            points = [];
            that.polygonPoints = []; // 用于删除范围内的道路
            that.polygonPoints.push([]);
            polygon = new L.polygon(points, { color: "red" });
            this.current.push(polygon);
            polygonGroup = L.layerGroup().addTo(map);
            polygonGroup.addLayer(polygon);
            map.off("dblclick"); //首次绘制时取消默认双击放大地图事件
            map.on("click", onClick);
            function onClick(e) {
                clearTimeout(timer); // 先清定时器
                // 延迟执行，避免与双击事件冲突
                timer = setTimeout(() => {
                    points.push([e.latlng.lat, e.latlng.lng]);
                    polygon.setLatLngs(points);
                    map.on("mousemove", onMove);
                    map.on("dblclick", onDoubleClick);
                }, 10);
            }
            function onMove(e) {
                points.push([e.latlng.lat, e.latlng.lng]);
                polygon.setLatLngs(points);
                points.pop();
            }
            
            function onDoubleClick(e) {
                // 获取当前绘制的多边形坐标
                for (let i=0; i<points.length; i++) {
                    that.polygonPoints[that.polygonPoints.length-1].push([points[i][1], points[i][0]]);
                }
                // 清理定时器、绘制信息
                clearTimeout(timer);
                map.off("mousemove");
                points = [];
                polygon = new L.polygon(points, { color: "red" }).addTo(polygonGroup);
                // 每次结束绘制，添加一个空数组，用于下一次绘制
                that.polygonPoints.push([]);
            }
        },
    }
}