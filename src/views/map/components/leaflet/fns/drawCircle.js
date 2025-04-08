/**
 * @param {object} options
 * @description 实现鼠标拖拽绘制圆形，并获取圆形边界所有坐标点和圆形半径
 */

let r; // r用来存储半径
let i; // i用来存储圆心经纬度
let tempCircle; // 用来存放圆的图层
let current = []; // 存放当前绘制的图层，方便后续清理

export function useDrawCircle(map) {
    // 绘制圆形区域
    //在绘制圆之前需要先判断是否已经绘制过了，如果有，则清空再绘制.如果需要绘制多个圆，则不必此句
    //if (tempCircle) {
    //    this.removeCircle();
    //}
    r = 0;
    i = null;
    tempCircle = L.circle();
    map.dragging.disable(); //将mousemove事件拖拽地图禁用
    tempCircle.on('click', function(e) {
        
    })
    //监听鼠标落下事件
    map.on("mousedown", onmouseDown);
    function onmouseDown(e) {
        //确定圆心
        i = e.latlng;
        //监听鼠标移动事件
        map.on("mousemove", onMove);
        //监听鼠标弹起事件
        map.on("mouseup", onmouseUp);
    }
    function onMove(e) {
        r = L.latLng(e.latlng).distanceTo(i); //计算半径
        if (i) {
            //绘制圆心位置与半径
            tempCircle.setLatLng(i);
            tempCircle.setRadius(r);
            tempCircle.setStyle({ color: "rgba(255, 255, 255, 0.5)", weight: 1, fillOpacity: 0.1});
            map.addLayer(tempCircle);
        }
    }
    function onmouseUp(e) {
        r = L.latLng(e.latlng).distanceTo(i);
        // L.circle(i, { radius: r, color: "#ffff00", fillOpacity:1 });
        map.addLayer(tempCircle);
        map.dragging.enable();

        // 将绘制的图层放入 current 中管理，方便进行清理图层操作
        current.push(tempCircle)
        //动画滑动居中圆
        // map.flyToBounds(tempCircle.getBounds());
        //获取圆边的所有经纬度
        const point = tempCircle._latlng;
        const circleBorderPoints = computedCircle([point.lng, point.lat], r);

        // 绘制圆形半径
        const center = {lng: point.lng, lat: point.lat};
        const radius = r;
        // 计算半径的终点坐标
        const radiusEnd = [center.lat + (radius / 6371000) * (180 / Math.PI) / Math.cos(center.lat * Math.PI / 180), center.lng + (radius / 6371000) * (180 / Math.PI)];
        // 在圆形内部绘制一条线段表示半径
        const radiusLine = L.polyline([center, radiusEnd], {
            color: 'rgba(255, 255, 255, 0.5)',
            weight: 1,
        }).addTo(map);
        current.push(radiusLine)
        // 文字标记提示
        const markerlabel = L.marker({lat: radiusEnd[0], lng: radiusEnd[1]}, {
            icon: L.divIcon({
                className: 'radius-label-text',
                html: '半径:' + (radius / 1000).toFixed(3) + '千米'
            })
        }).addTo(map);
        current.push(markerlabel)
    
        i = null;
        r = 0;
        //取消监听事件
        map.off("mousedown");
        map.off("mouseup");
        map.off("mousemove");
        // 每次完成绘制后，关闭绘制工具，下一次绘制需要手动触发
        useDrawCircle(map);
    }
}

// 移除绘制圆形图层
function removeCircle(map) {
    map.removeLayer(tempCircle);
}

export function computedCircle(lnglat, radius) {
    // lnglat = [104.308173, 30.846514]
    // radius = 5000
    let r = 6371000.79
    let phase = 2 * Math.PI / 360
    let point = []
    for (let i = 0; i < 360; i++) {
        let dx = radius * Math.cos(i * phase)
        let dy = radius * Math.sin(i * phase)

        let lng = dx / (r * Math.cos(lnglat[1] * Math.PI / 180) * Math.PI / 180)
        let lat = dy / (r * Math.PI / 180)
        let newLng = lnglat[0] + lng
        // point.push([Number(newLng.toFixed(4)), Number((lnglat[1] + lat).toFixed(4))])
        point.push({
            lat: Number((lnglat[1] + lat).toFixed(6)),
            lng: Number(newLng.toFixed(6))
        })
    }
    return point
}