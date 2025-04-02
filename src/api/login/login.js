import request, { paramsStr } from '@/utils/http'

/**
 * 
 * @param {province} 传入行政区代码 
 * @returns 返回指定行政区所有道路名称
 * 
 */
export function login(obj) {
    // const data = {
    //   username,
    //   password,
    //   rememberMe: false,
    //   validateCode,
    //   uuid
    // }
    obj['rememberMe'] = false;
    obj['validateCode'] = '';
    obj['uuid'] = '';
    return request({
      url: '/login',
      headers: {
        isToken: false,
        repeatSubmit: false
      },
      method: 'post',
      data: obj
    }).catch(err => {
        return err;
    })
  }