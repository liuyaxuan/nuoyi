<template>
    <div class="error-container">
        <h1>{{ title }}</h1>
        <p>{{ context }}</p>
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
    name: 'error-container',
    setup() {
        const app = getCurrentInstance(); // 获取当前组件的实例
        const title = ref('404');
        const context = ref('页面未找到');
        const refRac = reactive({

        });

        const current = getCurrentInstance();
        const getMsg = () => {

        };

        onBeforeMount(() => {

        });

        onMounted(() => {
            console.log('app', app.proxy.$router)
        });

        onBeforeUpdate(() => {

        });

        onUpdated(() => {

        });


        return {
            title,
            context,
            refRac
        };
    }
}
</script>

<style scoped>
.error-container {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;

    /* h1 { } */
}

h1 {
    margin: 0px;
}
</style>