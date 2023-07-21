<template>
	<view class="container">
		<view class="play_header">
			<view class="m_name">
				{{musicInfo.name}}
			</view>
			<view class="a_name">
				{{authors[1]}}
			</view>
		</view>
		<view class="play_center">
			<u--image class="music_pic" :src="musicInfo.album_pic" :width="picWidth+'rpx'" :height="picWidth+'rpx'"
				shape="circle">
			</u--image>
			<view class="lyric">
				<view v-for="item in musiclyric" :key="item.time">{{item.lineLyric}}</view>
			</view>
		</view>
		<view class="play_footer">
			<view class="Collect">
				<image src="../../static/image/icon/collected.png" v-if="isCollect" @click="collect"></image>
				<image src="../../static/image/icon/collect.png" v-else @click="collect"></image>
				<!-- <image src="../../static/image/icon/like.png" ></image> -->
				<image src="../../static/image/icon/liked.png"></image>
				<image src="../../static/image/icon/download.png"></image>
				<image src="../../static/image/icon/caozuo.png"></image>
			</view>
			<view class="playBox">
				<view class="progress-bar">
					<view ref="progress" class="progress" :style="processStyle"></view>
				</view>
				<view class="play_status">
					<image src="../../static/image/icon/loopone.png" @click="ToggleStatus" v-if="play_status===0">
					</image>
					<image src="../../static/image/icon/loop.png" @click="ToggleStatus" v-if="play_status===1"></image>
					<image src="../../static/image/icon/random.png" @click="ToggleStatus" v-if="play_status===2">
					</image>
					<image src="../../static/image/icon/Previous.png"></image>
					<image class="playicon" @click="playAndstop" v-if="$store.state.play"
						src="../../static/image/icon/play.png">
					</image>
					<image class="playicon" @click="playAndstop" v-else src="../../static/image/icon/stop.png"></image>
					<image src="../../static/image/icon/next.png" mode=""></image>
					<image src="../../static/image/icon/PackUp.png" @click="UnfoldAndwithdraw" v-if="sidebarStatus">
					</image>
					<image src="../../static/image/icon/unfold.png" @click="UnfoldAndwithdraw" v-else></image>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	let _this = null
	import request from '../../request/index.js'
	export default {
		data() {
			return {
				id: '',
				musicInfo: {},
				musiclyric: [],
				authors: '',
				musicUrl: '',
				picWidth: 0,
				// play: false,
				play_status: 0, //0：单曲循环     1：循环     2：随机
				sidebarStatus: true, //true:展开         false：收回
				// innerAudioContext: null,
				musicTime: 0, //总时间
				currentTime: 0, //
				CollectMusic: [], //本地缓存的收藏音乐数组
			}
		},
		onLoad(options) {
			_this = this;
			_this.CollectMusic = (uni.getStorageSync('CollectMusic') || []);
			//根据设备屏幕获取中心图片宽高
			uni.getSystemInfo({
				success: function(res) {
					_this.picWidth = res.windowWidth;
				}
			});
			if(options.play){
				_this.$store.commit('changeplay',Boolean(options.play))
				_this.$store.state.innerAudioContext.play()
				_this.$store.commit('changisplayTrue',true)
			}
			if(_this.$store.state.isplayTrue){
				_this.$store.state.innerAudioContext.autoplay = true;
			}
			if (options.id != _this.id ) {
				_this.id = options.id;
				console.log(_this.id ,options.id);
				// _this.$store.state.innerAudioContext.autoplay = true;
				_this.getlyric()
				_this.getMusicUrl()
			}

			//创建一个音频监听器
			// _this.innerAudioContext = uni.createInnerAudioContext();
			// _this.$store.commit('changeplay', !_this.$store.state.play)

			_this.$store.state.innerAudioContext.onPlay(() => {
				console.log('开始播放');
				// _this.$store.commit('changisplayTrue',true)
				_this.$store.commit('changeNowInfo', {
					id: _this.id,
					Info: {
						img:_this.musicInfo.album_pic,
						name:_this.musicInfo.name,
						author:_this.authors[1]
					}
				})
			});
			_this.$store.state.innerAudioContext.onError((res) => {
				console.log(res.errMsg);
				console.log(res.errCode);
			});
			_this.$store.state.innerAudioContext.onCanplay(() => {
				_this.musicTime = _this.$store.state.innerAudioContext.duration
			})
			_this.$store.state.innerAudioContext.onTimeUpdate(() => {
				_this.currentTime = _this.$store.state.innerAudioContext.currentTime
			})
			console.log(_this.$store.state);
		},
		computed: {
			//进度条的动态样式
			processStyle() {
				return {
					'width': ((_this.currentTime / _this.musicTime) * 100) + 'rpx',
					'height': '100%',
					'background-color': '#007bff',
					'border-radius': '5rpx',
					'transition': 'width 0.3s ease-in-out'
				}
			},
			isCollect() {
				if (_this.CollectMusic.length !== 0) {
					return _this.CollectMusic.some(item => item.id == _this.id && item.name === _this.musicInfo.name)
				} else {
					return false
				}
			}
		},
		methods: {
			getlyric: async () => {
				await request(`/lyric`, {
						id: _this.id
					})
					.then(res => {
						_this.musicInfo = res.data.info
						_this.musiclyric = res.data.lrc
						_this.authors = res.data.lrc[0].lineLyric.split('-')
					})
					.catch(err => {
						console.log(err);
					})
			},
			getMusicUrl: async () => {
				await request('/detail', {
						id: _this.id
					})
					.then(res => {
						_this.musicUrl = res
						_this.$store.state.innerAudioContext.src = _this.musicUrl;
					})
					.catch(err => {
						console.log(err);
					})
			},
			//播放和暂停
			playAndstop() {
				if (!_this.$store.state.play) {
					console.log("继续播放");
					_this.$store.state.innerAudioContext.play()
				} else {
					console.log('暂停')
					_this.$store.state.innerAudioContext.pause()
				}
				_this.$store.commit('changeplay', !_this.$store.state.play)
			},
			//切换歌单播放顺序
			ToggleStatus() {
				if (_this.play_status == 2) {
					_this.play_status = 0
				} else {
					_this.play_status++
				}
			},
			//侧边栏展开和收回
			UnfoldAndwithdraw() {
				_this.sidebarStatus = !_this.sidebarStatus
			},
			collect() {
				if (_this.isCollect) {
					_this.CollectMusic.forEach((item, index, array) => {
						if (item.id == _this.id && item.name === _this.musicInfo.name) {
							array.splice(index, 1)
							uni.setStorageSync('CollectMusic', _this.CollectMusic)
						}
					})
					console.log(_this.CollectMusic);
				} else {
					_this.CollectMusic.push({
						id: _this.id,
						name: _this.musicInfo.name,
						img: _this.musicInfo.album_pic,
						author: _this.authors[1]
					})
					uni.setStorageSync('CollectMusic', _this.CollectMusic)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.play_header {
		margin: 70rpx 0 100rpx 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.m_name {
			font-size: 40rpx;
			font-weight: bold;
		}

		.a_name {
			margin-top: 10rpx;
			font-size: 30rpx;
		}
	}

	.play_center {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;

		.lyric {
			width: 50%;
			height: 600rpx;
			overflow: scroll;
			// view {
			//   width: 50%;
			//   white-space: nowrap;
			//   overflow: hidden;
			//   animation: scroll 5s linear infinite;
			// }
			// @keyframes scroll {
			//   0% {
			//     transform: translateX(0);
			//   }
			//   100% {
			//     transform: translateX(-100%);
			//   }
			// }
		}
	}

	.play_footer {
		position: fixed;
		// border: 1rpx solid;
		background-color: #ffffff;
		bottom: 20rpx;


		.Collect {
			display: flex;
			flex-direction: row;
			border-radius: 30rpx;
			justify-content: space-around;
			margin: 10rpx 0;
			width: calc(100vw - 50rpx);
			background-color: rgba(0, 0, 0, 0.1);
			padding: 10rpx 0;

			image {
				width: 50rpx;
				height: 50rpx;
			}
		}

		.playBox {
			background-color: rgba(0, 0, 0, 0.1);
			border-radius: 30rpx;
			padding-top: 30rpx;

			.progress-bar {
				// width: 100%;
				height: 10rpx;
				background-color: #ffffff;
				border-radius: 5rpx;
				margin: 0 10rpx;
				/* 进度条样式 */
				// .progress {
				//   width: 0%;
				//   height: 100%;
				//   background-color: #007bff;
				//   border-radius: 5rpx;
				//   transition: width 0.3s ease-in-out;
				// }
			}



			.play_status {
				display: flex;
				flex-direction: row;
				justify-content: space-around;
				padding: 20rpx 0;

				image {
					width: 60rpx;
					height: 60rpx;
				}

				.playicon {
					width: 60rpx;
					height: 60rpx;
				}

			}
		}
	}
</style>
