import request, { paramsStr } from '@/utils/http'

/**
 * 
 * @param {province} 传入行政区代码 
 * @returns 返回指定行政区所有道路名称
 * 
 */
export function getRoadName(data) {
    return request({
      url: '/roadNet/road_name' + paramsStr(data),
      method: 'get',
      data: data
    })
  }
  
  /**
   * 
   * @param {road_name} 传入路名 
   * @returns 返回指定道路所有经纬度信息
   * 
   */
  export function getRoadData(data) {
    return request({
      url: '/roadNet/road_data' + paramsStr(data),
      method: 'get',
      data: data
    })
  }