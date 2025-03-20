const system = {
	namespaced: true,
	state: {
		loading: false, // 全局加载状态
	},
	
	mutations: {
		SET_LOADING: (state, loading) => {
			state.loading = loading
		},
	},

	actions: {
		SET_LOADING({ commit }, loading) {
			commit('SET_LOADING', loading)
		}
	}
}

export default system;