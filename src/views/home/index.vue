<template>
    <div class="home-container">
		<ny-search
            @handleSearch="handleSearch"
        ></ny-search>
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
import nySearch from '@/components/search'

export default {
    name: 'home-container',
	components: {
		nySearch
	},
    setup() {
        const app = getCurrentInstance(); // 获取当前组件的实例
        const refRac = reactive({

        });

        const handleSearch = (val) => {
            console.log(val);
        }


        onBeforeMount(() => {

        });

        onMounted(() => {

        });

        onBeforeUpdate(() => {

        });

        onUpdated(() => {

        });


        return {
            handleSearch
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