<template>
	<div id="textarea-container" class="drawer textarea-container">
		<div class="trapezoid" @click="handleOpen('textarea-container')">
			<div class="trapezoid-inner">数据</div>
		</div>
		<div class="textarea-container-info">
			<div class="input-tips">
				<el-popover
					placement="bottom"
					title="提示"
					:width="220"
					trigger="hover"
					content="点击图标,打开输入数据示例"
				>
					<template #reference>
						  <el-icon><InfoFilled /></el-icon>
					</template>
				</el-popover>
				<span>请输入合法JSON格式</span>
			</div>
			<el-input
				class="el-input-textarea"
			    v-model="textareaData"
			    type="textarea"
				resize="none"
			    placeholder="请输入JSON..."
				@paste="handlePaste"
			/>
			<div class="error-tips">{{ errorTips }}</div>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted,
		getCurrentInstance,
		watch,
	} from 'vue';
	
	// 当前实例
	const app = getCurrentInstance();
	// 挂载到全局的方法
	const proxy = app.proxy;
	// props
	const props = defineProps({
		// 数据
		handleMapData: {
			type: Function
		},
	});
	// 响应式状态
	const textareaData = ref('');
	const errorTips = ref('');
	
	
	// 监听输入框内容
	watch(textareaData, (newVal) => {
		errorTips.value = '';
		if (['[]', '{}', ''].includes(newVal)) return
		if (isObjectOrArray(newVal)) {
			const data = JSON.parse(newVal); // 将字符串转换为对象
			props.handleMapData(data);
		} else {
			errorTips.value = '请输入合法的数组或对象格式数据';
		}
	});
	
	const handleOpen = (id) => {
		let drawer = document.getElementsByClassName('drawer');
		let dom = document.getElementById(id);
		if (dom.style.right == '30px') {
			dom.style.right = '-300px';
		} else {
			dom.style.right = '30px';
			for (let i = 0; i < drawer.length; i++) {
				if (drawer[i].id !== id) {
					drawer[i].style.right = '-300px';
				}
			}
		}
	}
	
	function handlePaste() {
      // 获取粘贴板上的文本内容
      const pasteContent = event.clipboardData.getData('text/plain');
      // 检查文本内容的大小（以字节为单位）
      const sizeInBytes = new Blob([pasteContent]).size;
      // 设置允许的最大大小（例如 10MB）
      const maxAllowedSize = 10 * 1024 * 1024;

      if (sizeInBytes > maxAllowedSize) {
        // 如果文本内容超过 10MB，则阻止粘贴
        event.preventDefault();
		proxy.$message({
			message: '粘贴内容过大，最大允许10MB',
			type: 'error'
		});
      }
	}
	
	// 判断是否为对象或数组
	const isObjectOrArray = (value) => {
		try {
			value = JSON.parse(value);
			return /^\[object Array\]|\[object Object\]$/.test(Object.prototype.toString.call(value));
		} catch (e) {
			return false;
		}
	}
	
	onMounted(() => {
		
	})
	
</script>

<style scoped lang="less">
	.textarea-container {
		position: absolute;
		top: 10px;
		right: -300px;
		width: 300px;
		height: 60vh;
		background-color: rgba(255, 255, 255, 0.8);
		border-radius: 6px;
		box-shadow: 2px 5px 5px rgba(0, 0, 100, 0.6);
		z-index: 998;
		transition: right 0.5s ease-in-out;
		
		.textarea-container-info {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			
			.input-tips {
				width: 100%;
				height: 30px;
				display: flex;
				justify-content: left;
				align-items: center;
				font-size: 12px;
				color: #000;
				font-weight: bold;
				padding-left: 10px;
				
				::v-deep .el-icon {
					color: #3f9eff !important;
					cursor: pointer;
				}
				
				span {
					margin-left: 5px;
				}
			}
		
			.el-input-textarea {
				width: 100%;
				height: 100%;
				padding: 0px 10px 10px 10px;
				box-sizing: border-box;
				overflow-y: auto;
				
				::v-deep .el-textarea__inner {
					height: 100% !important;
				}
			}
			
			.error-tips {
				width: calc(100% - 20px);
				height: 30px;
				display: flex;
				justify-content: left;
				align-items: center;
				font-size: 12px;
				color: #f56c6c;
				font-weight: bold;
			}
		}
		
		.trapezoid {
		    position: relative;
			top: 40px;
			left: -30px;
		    width: 30px;
		    height: 50px;
		    background: rgba(255, 255, 255, 1);
			border-radius: 6px 6px;
			cursor: pointer;
			.trapezoid-inner {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				font-size: 13px;
				text-align: center;
				color: #000;
				font-weight: bold;
				writing-mode: vertical-rl;
				text-orientation: upright;
				z-index: 999;
				border-radius: 6px 6px;
			}
		}
		.trapezoid:hover {
			background-color: #3f9eff;
			.trapezoid-inner {
				color: #fff;
			}
		}
		
				         
		.trapezoid::before,
		.trapezoid::after {
		    content: '';
		    position: absolute;
		    top: 0;
		    width: 100%;
		    height: 100%;
		    background: inherit;
		    border-radius: inherit;
			border-radius: 6px 0px 0px 6px;
		}
				         
		.trapezoid::before {
		    right: 0%;
			top: -15%;
		    transform: skewY(-28deg);
		}
				         
		.trapezoid::after {
		    right: 0%;
			top: 15%;
		    transform: skewY(28deg);
		}
	}
</style>