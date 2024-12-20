
/**
 * @description 工具方法
 */

import { gcj02towgs84 } from '../utils/transformLonlat.js'

export const utils = {
    methods: {
        /**
         * @param {*} obj
         * @description 行政区域边界
         * 传入参数数据格式，参考：https://datav.aliyun.com/portal/school/atlas/area_selector，选择到市级，包含内部行政区划分
         */
        handleFilterArea(data) {
            if (data.length == 0 || data == null || data == undefined) {
                this.$message.error('行政区边界数据不合法');
                return
            }
            let obj = {}
            let cdFece = data;  // 行政区范围
            cdFece = cdFece.features;
            for (let i=0; i<cdFece.length; i++) {
                const name = cdFece[i].properties.name;
                const polygon = cdFece[i].geometry.coordinates;
                for (let j=0; j<polygon.length; j++) {
                    for (let k=0; k<polygon[j].length; k++) {
                        const arr = this.formatLngLat(polygon[j][k]); // 行政区围栏
                        if (polygon.length > 1) {
                            obj[name + j] = arr;
                        } else {
                            obj[name] = arr;
                        }
                    }
                }
            }
            for(let key in obj) {
                this.hangleMultiPolygon(obj[key])
            }
        },

        /**
         * @param {*} arr 
         * @description 返回数组层级深度
         */
        getArrayDepth(arr) {
            if (!Array.isArray(arr)) {
              return 0;
            }
            let maxDepth = 0;
            for (let i = 0; i < arr.length; i++) {
              const depth = this.getArrayDepth(arr[i]);
              if (depth > maxDepth) {
                maxDepth = depth;
              }
            }
            return maxDepth + 1;
        },

        /**
         * @param {*} arr
         * @description 检查当前值是否为数组
         */
        isArray(value) {
            return Array.isArray(value);
        },

        /**
         *  @param {*} obj
         *  @description 检查当前值是否为对象
         */
        isObject(value) {
            return value !== null && typeof value === 'object' && !Array.isArray(value);
        },

        /**
         * @param {*} obj 
         * @description 检查当前值是否为数组或数组对象
         */
        isArrayOrArrayObject(obj) {
            return Array.isArray(obj) || (obj && obj.constructor === Array);
        },

        /**
         * @param {*} arr 
         * @description 检查当前值是一维数组或二维数组,
         * 一维数组返回 false，二维数组返回 true
         */
        isTwoDimensionalArray(arr) {
            return arr.some(item => Array.isArray(item));
        },

        /**
         * @param {*} value 
         * @description 判断当前值是否为经度 true or false
         */
        isLongitude(value) {
            return value >= -180 && value <= 180;
        },

        /**
         * 
         * @param {*} value 
         * @description 判断当前值是否为纬度
         */
        isLatitude(value) {
            return value >= -90 && value <= 90;
        },

        /**
         * @param {*} jsonData
         * @description 调整经纬度数据格式 【lat, lng】
         */
        changeLatLng(latlngs) {
            const data = latlngs.map(([longitude, latitude]) => [latitude, longitude]);
            return data;
        },

        /**
         * @description: 将经纬度数据格式转为 84坐标系且调整为【lng, lat】格式
         * 
         */
        formatLngLat(data) {
            const arr = []
            for (let i=0; i<data.length; i++) {
                const res = gcj02towgs84(data[i][0], data[i][1])
                arr.push([res[1], res[0]])
            }
            return arr
        },

        /**
         * @description: 计算两个经纬度之间的距离，单位为米
         * 
         */
        calculateDistance(lat1, lon1, lat2, lon2) {
            const radLat1 = this.deg2rad(lat1);
            const radLat2 = this.deg2rad(lat2);
            const radLon1 = this.deg2rad(lon1);
            const radLon2 = this.deg2rad(lon2);
            const a = radLat1 - radLat2;
            const b = radLon1 - radLon2;
            const distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b/2), 2)));
            return distance * 6371000; // 返回单位为米
        },
        deg2rad(deg) {
            return deg * (Math.PI/180);
        },

        /**
         * @param data 为需要导出的JSON 数据，name 为 指定导出的文件名
         * @description: 导出JSON格式文件到本地
         */
        exportToJson(data, name) {
            const jsonData = data || [];
            const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = name + '.json';
            document.body.appendChild(a);
            a.click();
        },

        /**
         * @param {Object} jsonData JSON数据
         * @param {String} name 定义导出文件名
         * @description: 导出JSON格式数据为EXCEL文件
         */
        exportToExcel(jsonData, name) {
            // 将JSON数据转换为工作表
            const worksheet = XLSX.utils.json_to_sheet(jsonData);
            // 创建一个新的工作簿
            const workbook = XLSX.utils.book_new();
            // 将工作表添加到工作簿中
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
            // 将工作簿转换为Excel文件
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            // 创建一个Blob对象
            const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            // 创建一个下载链接
            const url = window.URL.createObjectURL(data);
            // 创建一个<a>标签并设置下载链接
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name + '.xlsx');
            document.body.appendChild(link);

            // 模拟点击下载链接
            link.click();

            // 清理
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
    }
}