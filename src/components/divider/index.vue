<!--

	component: ny-divider
	description: 分割线组件
	attributes:
        - context: 分割线文案
		- size: 分割线大小
		- color: 分割线颜色
		- border-style: 分割线样式
		- border-width: 分割线宽度
		- border-radius: 分割线圆角
		- content-position: 分割线文案的位置
	author: Liu.Y.X
	date: 2025-01-21

-->

<template>
    <div class="ny-divider-container">
        <div class="ny-divider-line">
            <span>{{ context }}</span>
        </div>
    </div>
</template>

<script setup>
import {
    ref,
    onBeforeMount,
    onMounted,
    onBeforeUpdate,
    onUpdated,
    getCurrentInstance, // 获取当前组件的实例
    defineOptions,
    defineProps,
} from 'vue';
import { useStore } from 'vuex'


defineOptions({
    name: 'ny-divider'
})

defineProps({
    context: {
        type: String,
        default: '分割线'
    },
    size: {
        type: String,
        default: '1px'
    },
    color: {
        type: String,
        default: '#000'
    },
    borderStyle: {
        type: String,
        default: 'solid123'
    },
    borderWidth: {
        type: String,
    }
})


const app = getCurrentInstance(); // 获取当前组件的实例
const proxy = app.proxy; // 获取当前组件的代理对象
const store = useStore();


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
.ny-divider-container {
    width: 100%;
    margin: 15px 0;
    display: flex;
    justify-content: left;

    .ny-divider-line {
        width: 100%;
        height: 1px;
        background-color: #3f9eff;
        position: relative;

        span {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #3f9eff;
            font-size: 14px;
            font-weight: bold;
            background-color: #fff;
            padding-left: 10px;
            padding-right: 10px;
        }
    }
}
</style>