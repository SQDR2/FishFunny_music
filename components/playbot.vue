<template>
	<view class="playBot borderColorTop">
		<image class="img zhuan" :src="info.album_pic" @click="toPlaypage">
		</image>
		<view class="title" @click="toPlaypage">
			<view class="name">{{info.name}}</view>
			<view class="desc">{{authors[1]}}</view>
		</view>
		<image class="icon" v-if="$store.state.play" src="../static/image/icon/play.png" @click="stopAndplay"></image>
		<image class="icon" v-else src="../static/image/icon/stop.png" @click="stopAndplay"></image>
		<image class="icon liebiao" src="../static/image/icon/mulu.png"></image>
	</view>
</template>

<script>
	let _this = null;
	import request from '../request/index.js'
	export default {
		name: "playbot",
		data() {
			return {
				info: {},
				authors: '',
				collectMusic: uni.getStorageSync('CollectMusic') || [],
				id: ''
			}
		},
		async mounted() {
			console.log('加载一次playbot组件');
			_this = this
			console.log(_this.$store.state.id);
			if (_this.$store.innerAudioContext?.src) {
				console.log('有播放的了');
				_this.id = _this.$store.state.id
			} else {
				_this.id = "278703079"
			}
			await request(`/lyric`, {
					id: _this.collectMusic[0].id
				})
				.then(res => {
					_this.info = res.data.info
					_this.authors = res.data.lrc[0].lineLyric.split('-')
				})
				.catch(err => {
					console.log(err);
				})
			await request('/detail', {
					id: _this.collectMusic[0].id
				})
				.then(res => {
					_this.$store.state.innerAudioContext.src = res;
				})
				.catch(err => {
					console.log(err);
				})
		},
		methods: {
			stopAndplay() {
				if (!_this.$store.state.play) {
					console.log("继续播放");
					_this.$store.state.innerAudioContext.play()
					_this.$store.commit('changisplayTrue', true)
				} else {
					console.log('暂停')
					_this.$store.state.innerAudioContext.pause()
					_this.$store.commit('changisplayTrue', false)
				}
				_this.$store.commit('changeplay', !_this.$store.state.play)
				// _this.$store.commit('changeplay',!_this.$store.state.play)
			},
			toPlaypage() {
				uni.navigateTo({
					url: '/pages/playpage/playpage?id=' + _this.id
				});
			}
		}
	}
</script>

<style lang="scss">
	.playBot {
		position: fixed;
		display: flex;
		align-items: center;
		bottom: 0;
		left: 0;
		width: 100vw;
		padding: 20rpx 25rpx 10rpx;
		box-sizing: border-box;
		background-color: #fff;

		.img {
			display: block;
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;

			&.zhuan {
				-webkit-transform: rotate(360deg);
				animation: rotation 8s linear infinite;
			}
		}

		.title {
			flex: 1;
			padding-left: 30rpx;
			font-size: 34rpx;

			.desc {
				font-size: 26rpx;
				color: rgb(75, 75, 75);
			}
		}

		.icon {
			width: 55rpx;
			height: 55rpx;
			padding-left: 30rpx;

			&.liebiao {
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
</style>
