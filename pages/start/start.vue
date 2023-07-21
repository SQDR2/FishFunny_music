<template>
	<view>
		<view class="header">
			<p class="name">{{startInfo.name}}</p>
			<u--image class="startPic" :showLoading="true" :src="startInfo.picUrl" width='160rpx' height='160rpx'
				radius="10rpx"></u--image>
		</view>
		<view class="hotSongList">
			<view class="hotHeader">
				<view class="allsongs">
					<u-icon name="star-fill" color="#2979ff"></u-icon>
					<p class="nums">热门歌曲：<u-loading-icon size="20" v-if="!hotSongslen"></u-loading-icon><span
							v-else>{{hotSongslen}}首</span></p>
				</view>
				<view class="playAll">
					<span>全部播放</span>
					<u-icon name="play-circle" color="#2979ff"></u-icon>
				</view>
			</view>
			<view class="songList">
				<view class="song" v-for="(item, index) in hotSongs" :key="item.id" @click="toplay(item.id)">
					<span class="front">
						<span class="index">{{index+1}}</span>
						<u--image class="songimg" :src="item.al.picUrl" width="40rpx" height="40rpx" radius="10rpx">
						</u--image>
						<span class="s_name">{{item.name}}</span>
					</span>
					<u-icon name="more-circle" size="36rpx"></u-icon>
				</view>
			</view>
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
				startInfo: {},
				hotSongs: [],
				hotSongslen: 0
			}
		},
		onLoad(options) {
			_this = this
			_this.startInfo = JSON.parse(options.start)
			_this.getstartSongs()
		},
		components:{
			playbot
		},
		methods: {
			 getstartSongs : async () => {
				await request('/artists', {
						id: _this.startInfo.id
					})
					.then(res => {
						_this.hotSongs = res.hotSongs
						_this.hotSongslen = res.hotSongs.length
					})
					.catch(err=>{
						uni.showToast({
							title:'获取热门歌曲失败，请检查网络',
							icon:'error'
						})
					})
			},
			toplay(id){
				uni.navigateTo({
					url:'/pages/playpage/playpage?id='+id+'&play='+true
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 10rpx;
		margin: 20rpx;
		.name {
			font-size: 30rpx;
			font-weight: bold;
			margin: 10rpx 0 30rpx 0;
		}
	}

	.hotSongList {
		font-size: 28rpx;
		padding-bottom: 100rpx;
		.hotHeader {
			display: flex;
			justify-content: space-between;
			.allsongs {
				display: flex;
				line-height: 56rpx;
				margin: 0 30rpx;
				.nums{
					display: flex;
				}
			}

			.playAll {
				border: 1rpx solid $my-border-color;
				border-radius: 10rpx;
				padding: 0 10rpx;
				display: flex;
				line-height: 56rpx;
				margin: 0 30rpx;
			}
		}
		.songList{
			display: flex;
			flex-direction: column;
			.song{
				margin: 10rpx 20rpx;
				border: 1rpx solid $my-border-color;
				border-radius: 10rpx;
				padding: 10rpx;
				display: flex;
				font-size: 28rpx;
				line-height: 34rpx;
				justify-content: space-between;
				.front{
					display: flex;
					flex-direction: row;
					span{margin:10rpx 20rpx;}
					.songimg{
						margin-top: 5rpx;
					}
				}
			}
		}
	}
</style>
