<template>
    <div id="my-cards" class="my-cards" v-if="isVisble">
        <div class="my-card red" @click="handleShowDialog('mapType')">
            瓦片底图
        </div>
        <div class="my-card blue" @click="handleShowDialog('mapSearch')">
            搜索指定道路
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
    props: {
        'isVisble': {
            type: Boolean,
            default: false
        },
        'pageX': {
            type: Number,
            default: 0
        },
        'pageY': {
            type: Number,
            default: 0
        }
    },
    watch: {
        'pageX': function (val) {
            if (val) {
                this.$nextTick(() => {
                    const dom = document.getElementById('my-cards');
                    dom.style.left = `${val}px`;
                })
            }
        },
        'pageY': function (val) {
            if (val) {
                this.$nextTick(() => {
                    const dom = document.getElementById('my-cards');
                    dom.style.top = `${val - 50}px`;
                })
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
        // 右键菜单事件
        handleShowDialog(type) {
            // 调用父组件属性
            this.$parent.isContextMenuVisible = false;
            this.$parent.isEditVisble = false;
            this.$parent.isVisble = true;
            this.$parent.dialogType = type;
        }
    }
};
</script>

<style scoped lang="scss">
.my-cards {
  display: flex;
  flex-direction: column;
  gap: 5px;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 10px 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}

.my-cards .red {
  background-color: #f43f5e;
}

.my-cards .blue {
  background-color: #3b82f6;
}

.my-cards .green {
  background-color: #22c55e;
}

.my-cards .my-card {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  height: 30px;
  width: 100px;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: 400ms;
}

.my-cards .my-card {
  font-size: 12px;
  font-weight: 700;
}

.my-cards .mycard {
  font-size: 12px;
}

.my-cards .my-card:hover {
  transform: scale(1.1, 1.1);
}

.my-cards:hover > .my-card:not(:hover) {
  filter: blur(10px);
  transform: scale(0.9, 0.9);
}
</style>
