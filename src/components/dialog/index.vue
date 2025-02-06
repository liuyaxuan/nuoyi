<!--

	component: ny-dialog
	description: Dialog对话框
	attributes:
        - show: 是否显示对话框
        - title: 标题
        - context: 内容
		- close: 关闭事件 type: Function
  slot:
    - 默认插槽：用于放置内容
	author: Liu.Y.X
	date: 2025-02-05

-->

<template>
    <div class="ny-dialog" v-if="show">
        <div class="cover"></div>
        <div class="dialog-fly-in">
            <div class="ny-dialog-header">
                <span class="ny-dialog-title" >{{ title }}</span>
                <span class="ny-dialog-close" @click="handleClose">X</span>
            </div>
            <div class="ny-dialog-context">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    onBeforeMount,
    onMounted,
    onBeforeUpdate,
    onUpdated,
    getCurrentInstance, // 获取当前组件的实例
    defineOptions,
    defineProps,
    defineEmits,
} from 'vue';


defineOptions({
    name: 'ny-dialog'
})

defineProps({
    show: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: '标题'
    },
    context: {
        type: String,
        default: ''
    },
})


const app = getCurrentInstance(); // 获取当前组件的实例
const { props } = app; // 获取当前组件的props
const emit = defineEmits(['close'])

const handleClose = () => {
    emit('close')
}

onBeforeMount(() => {

});

onMounted(() => {

});

onBeforeUpdate(() => {

});

onUpdated(() => {

});
</script>

<style scoped lang="less">
.cover {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
}

.dialog-fly-in {
    width: 0px;
    height: 0px;
    position: absolute;
    top: 0%;
    right: 0%;
    border-radius: 6px;
    box-shadow: 0px 2px 2px #464646;
    border: 1px solid #ebebeb;
    background-color: #ffffff;
    overflow: hidden;
    animation: flyIn .5s forwards;

    .ny-dialog-header {
        width: 100%;
        height: 40px;
        background-color: #f5f5f5;
        border-bottom: 1px solid #ebebeb;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        box-sizing: border-box;
        font-size: 14px;
        color: #333333;

        .ny-dialog-title {
            font-size: 16px;
            font-weight: bold;
        }

        .ny-dialog-close {
            cursor: pointer;
            font-size: 16px;
        }
    }
}
.ny-dialog-context {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 10px;
    box-sizing: border-box;
}

@keyframes flyIn {
    0% {
        transform: translate(0, 0);
    }

    100% {
        width: 700px;
        height: auto;
        top: 30%;
        right: 50%;
        transform: translate(50%, 50%);
    }
}
</style>