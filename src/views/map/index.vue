<template>
    <div class="map-container">
        测试页面
    </div>
</template>

<script>

import {
    reactive,
    ref,
    onBeforeMount,
    onMounted,
    onBeforeUpdate,
    onUpdated,
    getCurrentInstance, // 获取当前组件的实例
} from 'vue';

export default {
    name: 'map-container',
    components: {
    },
    setup() {
        const app = getCurrentInstance(); // 获取当前组件的实例
        const title = ref('404');
        const context = ref('页面未找到');
        const refRac = reactive({

        });

        onBeforeMount(() => {

        });

        onMounted(() => {
            
        });

        onBeforeUpdate(() => {

        });

        onUpdated(() => {

        });


        return {

        };
    }
}
</script>

<style scoped>
.map-container {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
}
</style>