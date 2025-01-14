import { createStore } from 'vuex';
const user = {
	namespaced: true,
	state: {
		token: '',
		id: '',
		name: '',
		roles: [],
	},

	mutations: {
		SET_TOKEN: (state, token) => {
			state.token = token
		},
		SET_ID: (state, id) => {
			state.id = id
		},
		SET_NAME: (state, name) => {
			state.name = name
		},
		SET_ROLES: (state, roles) => {
			state.roles = roles
		}
	},

	actions: {
		// 登录
		login() {
			return new Promise((resolve, reject) => {
				// 请求
			})
		},

		// 获取用户信息
		getUserInfo() {
			return new Promise((resolve, reject) => {
				// 请求
			})
		},

		// 退出系统
		loginOut() {
			return new Promise((resolve, reject) => {
				// 请求

				// 清除token
				this.commit('SET_TOKEN', '')
				this.commit('SET_ID', '')
				this.commit('SET_NAME', '')
				this.commit('SET_ROLES', [])
			})
		},
	}
}

export default user;