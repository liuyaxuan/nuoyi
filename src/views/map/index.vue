<template>
	<div class="map-container">
		<!-- leaflet map -->
		<my-leaflet></my-leaflet>
	</div>
</template>

<script>
	import myLeaflet from './components/leaflet/leaflet.vue';
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
			myLeaflet
		},
		setup() {
			const app = getCurrentInstance(); // 获取当前组件的实例

			onBeforeMount(() => {

			});

			onMounted(() => {
				
			});

			onBeforeUpdate(() => {

			});

			onUpdated(() => {

			});


			return {
				// 函数
			};
		}
	}
</script>

<style scoped lang="less">
	.map-container {
		width: 100%;
		height: 100%;
		background-color: #f5f5f5;

		#map {
			width: 100%;
			height: 100%;
		}
		.top {
			position: absolute;
			top: 10px;
			right: 10px;
		}
	}
</style>