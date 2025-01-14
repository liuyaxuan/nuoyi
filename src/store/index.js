import { createStore } from 'vuex';

import user from './modules/user.js'
import system from './modules/system.js'
import getters from './getters.js'

const store = createStore({
  modules: {
	  user,
	  system,
  }
})

export default store;
