<template>
	<div class="kugou-content">
		<div class="bg-banner">
			<div :class="{'prize-id': true, 'show': showRandomId}">
				兑奖标识：{{randomId}}
			</div>
			<p class="title">
				私人订制阿胶免费送
			</p>
		</div>
		<!-- banner图 -->
		<!-- <img src="../assets/images/banner.png" alt class="bg-banner" /> -->
		<!-- 滚动号码 -->
		<div class="kugou-scroll">
			<ul class="bg-scroll">
				<img src="../assets/images/name.png" alt class="notice-img" />
				<li v-for="(item, i) in prizeHistoryList" :key="i" ref="rollLi" :class="{ 'anim' : animate && i == 0 }">
					<span class="lkq-name">
						{{item.telephone}}抽中【{{item.label}}({{item.subDesc}})】
					</span>
				</li>
			</ul>
		</div>
		<!-- 抽奖弹窗 -->
		<div v-if="!!awards.length" class="turntable">
			<div :class="['flash', 'run-item-' + current]"></div>
			<div class="item item_1">
				<img :src="require(`../assets/images/${awards[0].icon}`)"/>
				<span>{{awards[0].subDesc}}</span>
			</div>
			<div class="item item_2">
				<img :src="require(`../assets/images/${awards[1].icon}`)"/>
				<span>{{awards[1].subDesc}}</span>
			</div>
			<div class="item item_3">
				<img :src="require(`../assets/images/${awards[2].icon}`)"/>
				<span>{{awards[2].subDesc}}</span>
			</div>
			<div class="item item_4">
				<img :src="require(`../assets/images/${awards[7].icon}`)"/>
				<span>{{awards[7].subDesc}}</span>
			</div>
			<div class="item item_5">
				<img :src="require(`../assets/images/${awards[3].icon}`)"/>
				<span>{{awards[3].subDesc}}</span>
			</div>
			<div class="item item_6">
				<img :src="require(`../assets/images/${awards[6].icon}`)"/>
				<span>{{awards[6].subDesc}}</span>
			</div>
			<div class="item item_7">
				<img :src="require(`../assets/images/${awards[5].icon}`)"/>
				<span>{{awards[5].subDesc}}</span>
			</div>
			<div class="item item_8">
				<img :src="require(`../assets/images/${awards[4].icon}`)"/>
				<span>{{awards[4].subDesc}}</span>
			</div>
			<!-- 抽奖按钮 -->
			<img @click="validCount" src="../assets/images/bigBottom.png" alt class="start-btn-big" />
		</div>
	</div>
</template>
<script>
import { Toast } from 'vant';
import { getPrizeList, setPrizeSetting, getPrizeId, getPrizeHistory, getPrizeHistoryCount } from '@/api';

export default {
	name: "index",
	data() {
		return {
			animate: false,
			initSpeed: 200,  // 初始速度
			speed: null,  // 变化速度
			diff: 20,  // 速度变化的值，值越大，变化地越快
			award: {},  // 抽中的奖品
			awards: [],
			time: 0,  // 记录开始抽奖的时间
			current: 0,  // 当前转动的位置
			isRuningLucky: false,  // 是否正在抽奖
			randomId: null,
			showRandomId: false,
			userInfo: null,
			prizeHistoryList: []
		};
	},
	created() {
		getPrizeList().then((data) => {
			this.awards = data.prizeList;
		});

		getPrizeHistory().then((data) => {
			this.prizeHistoryList = data.prizeHistoryList;
			debugger;
		});
	},
	mounted() {
		let scrollTimer = setInterval(this.scroll, 2000);
	},
	methods: {
		validCount() {
			let userInfo = sessionStorage.getItem('userInfo');
			if (!!userInfo) {
				this.userInfo = JSON.parse(userInfo);
			} else {
				this.$bus.emit('show.login.msg');
				return;
			}

			getPrizeHistoryCount(this.userInfo.telphone).then((data) => {
				if (data.count < 5) {
					this.handleStart();
				} else {
					Toast("活动期内，每个用户只有5次抽奖机会")
				}
			});
		},
		// 抽奖
		handleStart() {			
			if (this.isRuningLucky) {
				return Toast("正在抽奖中...");
			}
			if (isNaN(Number(this.initSpeed))) {
				return false;
			}
			this.speed = this.initSpeed;
			// 开始抽奖
			this.isRuningLucky = true;
			this.time = Date.now();
			this.drawAward();
			Toast("开始抽奖");
		},
		drawAward() {
			getPrizeId(this.userInfo.telphone, this.userInfo.wx).then((data) => {
				const { prizeId, randomId } = data;
				// 此时 奖已经抽完了
				if (prizeId === 0 && randomId === 0) {
					const prize = this.awards.find(_prize => _prize.label === '谢谢参与');
					this.award = { id: prize.id }
				} else {
					this.award = { id: prizeId };
				}
				this.randomId = randomId;
			});
			this.move();
		},
		move() {
			let timer = setTimeout(() => {
				this.current++;
				if (this.current > 7) {
					this.current = 0;
				}
				// 若抽中的奖品id存在，则开始减速转动
				if (this.award.id && (Date.now() - this.time) / 1000 > 2) {
          			this.speed += this.diff; // 转动减速
          
					// 若转动时间超过4秒，并且奖品id等于小格子的奖品id，则停下来
					if (
						(Date.now() - this.time) / 1000 > 4 &&
						this.award.id == this.awards[this.current].id
					) {
						clearTimeout(timer);

						setTimeout(() => {
              				this.isRuningLucky = false;
							Toast(`您抽中的奖品是【${this.awards[this.current].subDesc}】`);
							this.showRandomId = true;
						}, 400);
						return;
					}

				// 若抽中的奖品不存在，则加速转动
				} else {
					if (this.speed >= 50) {
						this.speed -= this.diff; // 转动加速
					}
				}

				this.move();
			}, this.speed);
		},
		// 中奖名单滚动
		scroll() {
			this.animate = true;
			let timer = setTimeout(() => {
				this.prizeHistoryList.push(this.prizeHistoryList[0]);
				this.prizeHistoryList.shift();
				this.animate = false;
			}, 500);
		}
	}
};
</script>
<style lang="stylus" scoped>

.kugou-content {
  	background-color: #000;
	width: 100%;
	overflow: auto;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	padding-top: 4.1rem;
	// 顶部图片
	.bg-banner {
		background: url(/static/img/banner.21c6ba5.png) center top no-repeat;
		position: absolute;
		top: 0;
		right: 0;
		height: 7rem;
		width: 100%;
		background-size: 8.5rem;
		background-position: -1.00rem 0rem;
		.title {
			position: absolute;
			z-index: 1000;
			font-size: 20px;
			top: 44%;
			color: #fff;
			width: 100%;
    		text-align: center;
		}

		.prize-id {
			z-index: 1000;
			color: #fff;
			position: absolute;
			width: 100%;
			font-size: 16px;
			top: 0;
			background: url(/static/img/phone.3376449.png) center top no-repeat;
			display: none;
			&.show{
				display:block;
			} 
		}
	}
	// 滚动号码
	.kugou-scroll {
		.bg-scroll {
			position: relative;
			background: url("../assets/images/phone.png") center top no-repeat;
			background-size: 100%;
			width: 100%;
			height: 0.74rem;
			line-height: 0.74rem;
			font-size: 0.35rem;
			overflow: hidden;
			text-align: center;
			letter-spacing: 0.03rem;
		}
		.lkq-name {
			margin: 0 auto;
			color: #fff;
      font-size: 0.28rem;
		}
		.anim {
			transition: all 0.5s linear;
			margin-top: -0.74rem;
		}
	}
	// 抽奖
	.turntable {
		position: relative;
		background: url("../assets/images/lottery.png") center top no-repeat;
		background-size: 8.5rem;
		background-position: -1.06rem -0.9rem;
		height: 8.2rem;
		padding: 1.55rem 0.83rem 1.15rem;
		.item {
			width: 1.7rem;
			height: 1.7rem;
			background-color: #151515;
			color: #fff;
			position: absolute;
			font-size 12px;
			text-align: center;

			> img {
				width: 1rem;
				height: 1rem;
				margin-top: 6px;
			}

			> span {
				display: inline-block;
				width: 100%;
				text-align: center;
				font-size: 14px;
				color: orange;
			}

			&.item_1 {top: 1.6rem;left: 0.88rem;}
			&.item_2 {top: 1.6rem;left: 2.88rem;}
			&.item_3 {top: 1.6rem;left: 5rem;}
			&.item_4 {top: 3.7rem;left: 0.88rem;}
			&.item_5 {top: 3.7rem;left: 5rem;}
			&.item_6 {top: 5.7rem;left: 0.88rem;}
			&.item_7 {top: 5.7rem;left: 2.88rem;}
			&.item_8 {top: 5.7rem;left: 5rem;}
		}
		.start-btn-big {
			width: 1.8rem;
			position: absolute;
			top: 3.55rem;
			left: 2.88rem;
			z-index: 999;
			animation: btn-animation 0.3s ease-out infinite alternate;
		}

		.flash {
			width: 1.80rem;
			height: 1.80rem;
			background-color: #79f9ea;
			box-shadow: 0px 0px 10px #79f9ea;
			&.run-item-0 {
				display: block;
			}
			&.run-item-1 {
				display: block;
				margin: 0 0 0 2rem;
			}
			&.run-item-2 {
				display: block;
				margin: 0 0 0 4.1rem;
			}
			&.run-item-3 {
				display: block;
				margin: 2.1rem 0 0 4.1rem;
			}
			&.run-item-4 {
				display: block;
				margin: 4.1rem 0 0 4.1rem;
			}
			&.run-item-5 {
				display: block;
				margin: 4.1rem 0 0 2rem;
			}
			&.run-item-6 {
				display: block;
				margin: 4.1rem 0 0 0;
			}
			&.run-item-7 {
				display: block;
				margin: 2.1rem 0 0 0;
			}
		}
	}
}

@keyframes btn-animation {
	0% {
		transform: scale(1);
	}
	100% {
		transform: scale(0.85);
	}
}

.notice-img {
	position: absolute;
	top: 0.12rem;
	left: 0.55rem;
}
</style>
