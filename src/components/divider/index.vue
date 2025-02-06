<!--

	component: ny-divider
	description: 分割线组件
	attributes:
        - type: 分割线类型，line为直线，frame为框架
        - context: 分割线文案
		- size: 分割线大小
		- color: 分割线颜色
		- content-position: 分割线文案的位置
	author: Liu.Y.X
	date: 2025-01-21

-->

<template>
    <div class="ny-divider-container">
        <template v-if="type === 'line'">
            <div class="ny-divider-line">
                <div name="icon"></div>
                <span class="ny-divider-title">{{ context }}</span>
            </div>
        </template>
        <template v-else-if="type === 'frame'">
            <div class="ny-divider-frame">
                <div class="ny-divider-frame-icon">
                    <slot name="icon"></slot>
                </div>
                <span class="ny-divider-title">{{ context }}</span>
            </div>
        </template>
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
    type: {
        type: String,
        default: 'line'
    },
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

    // 分割线样式
    .ny-divider-line {
        width: 100%;
        height: 1px;
        background-color: #3f9eff;
        position: relative;

        .ny-divider-title {
            margin-left: 5px;
        }

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

    // 框架样式
    .ny-divider-frame {
        width: 100%;
        height: 30px;
        box-shadow: rgba(204, 204, 204, 0.7) 0px 5px 10px 0px;
        border-radius: 3px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .ny-divider-frame-icon {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 10px;
        }
        .ny-divider-title {
            margin-left: 5px;
        }

        span {
            color: rgba(63, 158, 255, 1);
            font-size: 14px;
            font-weight: bold;
        }
    }
}
</style>