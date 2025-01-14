/**
 * @description 防抖
 */
export function debounce(func, wait) {
	let timeout;
	return function () {
		let context = this;
		let args = arguments;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			func.apply(context, args);
		}, wait);
	};
}


/**
 * @param {*} obj
 * @description 行政区域边界
 * 传入参数数据格式，参考：https://datav.aliyun.com/portal/school/atlas/area_selector，选择到市级，包含内部行政区划分
 */
export function handleFilterArea(data) {
	if (data.length == 0 || data == null || data == undefined) {
		return '行政区边界数据不合法'
	}
	let obj = {}
	let cdFece = data; // 行政区范围
	cdFece = cdFece.features;
	for (let i = 0; i < cdFece.length; i++) {
		const name = cdFece[i].properties.name;
		const polygon = cdFece[i].geometry.coordinates;
		for (let j = 0; j < polygon.length; j++) {
			for (let k = 0; k < polygon[j].length; k++) {
				const arr = formatLngLat(polygon[j][k]); // 行政区围栏
				if (polygon.length > 1) {
					obj[name + j] = arr;
				} else {
					obj[name] = arr;
				}
			}
		}
	}
	return obj;
}

/**
 * @description: 将经纬度数据格式转为 84坐标系且调整为【lng, lat】格式
 * 
 */
export function formatLngLat(data) {
	const arr = []
	for (let i=0; i<data.length; i++) {
		const res = gcj02towgs84(data[i][0], data[i][1])
		arr.push([res[1], res[0]])
	}
	return arr
}

/**
 * GCJ02（火星坐标系） 转换为 WGS84 / 即谷歌高德转WGS84
 * @param { Number } lng 
 * @param { Number } lat 
 */
export function gcj02towgs84 (lng, lat) {
  if (outOfChina(lng, lat)) {
    return [lng, lat]
  }
  else {
    var dlat = transformlat(lng - 105.0, lat - 35.0)
    var dlng = transformlng(lng - 105.0, lat - 35.0)
    var radlat = lat / 180.0 * PI
    var magic = Math.sin(radlat)
    magic = 1 - ee * magic * magic
    var sqrtmagic = Math.sqrt(magic)
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
    const mglat = lat + dlat
    const mglng = lng + dlng
    return [lng * 2 - mglng, lat * 2 - mglat]
  }
}

/**
 * @param {*} arr 
 * @description 返回数组层级深度
 */
export function getArrayDepth(arr) {
	if (!Array.isArray(arr)) {
		return 0;
	}
	let maxDepth = 0;
	for (let i = 0; i < arr.length; i++) {
		const depth = getArrayDepth(arr[i]);
		if (depth > maxDepth) {
			maxDepth = depth;
		}
	}
	return maxDepth + 1;
}

/**
 * @param {*} arr
 * @description 检查当前值是否为数组
 */
export function isArray(value) {
	return Array.isArray(value);
}

/**
 *  @param {*} obj
 *  @description 检查当前值是否为对象
 */
export function isObject(value) {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * @param {*} obj 
 * @description 检查当前值是否为数组或数组对象
 */
export function isArrayOrArrayObject(obj) {
	return Array.isArray(obj) || (obj && obj.constructor === Array);
}

/**
 * @param {*} arr 
 * @description 检查当前值是一维数组或二维数组,
 * 一维数组返回 false，二维数组返回 true
 */
export function isTwoDimensionalArray(arr) {
	return arr.some(item => Array.isArray(item));
}

/**
 * @param {*} value 
 * @description 判断当前值是否为经度 true or false
 */
export function isLongitude(value) {
	return value >= -180 && value <= 180;
}

/**
 * 
 * @param {*} value 
 * @description 判断当前值是否为纬度
 */
export function isLatitude(value) {
	return value >= -90 && value <= 90;
}

/**
 * @param {*} jsonData
 * @description 调整经纬度数据格式 【lat, lng】
 */
export function changeLatLng(latlngs) {
	const data = latlngs.map(([longitude, latitude]) => [latitude, longitude]);
	return data;
}

/**
 * @param data 为需要导出的JSON 数据，name 为 指定导出的文件名
 * @description: 导出JSON格式文件到本地
 */
export function exportToJson(data, name) {
	const jsonData = data || [];
	const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
		type: 'application/json'
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = name + '.json';
	document.body.appendChild(a);
	a.click();
}

/**
 * @param {Object} jsonData JSON数据
 * @param {String} name 定义导出文件名
 * @description: 导出JSON格式数据为EXCEL文件
 */
export function exportToExcel(jsonData, name) {
	// 将JSON数据转换为工作表
	const worksheet = XLSX.utils.json_to_sheet(jsonData);
	// 创建一个新的工作簿
	const workbook = XLSX.utils.book_new();
	// 将工作表添加到工作簿中
	XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
	// 将工作簿转换为Excel文件
	const excelBuffer = XLSX.write(workbook, {
		bookType: 'xlsx',
		type: 'array'
	});
	// 创建一个Blob对象
	const data = new Blob([excelBuffer], {
		type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	});
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
}