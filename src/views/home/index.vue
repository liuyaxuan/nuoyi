<template>
    <div class="home-container">
		<my-search></my-search>
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
// 组件
import mySearch from '@/components/search'

export default {
    name: 'home-container',
	components: {
		mySearch
	},
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
	.home-container {
		width: 100%;
		height: 100%;
		background: #f5f5f5;
	}

</style>