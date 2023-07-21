import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
	state: { // 存放数据 和data类似
		//全部播放标签
		play: false,
		innerAudioContext: uni.createInnerAudioContext(),
		//当前播放id
		id:'',
		//当前播放的信息
		CurrentInfo:{},
		//是否正在播放
		isplayTrue:false
	},
	mutations: { // 用来修改state和getters里面的数据
		//切换暂停和播放
		changeplay(state, newval){
			state.play = newval
		},
		changeNowInfo(state, newval){
			state.id = newval.id
			state.CurrentInfo = newval.Info
		},
		changisplayTrue(state, newval){
			state.isplayTrue = newval
		}
	},
	getters: { // 相当于计算属性
	},
	actions: { // vuex中用于发起异步请求
	},
	modules: { // 拆分模块
	}
})
