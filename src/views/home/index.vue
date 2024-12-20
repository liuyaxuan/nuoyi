<template>
    <div class="home-container">
        <h1>HOME</h1>
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
    name: 'home-container',
    setup() {
        const app = getCurrentInstance(); // 获取当前组件的实例
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

</style>