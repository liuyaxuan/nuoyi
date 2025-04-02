<!--

	author: Liu.Y.X
	date: 2025-02-07

-->

<template>
    <!-- loading -->
    <my-loading></my-loading>
    <div class="login-container">
        <!-- 表单 -->
        <form class="form">
            <span class="input-span">
                <label for="username" class="label">{{ placeholderUSN }}</label>
                <input v-model="username" type="username" name="username" id="username" autocomplete="off" /></span>
            <span class="input-span">
                <label for="password" class="label">{{ placeholderPSD }}</label>
                <input v-model="password" type="password" name="password" id="password" autocomplete="off" /></span>
            <span class="forget span">
                <input
                    class="check"
                    :checked="remember" 
                    type="checkbox"
                    @click="handleCheck"
                >
                <a class="remember" href="#">记住密码</a>
                <a href="#">忘记密码?</a>
            </span>
            <div class="submit" @click="handleSubmit">登录</div>
            <span class="span">还没有账号? <a href="">注册</a></span>
        </form>
        <!-- 背景 -->
        <div class="meteor"></div>
        <div class="meteor"></div>
        <div class="meteor"></div>
        <div class="earth-background">
            <div class="bg-cover"></div>
            <div class="earth"></div>
        </div>
    </div>
</template>

<script setup>
import {
    ref,
    onBeforeMount,
    onMounted,
    onBeforeUpdate,
    onUpdated,
    getCurrentInstance, // 获取当前组件的实例
    defineOptions,
    defineProps,
    defineComponent
} from 'vue';
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router';
// 导入loading组件(全局)
import myLoading from '@/components/loader/loading.vue';
// api请求
import { login } from "@/api/login/login.js";

defineOptions({
    name: 'login'
})
defineComponent({
    components: {
        myLoading
    }
})

defineProps({})


const $router = useRouter(); // 获取路由实例
const $route = useRoute(); // 获取当前路由信息
const app = getCurrentInstance(); // 获取当前组件的实例
const proxy = app.proxy; // 获取当前组件的代理对象
const store = useStore();

const username = ref('');
const password = ref('');
const placeholderUSN = ref('账号');
const placeholderPSD = ref('密码');
const remember = ref(false);

const handleFocusUSN = () => {
    placeholderUSN.value = '请输入账号'
}
const handleBlurUSN = () => {
    placeholderUSN.value = '账号:'
}

const handleFocusPSD = () => {
    placeholderPSD.value = '请输入密码'
}
const handleBlurPSD = () => {
    placeholderPSD.value = '密码:'
}

const handleCheck = () => {
    remember.value = !remember.value;
    if (remember.value) {
        localStorage.setItem('username', username.value || '');
        localStorage.setItem('password', password.value || '');
    } else {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
    }
}

const handleSubmit = () => {
    if (username.value === '' || password.value === '') {
        return;
    }
    login({
        username: username.value || '',
        password: password.value || ''
    }).then(res => {
        if (res.code === 200) {
            store.commit('setToken', res.token || '');
            $router.replace('/index');
        }
    })
}

const handleInForm = () => {
}
const handleLeaveForm = () => {
}


onBeforeMount(() => {

});

onMounted(() => {
    // 获取是否记录账号密码
    const usn = localStorage.getItem('username') || '';
    const psd = localStorage.getItem('password') || '';
    username.value = usn;
    password.value = psd;
    if (usn && psd) {
        remember.value = true;
    }
});

onBeforeUpdate(() => {

});

onUpdated(() => {

});
</script>

<style scoped lang="less">
// 登录表单
.form {
    --bg-light: #efefef;
    --bg-dark: #707070;
    --clr: #58bc82;
    --clr-alpha: #9c9c9c60;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 300px;
    position: absolute;
    top: 45%;
    left: 80%;
    z-index: 1;
    transform: translate(-50%, -50%);
    padding: 20px 20px;
    box-sizing: border-box;
}

.form:hover {
    border-radius: 12px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
}

.form .input-span {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form input[type="username"],
.form input[type="password"] {
    border-radius: 0.5rem;
    padding: 1rem 0.75rem;
    width: 100%;
    box-sizing: border-box;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: var(--clr-alpha);
    outline: 2px solid var(--bg-dark);
    color: var(--clr);
}

.form input[type="username"]:focus,
.form input[type="password"]:focus {
    outline: 2px solid var(--clr);
}

.label {
    align-self: flex-start;
    color: var(--clr);
    font-weight: 600;
}

.form .submit {
    padding: 1rem 0.75rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    border-radius: 3rem;
    background-color: var(--bg-dark);
    color: var(--clr);
    border: none;
    cursor: pointer;
    transition: all 300ms;
    font-weight: 600;
    font-size: 0.9rem;
}

.form .submit:hover {
    background-color: var(--clr);
    color: var(--bg-light);
}

.span {
    text-decoration: none;
    color: var(--bg-dark);
}

.span a {
    color: var(--clr);
}

.forget {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;

    // 记住账号密码复选框
    .check {
        position: relative;
        width: 15px;
        height: 15px;
        border-radius: 2px;
        appearance: none;
        background-color: #bbb;
        transition: all .3s;
        margin-right: 5px;
        cursor: pointer;
    }

    .check::before {
        content: '';
        position: absolute;
        border: solid #fff;
        display: block;
        width: .3em;
        height: .6em;
        border-width: 0 .2em .2em 0;
        z-index: 1;
        opacity: 0;
        right: calc(50% - .3em);
        top: calc(50% - .6em);
        transform: rotate(0deg);
        transition: all .3s;
        transform-origin: center center;
    }

    .check:checked {
        animation: a .3s ease-in forwards;
        background-color: rgb(120, 190, 120);
    }

    .check:checked::before {
        opacity: 1;
        transform: rotate(405deg);
    }

    @keyframes a {
        0% {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
        }

        50% {
            opacity: 0;
            transform: scale(.8) rotateY(180deg);
        }

        100% {
            opacity: 1;
            transform: scale(1) rotateY(360deg);
        }
    }
}

.remember {
    margin-right: 20px;
}

// 流星
.meteor {
    position: absolute;
    z-index: 999;
    top: -10px;
    right: -10px;
    width: 1px;
    height: 100px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
    transform-origin: top right;
    transform: rotate(45deg);
    animation: meteorFall 3s linear infinite;
    animation-delay: calc(-1 * (6s * var(--random)));
}

@keyframes meteorFall {
    0% {
        top: -10px;
        right: -10px;
        opacity: 1;
    }

    100% {
        top: 100vh;
        right: 100vw;
        opacity: 0;
    }
}

/* 随机延迟 */
.meteor:nth-child(1) {
    --random: 0.2;
}

.meteor:nth-child(2) {
    --random: 0.5;
}

.meteor:nth-child(3) {
    --random: 0.8;
}

// 背景效果
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(180deg, #001f3d, #000000);
    overflow: hidden;
}

.earth-background {
    position: relative;
    left: -30vw;
    width: 80vw;
    height: 80vw;
    animation: rotateEarth 60s infinite linear;
}

.bg-cover {
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent);
    position: absolute;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.5));
    position: absolute;
    top: 0;
    left: 0;
    clip-path: circle(49.9% at 50%);
    border: 1px solid #fff;
}

.earth {
    width: 100%;
    height: 100%;
    background: url('@/assets/images/earth.png') no-repeat center center;
    background-size: 135% auto;
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
    /* 使地球看起来有光晕 */
}

// 设置当鼠标经过 earth-background 时，以鼠标为中心半径 100px 的区域调整透明度为 1

@keyframes rotateEarth {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>