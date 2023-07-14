<template>
	<view>
		<view class="searchBox">
			<u--input prefixIcon="search" class="searchInput" v-model="searchValue" placeholder="搜索音乐" shape="circle"
				clearable @change="searchDebounce()()" @blur="searchblur" @focus="searchDebounce()()" @confirm="tomusiclist(searchValue)"
				@clear="clearInput"></u--input>
			<view class="searchTips" v-show="showTips">
				<view class="searchTip" v-for="(item, index) in searchTipArr" :key="index" @click="tomusiclist(item)">
					<u-icon name="search"></u-icon>
					<span class="tip">{{item}}</span>
				</view>
			</view>
		</view>
		<view class="HotStarts">
			<view class="starts1" v-if="existStarts">
				<view class="start" v-for="item in starts" :key="item.id" @click="tostart(item)">
					<u--image class="startPic" :showLoading="true" :src="item.picUrl" width='160rpx' height='160rpx'
						radius="15rpx"></u--image>
					<view class="name">{{item.name}}</view>
				</view>
			</view>
			<u-loading-icon v-else :text="loadingText"></u-loading-icon>
		</view>
		<playbot></playbot>
	</view>
</template>

<script>
	import request from '../../request/index.js'
	import playbot from '../../components/playbot.vue'
	let _this = null;
	export default {
		data() {
			return {
				searchValue: '',
				starts: [],
				loadingText: '获取热门歌手中',
				searchTipArr: [],
				showTips: false,
				existStarts: false
			}
		},
		components:{
			playbot
		},
		onLoad() {
			_this = this
			_this.getStarts()
		},
		methods: {
			//获取首页热门歌手
			getStarts: async () => {
				await request('/starts')
					.then(res => {
						_this.starts.push(...res.artists)
						_this.existStarts = true
					})
					.catch(err => {
						uni.showToast({
							icon: 'error',
							title: "获取歌星失败"
						})
						_this.loadingText = '获取歌星失败，请检查网络环境！'
					})
			},
			//点击歌手跳转到歌手页面
			tostart: (start) => {
				let startinfo = JSON.stringify(start)
				uni.navigateTo({
					url: '/pages/start/start?start=' + startinfo
				})
			},
			//节流函数
			searchDebounce: () => {
				let timer;
				return function() {
					if (timer) clearTimeout(timer)
					timer = setTimeout(() => {
						let args = arguments;
						_this.searchTip.apply(_this, args)
					}, 1000)
				}
			},
			//搜索建议tip，使用了节流
			searchTip: async () => {
				if (_this.searchValue) {
					await request('/getTip', {
							searchKey: _this.searchValue
						})
						.then(res => {
							_this.searchTipArr = res.data
							if (!_this.showTips) {
								_this.showTips = true
							}
						})
						.catch(err => {
							console.log(err);
						})
				} else {
					_this.searchTipArr = _this.searchTipArr.slice(0, 0)
				}
			},
			//失去焦点
			searchblur: () => {
				let timer = null
				if(timer) clearTimeout(timer)
				timer = setTimeout(()=>{
					_this.showTips = false
				},100)
			},
			//搜索
			tomusiclist: (searchkey) => {
				console.log(searchkey);
				_this.searchValue = searchkey
				if (searchkey) {
					uni.navigateTo({
						url: '/pages/musiclist/musiclist?key=' + searchkey,
					})
				}
			},
			//清空
			clearInput: () => {
				_this.searchValue = ''
				_this.searchTipArr = _this.searchTipArr.slice(0, 0)
			}
		}
	}
</script>

<style lang="scss" scope>
	.searchBox {
		position: fixed;
		z-index: 999;
		width:100vw;
		background-color: #fff;
		.searchInput {
			margin: 20rpx 30rpx;
			border-color: $my-border-color;
		}

		.searchTips {
			position: absolute;
			z-index: 999;
			background-color: #fff;
			width: calc(100vw - 110rpx);
			border: 1rpx solid $my-border-color;
			border-top: none;
			margin: 0 50rpx;
			border-radius: 0 0 20rpx 20rpx;
			transition-duration: 0.5s;

			.searchTip {
				display: flex;
				margin: 10rpx 20rpx;
				border-bottom: 1rpx solid $my-border-color;

				span {
					font-size: 26rpx;
					margin: 5rpx 20rpx;
				}
			}
		}
	}

	.HotStarts::before{
		display: block;
		content: '';
		width: 100vw;
		height: 100rpx;
	}
	.HotStarts::after{
		display: block;
		content: '';
		width: 100vw;
		height: 100rpx;
	}
	.HotStarts .starts1 {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.start {
		width: 165rpx;
		height: 185rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 15rpx 10rpx;
		font-size: 20rpx;
	}

	.start:nth-child(4n-3) {
		padding-left: 10rpx;
	}

	.start:nth-child(4n) {
		padding-right: 10rpx;
	}
</style>
