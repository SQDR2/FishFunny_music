<template>
	<view class="playBot borderColorTop">
		<image class="img zhuan"
			src="https://img4.kuwo.cn/star/albumcover/500/1/29/1934979845.jpg">
		</image>
		<view class="title">
			<view class="name">Traveling Light</view>
			<view class="desc">Joel Hanson</view>
		</view>
		<image class="icon" v-if="sp" src="../static/image/icon/stop.png" @click="stopAndplay"></image>
		<image class="icon" v-else src="../static/image/icon/play.png" @click="stopAndplay"></image>
		<image class="icon liebiao" src="../static/image/icon/mulu.png"></image>
	</view>
</template>

<script>
	let _this = null;
	export default {
		name: "playbot",
		data() {
			return {
				sp:false
			}
		},
		onLoad(){
			_this = this
		},
		methods:{
			stopAndplay(){
				this.sp = !this.sp
			}
		}
	}
</script>

<style lang="scss">
.playBot{
		position: fixed;
		display: flex;
		align-items: center;
		bottom: 0;
		left: 0;
		width: 100vw;
		padding: 20rpx 25rpx 10rpx;
		box-sizing: border-box;
		background-color: #fff;
		.img{
			display: block;
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			&.zhuan{
				-webkit-transform: rotate(360deg);
				animation: rotation 8s linear infinite;
			}
		}
		.title{
			flex: 1;
			padding-left: 30rpx;
			font-size: 34rpx;
			.desc{
				font-size: 26rpx;
				color: rgb(75,75,75);
			}
		}
		.icon{
			width: 55rpx;
			height: 55rpx;
			padding-left: 30rpx;
			&.liebiao{
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
</style>
