<!--

	component: ny-search
	description: 搜索组件
	attributes:
		size: 组件大小，可选值：small、medium、large
		handleSearch: 搜索事件 type: Function
	author: Liu.Y.X
	date: 2025-01-21

-->
<template>
	<div class="ny-search">
		<div class="ny-search-container">
			<ny-input
				v-model="searchText"
				placeholder="输入内容点击「搜索」..."
			/>
			<ny-button class="ny-search-btn" type="primary" @click="handleSearch">搜索</ny-button>
		</div>
	</div>
</template>

<script>
import {
	ref,
	onBeforeMount,
	onMounted,
	onBeforeUpdate,
	onUpdated,
	getCurrentInstance,
} from 'vue';
import { useStore } from 'vuex'
import { debounce } from '@/utils/index.js'
import nyInput from '@/components/input/index.vue'
import nyButton from '@/components/button/index.vue'
export default {
	name: 'ny-search',
	components: {
		nyInput,
		nyButton
	},
	props: {
		size: {
			type: String,
			default: 'medium'
		}
	},
	setup(props, { emit }) {
		const app = getCurrentInstance(); // 获取当前组件的实例
		const proxy = app.proxy; // 获取当前组件的代理对象
		const store = useStore();

		const searchText = ref('');

		// 搜索
		const handleSearch = debounce(() => {
			emit('handleSearch', searchText.value || '')
		}, 300)

		// 清理
		const handleClearSearch = debounce(() => {
			searchText.value = '';
		}, 100)

		onBeforeMount(() => {

		});

		onMounted(() => {

		});

		onBeforeUpdate(() => {

		});

		onUpdated(() => {

		});

		return {
			searchText,
			handleSearch,
			handleClearSearch,
			debounce
		}
	}
}
</script>

<style scoped lang="less">
.ny-search {
	width: 100%;
	height: 70px;
	display: flex;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;

	.ny-search-container {
		width: 475px;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>