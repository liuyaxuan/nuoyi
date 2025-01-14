<template>
	<div class="breadcrumb-container">
		<el-breadcrumb separator-icon="ArrowRight">
			<el-breadcrumb-item
				v-for="(item, index) in state.list"
				:key="index"
				:to="{ path: item.path }"
				@click="handleClick(item.path)"
			>
				{{ item.name }}
			</el-breadcrumb-item>
		</el-breadcrumb>
	</div>
</template>

<script setup>
	import {
		reactive,
		ref,
		watch,
		onBeforeMount,
		onMounted,
		onBeforeUpdate,
		onUpdated,
		getCurrentInstance, // 获取当前组件的实例
		defineOptions,
		defineProps,
		defineComponent,
	} from 'vue';
	import { useRouter, useRoute } from 'vue-router';

	defineOptions({
		name: 'myBreadcrumb'
	})
	// 定义props
	const props = defineProps({

	})
	// 注册组件
	defineComponent({
		components: {

		}
	})

	const $router = useRouter(); // 获取路由实例
	const $route = useRoute(); // 获取当前路由信息
	
	const state = reactive({
		list: []
	});
	
	// 监听路由
	watch(() => $route, (newVal, oldVal) => {
		const { matched } = newVal;
		state.list = matched.map(item => {
			return {
				path: item.path,
				name: item.meta.title
			}
		})
	}, { immediate: true, deep: true })
	
	const handleClick = (path) => {
		if (path !== $route.fullPath) {
			$router.push(path);
		}
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
	.breadcrumb-container {
		width: 100%;
		height: auto;
		padding: 5px 10px;
		background-color: transparent;
		position: relative;
	}
</style>