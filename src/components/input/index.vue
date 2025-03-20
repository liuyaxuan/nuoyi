<!--

	component: ny-input
	description: 输入框组件
	attributes:
        placeholder：输入框提示
        type: 输入框类型，默认text
        name: 输入框name
		size: 组件大小，可选值：small、medium、large (textarea 设置 size 无效)
        autocomplete: 输入框自动完成，可选值：on、off
        disabled: 输入框是否禁用，可选值：true、false
	author: Liu.Y.X
	date: 2025-01-21
    update: [2025-03-20, 增加 textarea 类型，增加 size 属性，增加 disabled 属性]

-->

<template>
    <div class="ny-input-container">
        <template v-if="type === 'text'">
            <input :class="'ny-input ' + size" :placeholder="placeholder" type="text" name="text" :autocomplete="autocomplete"
                :value="inputValue" @input="handleInput" />
            <img v-if="inputValue" class="clear-btn" :src="deleteICON" alt="" @click="handleClear" />
        </template>
        <template v-else-if="type === 'textarea'">
            <textarea
                class="ny-textarea"
                name="textarea"
                :disabled="disabled"
                :value="inputValue"
                @input="handleInput"
            ></textarea>
        </template>
    </div>
</template>

<script setup>
import {
    ref,
    watch,
    onBeforeMount,
    onMounted,
    onBeforeUpdate,
    onUpdated,
    getCurrentInstance, // 获取当前组件的实例
    defineOptions,
    defineProps,
    defineEmits,
} from 'vue';
import { useStore } from 'vuex'
import { debounce } from '@/utils/index.js'
// 静态资源 svg
import deleteICON from "@/assets/icons/blue/delete.svg";


defineOptions({
    name: 'ny-input'
})

const props = defineProps({
    // 输入框内容
    modelValue: {
        type: String,
        required: true
    },
    // 输入框类型
    type: {
        type: String,
        default: 'text',
    },
    // 大小
    size: {
        type: String,
        default: 'medium',
    },
    // 输入框提示
    placeholder: {
        type: String,
        default: '请输入内容'
    },
    // 自动完成
    autocomplete: {
        type: String,
        default: 'off',
    },
    // 是否禁用
    disabled: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:modelValue']);


const app = getCurrentInstance(); // 获取当前组件的实例
const proxy = app.proxy; // 获取当前组件的代理对象
const store = useStore();

const inputValue = ref('');

// 输入
const handleInput = (e) => {
    inputValue.value = e.target.value || '';
    emit('update:modelValue', e.target.value);
}

// 清理
const handleClear = debounce(() => {
    inputValue.value = '';
    emit('update:modelValue', inputValue.value);
}, 100)

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
.ny-input-container {
    display: flex;
    align-items: center;
    justify-content: center;

    .ny-input {
        width: 220px;
        max-width: 320px;
        height: 20px;
        padding: 12px;
        padding-right: 30px;
        border-radius: 12px;
        border: 1.5px solid lightgrey;
        outline: none;
        transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
        box-shadow: 0px 0px 20px -18px;
        position: relative;
    }

    .ny-input:hover {
        border: 1.5px solid lightgrey;
        box-shadow: 0px 0px 20px -17px;
    }

    .ny-input:active {
        .set-scale(0.97);
    }


    .ny-input:active~img {
        .set-scale(0.85);
    }

    .ny-input:focus {
        border: 1.5px solid #3f9eff;
    }

    .clear-btn {
        width: 15px;
        height: 15px;
        font-size: 15px;
        position: absolute;
        right: 160px;
        top: 15px;
        filter: saturate(0%);
    }

    .clear-btn:hover {
        cursor: pointer;
        color: #8e8e8e;
    }

    .clear-btn:active {
        .set-scale(0.85);
    }


    .set-scale(@scale) {
        transform: scale(@scale);
    }

    // 多行文本框
    .ny-textarea {
        width: 100%;
        height: 100%;
        resize: none;
        box-sizing: border-box;
        padding: 5px;
        margin: 0;
        border-radius: 12px;
        border: 1.5px solid lightgrey;
        outline: none;
        transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
    }
}
</style>