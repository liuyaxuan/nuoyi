import { createStore } from 'vuex';

import user from './modules/user.js'
import system from './modules/system.js'
import getters from './getters.js'

const store = createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
	  user,
	  system
  }
})

export default store;
