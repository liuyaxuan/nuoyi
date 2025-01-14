<template>
	<div class="my-loading" v-if="loading">
		<div class="loader">
			<span>&lt;</span>
			<span>LOADING</span>
			<span>/&gt;</span>
		</div>
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
		getCurrentInstance,
		computed, // 获取当前组件的实例
	} from 'vue';
	import { useStore } from 'vuex'
	export default {
		name: 'my-loading',
		components: {},
		setup() {
			const app = getCurrentInstance(); // 获取当前组件的实例
			const proxy = app.proxy; // 获取当前组件的代理对象
			const store = useStore();
			// 计算属性
			const loading = computed(() => {
				return store.state.system.loading;
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
				loading
			}
		}
	}
</script>

<style scoped lang="less">
	.my-loading {
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0px;
		z-index: 9999;
	}

	.loader {
		font-size: 1.5em;
		font-weight: 900;
	}

	.loader>* {
		color: rgba(255, 255, 255, 1);
	}

	.loader span {
		display: inline-flex;
	}

	.loader span:nth-child(2) {
		letter-spacing: -1em;
		overflow: hidden;
		animation: reveal 1500ms cubic-bezier(0.645, 0.045, 0.355, 1) infinite alternate;

		&:after {
			content: '...';
			display: inline;
		}
	}

	@keyframes reveal {

		0%,
		100% {
			opacity: 0.5;
			letter-spacing: -1em;
		}

		50% {
			opacity: 1;
			letter-spacing: 0em;
		}
	}
</style>