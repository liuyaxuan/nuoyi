<!--

	component: ny-button
	description: 按钮组件
	attributes:
        type: 按钮类型，默认text
		size: 组件大小，可选值：small、medium、large
        disabled: 按钮是否禁用，可选值：true、false
        loading: 按钮是否加载中，可选值：true、false
		handleSearch: 搜索事件 type: Function
	author: Liu.Y.X
	date: 2025-01-21

-->

<template>
    <div v-if="loading">
        <div class="ny-button-disabled">
            <img class="loading-status" :src="loadingICON" />
        </div>
    </div>
    <div v-else>
        <button
            class="ny-button"
            type="primary"
            :disabled="false"
            @click="handleClick"
        >
            搜索
        </button>
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
import loadingICON from '@/assets/icons/white/loading.svg';

defineOptions({
    name: 'ny-button'
})
const emit = defineEmits(['click']);

defineProps({
    // 按钮类型
    type: {
        type: String,
        default: 'primary',
    },
    // 按钮大小
    size: {
        type: String,
        default: 'medium',
    },
    // 是否禁用
    disabled: {
        type: Boolean,
        default: false,
    },
    // 是否加载中
    loading: {
        type: Boolean,
        default: false,
    }
})

const app = getCurrentInstance(); // 获取当前组件的实例

const handleClick = () => {
    emit('click');
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
.ny-button {
    width: 90px;
    height: 46px;
    border-radius: 12px;
    margin-left: 5px;
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
    background-color: #3f9eff;
    border-color: transparent;
    border: 0px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.ny-button-disabled {
    width: 90px;
    height: 46px;
    border-radius: 12px;
    margin-left: 5px;
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
    background-color: #8fc7ff;
    border-color: transparent;
    border: 0px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: not-allowed;

    .loading-status {
        animation: rotate 1s linear infinite;
    }
    @keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
    }
}

.ny-button:active {
    background-color: #237dd8;
}
</style>