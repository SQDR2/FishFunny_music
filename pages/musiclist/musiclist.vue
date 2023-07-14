<template>
	<view class="container">
		<scroll-view scroll-y="true" class="songList" @scrolltolower="getMoreMusic(searchKey)"
			:style="{height:scrollH+'rpx'}">
			<view class="song" v-for="(item, index) in searchResult" :key="item.id" @click="toplay(item.id)">
				<view class="front">
					<span class="index">{{index+1}}</span>
					<span class="info">
						<span class="s_name">{{item.name}}</span>
						<span class="s_author">{{item.artist_name}}</span>
					</span>
				</view>
				<u-icon name="more-circle" size="36rpx"></u-icon>
			</view>
		</scroll-view>
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
				searchResult: [],
				page: 0,
				searchKey: '',
				query: null,
				nodeHeight: 0
			}
		},
		components:{
			playbot
		},
		onLoad(options) {
			_this = this;
			_this.searchKey = options.key
			_this.getMoreMusic(_this.searchKey)
			_this.getMoreMusic(_this.searchKey)
			uni.setNavigationBarTitle({
				title: `搜索-${_this.searchKey}`
			});
		},
		computed: {
			scrollH: function() {
				let sys = uni.getSystemInfoSync();
				let winWidth = sys.windowWidth;
				let winrate = 750 / winWidth;
				let winHeight = parseInt(sys.windowHeight * winrate)
				return winHeight
			}
		},
		methods: {
			getMoreMusic: async (key) => {
				await request('/search', {
						searchKey: key,
						page: ++_this.page
					})
					.then(res => {''
						_this.searchResult.push(...res.data.music)
					})
					.catch(err => {
						console.log(err);
					})
			},
			onPullDownRefresh() {
				_this.searchResult = _this.searchResult.slice(0, 0)
				_this.page = 1
				_this.getMoreMusic(_this.searchKey) // 下拉刷新时触发刷新数据的函数
				_this.getMoreMusic(_this.searchKey)
				uni.showToast({
					title: '刷新完成！'
				})
				uni.stopPullDownRefresh()
			},
			toplay(id){
				uni.navigateTo({
					url:'/pages/playpage/playpage?id='+id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.songList::after{
		display:block;
		content: '';
		height: 20rpx;
	}
	.songList {
		display: flex;
		flex-direction: column;

		.song {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			border: 1rpx solid $my-border-color;
			border-radius: 20rpx;
			margin: 10rpx;
			padding: 10rpx;

			.front {
				display: flex;
				flex-direction: row;

				.index {
					display: inline-block;
					width: 60rpx;
					text-align: center;
					line-height: 60rpx;
				}

				.info {
					display: flex;
					flex-direction: column;
					font-size: 24rpx;
					span{
						width: calc(100vw - 150rpx);
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					.s_author {
						font-size: 18rpx;
						color: #606266;
					}
				}
			}
		}
	}
</style>
