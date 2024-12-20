<template>
    <div id="my-dialog" class="my-dialog" v-if="dialogVisble">
        <div class="my-dialog-content">
            <h3><slot name="header-title"></slot></h3>
            <slot name="content"></slot>
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: "my-dailog",
    components: {

    },
    computed: {
        ...mapState({
            sidebar: state => state.app.sidebar,
        }),
    },
    props: ['dialogVisble', 'unfold'],
    watch: {
        'dialogVisble': function(val) {
            if(val) {
                this.setDialogPosition();
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
        // 设置弹窗打开方向
        setDialogPosition() {
            this.$nextTick(() => {
                if (this.unfold == 'right') {
                    document.querySelector('.my-dialog').style.left = 'unset';
                    document.querySelector('.my-dialog').style.right = '-120px';
                    document.querySelector('.my-dialog').style.top = '50%';
                } else {
                    document.querySelector('.my-dialog').style.right = 'unset';
                    document.querySelector('.my-dialog').style.top = '25%';
                    document.querySelector('.my-dialog').style.left = 'calc(13%)';
                }
            })
        }
    }
};
</script>

<style scoped lang="scss">
    .my-dialog {
        width: auto;
        height: auto;
        position: absolute;
        top: 28%;
        // left: calc(8%  + 15px);
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
    }

    .my-dialog-content {
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(12px);
        border-radius: 12px;
    }
</style>
