<template>
    <div class="window-continer" >
        <!-- 关闭按钮 -->
        <i class="el-icon-error closeMsg" @click="this.closeMsg"></i>
        <div class="window-header">
            <span>提示</span>
        </div>
        <div class="window-body">
            <div class="msg-item">
                <div class="msg-item-body">
                    <template v-if="type == 'marker'">
                        <div class="msg-item-row">1、[30.662325, 104.065716]</div>
                        <div class="msg-item-row">2、[ [51.505, -0.09], [51.51, -0.1], [51.51, -0.12] ]</div>
                        <div class="msg-item-row">3、{"type": "MultiLineString","coordinates": [[[110.37398529052734,22.813282012939453],[110.3780746459961,22.814851760864258]]]}</div>
                    </template>
                    <template v-if="type == 'lines'">
                        <div class="msg-item-row">1、[[51.505, -0.09], [51.51, -0.1], [51.51, -0.12]]</div>
                        <div class="msg-item-row">2、{"type": "MultiLineString","coordinates": [[[110.37398529052734,22.813282012939453],[110.3780746459961,22.814851760864258 ]]]}</div>
                        <div class="msg-item-row">3、[{"type": "MultiLineString","coordinates": [[[110.37398529052734,22.813282012939453],[110.3780746459961,22.814851760864258]]]},
                            {"type": "MultiLineString","coordinates": [[[110.38549661636353, 22.814815145643337],[110.39064645767213, 22.8136679653952]]]}]</div>
                    </template>
                    <template v-if="type == 'polygon'">
                        <div class="msg-item-row">1、[{"type": "MultiPolygon","coordinates": [ [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]]]}]</div>
                    </template>
                    <template v-if="type == 'drawCircle'">
                        点击鼠标左键不松确定圆心，拖动鼠标到指定位置后释放鼠标左键确定半径，自动按照指定半径绘制圆形区域。
                    </template>
                    <template v-if="type == 'drawPolygon'">
                        单击鼠标左键确认开始点位置，拖动鼠标到指定位置后单击鼠标左键，继续绘制出所需多边形后，在结束点双击双标左键完成绘制。
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: "message-window",
    components: {

    },
    computed: {
        ...mapState({
            sidebar: state => state.app.sidebar,
        }),
    },
    props: ['type'],
    watch: {
        'type': function(val) {
            // 信息提示窗体动画
            if (['move', 'clear', 'copy'].includes(val)) {
                this.closeMsg();
            } else {
                let timer = null;
                if (document.querySelector('.window-continer').style.left !== '') {
                    this.closeMsg();
                    timer = setTimeout(() => {
                        this.openMsg();
                        clearTimeout(timer);
                    }, 300)
                } else {
                    this.openMsg();
                }
            }
        }
    },
    data() {
        return {

        }
    },
    created() {
    },
    beforeDestroy() {

    },
    mounted() {
    },
    methods: {
        openMsg() {
            const w = document.querySelector('.window-continer').offsetWidth + 80;
            document.querySelector('.window-continer').style.transition = 'all 0.2s linear 0s';
            document.querySelector('.window-continer').style.left = '20px';
        },
        closeMsg() {
            const w = document.querySelector('.window-continer').offsetWidth + 80;
            document.querySelector('.window-continer').style.transition = 'all 0.1s linear 0s';
            document.querySelector('.window-continer').style.left = '-' + w + 'px';
        }
    }
};
</script>

<style scoped lang="scss">
.window-continer {
    width: auto;
    min-width: 300px;
    max-width: 500px;
    height: auto;
    border-radius: 12px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.6);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
    position: absolute;
    bottom: 10px;
    left: -400px;
    z-index: 9999;
    .closeMsg {
        width: 70px;
        height: 70px;
        position: absolute;
        right: -65px;
        top: -20px;
        color: #5c5c5c;
        font-size: 25px;
        cursor: pointer;
    }
    .window-header {
        width: 100%;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid rgba(204, 204, 204, 0.3);
        span {
            font-weight: bold;
            margin-left: 10px;
        }
    }
    .window-body {
        width: 100%;
        height: 100%;
        overflow: auto;
        .msg-item-body {
            line-height: 20px;
            padding: 10px 10px;
            font-size: 14px;
            width: 100%;
            .msg-item-row {
                margin-bottom: 10px;
                white-space: normal;
                overflow: visible;
            }
        }
    }
}
</style>
