/**
 * 负责地图中所有状态管理
 */
export const stater = {
    data() {
        return {
            isDragging: false, // 是否正在拖拽
            drawer: false, // 控制抽屉
            isContextMenuVisible: false, // 右键菜单
            pageX: 0, // 右键菜单x位置
            pageY: 0, // 右键菜单y位置
            isVisble: false, // 控制 dialog 弹窗
            isEditVisble: false, // 控制 编辑输入 JSON 数据弹窗
            dialogType: '', // 弹窗类型，主要用于判断弹窗中插槽内容
            security: true, // 安全模式
            map: null, // leaflet map 实例
            pickupLnglat: '', // 拾取坐标
            current: [], // 管理当前地图中的所有图层（绘制的点、线、面）
            roadWebLayer: {}, // 重点道路图层
            selectedId: '', // 道路列表中当前被选中行
            // 行政区域下拉框
            administrativeAreaValue: '', // 行政区域下拉框值
            administrativeArea: [
                {"label": "云南", "value": "yunnan"},
                {"label": "四川", "value": "sichuan"},
                {"label": "河北", "value": "hebei"},
                {"label": "安徽", "value": "anhui"},
                {"label": "天津", "value": "tianjin"},
                {"label": "江西", "value": "jiangxi"},
                {"label": "陕西", "value": "shaanxi"},
                {"label": "西藏", "value": "tibet"},
                {"label": "宁夏", "value": "ningxia"},
                {"label": "山西", "value": "shanxi"},
                {"label": "上海", "value": "shanghai"},
                {"label": "福建", "value": "fujian"},
                {"label": "广西", "value": "guangxi"},
                {"label": "山东", "value": "shandong"},
                {"label": "北京", "value": "beijing"},
                {"label": "湖北", "value": "hubei"},
                {"label": "重庆", "value": "chongqing"},
                {"label": "新疆", "value": "xinjiang"},
                {"label": "青海", "value": "qinghai"},
                {"label": "内蒙古", "value": "inner mongolia"},
                {"label": "海南", "value": "hainan"},
                {"label": "吉林", "value": "jilin"},
                {"label": "浙江", "value": "zhejiang"},
                {"label": "香港", "value": "hong kong"},
                {"label": "江苏", "value": "jiangsu"},
                {"label": "河南", "value": "henan"},
                {"label": "湖南", "value": "hunan"},
                {"label": "辽宁", "value": "liaoning"},
                {"label": "甘肃", "value": "gansu"},
                {"label": "贵州", "value": "guizhou"},
                {"label": "广东", "value": "guangdong"},
                {"label": "黑龙江", "value": "heilongjiang"},
                {"label": "澳门", "value": "macau"}
            ],
            // 行政区内对应的道路名称列表
            roadName: '', // 道路名称
            roadNameList: [], // 道路名称列表
            checkboxList: [], // checkboxList道路名称列表
        }
    },
    watch: {
        // 受控状态修改,防止直接修改
        pickupLnglat: {
            handler(val, oldVal) {
                if (this.security) {
                    this.setState('pickupLnglat', oldVal)
                    this.$message.error('请通过 setState 方法修改状态');
                } else {
                    this.security = true;
                }
            },
        }
    },
    methods: {
        // 受控状态修改
        setState(key, val) {
            this.security = false;
            this[key] = val;
        }   
    },
}