export const heatMap = {
    data() {
        return {
            heatmap: false,
            heatmapLayer: {},
        }
    },
    methods: {
        /**
         * @param Array 传入参数类型为数组
         *              数据格式[{"lat":30.80337,"lng":104.220135,"value":1.2847222222}, ......]
         * @description 绘制热力图
         */
        handleHeatMap(data) {
            if (!this.isArray(data)) {
                this.$message.error('请传入数组类型数据')
                return
            }
            let arr = [];
            const heatData = data;
            this.heatmapLayer = L.heatLayer(heatData, {
                radius: 10,
            }).addTo(this.map);
        },
    }
}