// http://115.236.94.220:56012/egg/
var URL = 'http://114.215.25.230/egg/';
 
$(function () {
	var allObj = {
		init: function () {
			this.finacial();
			this.request();
			this.login();
			this.loginBtn();
			this.userInfo = null;

			$(".feedBack").on("click",function () {
				window.location.href = './feedBack.html';
			})
		},
		
		handleRequest: function (url,type,data,callback) {
			$.ajax({
				url: url,
				type: type || 'GET',
				data: data,
				success: function (res) {
					if (res.code == 200) {
						var data = res.data;
						callback(data);
					}
				}
			})
		},
		// 判断是否登录
		login: function () {
			var userInfo = this.userInfo = $.cookie('userInfo');
		
			if (userInfo!=null && userInfo!="") {
				userInfo = userInfo.parse(userInfo);
				var userName=userInfo.userName;

				$(".loginExit").removeClass('after_login').addClass('before_login');
				$(".loginBtn").hide();
				$(".userName").html(userName);
			} else {
				$(".loginExit").removeClass('before_login').addClass('after_login');
				$(".loginBtn").show();
			}
		},
		// 点击后 登录
		loginBtn: function () {
			var that = this;
			$(".btnLogin").on("click",function () {
				var userId = $(".userId").val(),
						userPwd = $(".userPwd").val();
				
				if (userId.trim() === '') {
					return;
				}
				if (userPwd.trim() === '') {
					return;
				}
				that.handleRequest(URL+'user/login',null,{
					userAccount: userId,
					pwd: userPwd,
				},function (res) {
					$(".logins").modal("hide");
					var json = {
						'userName': res.userName,
						'userId': res.id,
						'userPwd': res.userPwd,
					};
					json = json.stringify(json);

					$.cookie('userInfo', json,{ expires: 365 });
				});
			});
		},
		// 点击退出登录
		logOut: function () {
			$(".exitSystem").on("click",function () {
				$.removeCookie('userInfo');
			});
		},
		finacial: function () {
			$(".finalcial").on("click",'.nav',function () {
				$(".nav").removeClass("navActive");
				$(this).addClass("navActive");

				$(".comHide").hide();
				$(".comHide").eq($(this).index()).show();
			});

			// 加减
			$(".add").on("click",function () {
				var val = parseInt($(".iptCount").val());
				val += 50;

				$(".iptCount").val(val);
			});

			$(".reduce").on("click",function () {
				var val = parseInt($(".iptCount").val());
				if(val <= 0) {
					return;
				}

				val -= 50;
				$(".iptCount").val(val);
			});

			$(".register_w").on("click",'.nav',function () {
				$(".nav").removeClass("navActive");
				$(this).addClass("navActive");

				$(".comHide").hide();
				$(".comHide").eq($(this).index()).show();
			})
		},
		
		request: function () {
			var that = this;
			var userInfo = this.userInfo;
			if (!userInfo) {
				alert('请先登录');
				$(".logins").modal("show");
				return;
			};
			// 我的奖金
			this.handleRequest(URL+'money/get',null,{
				userId: userInfo.userId,
			},function (data) {
				$(".userQwfh").html(data.userQwfh);
				$(".userTdfh").html(data.userTdfh);
				$(".userTdjj").html(data.userTdjj);
				$(".userZtjj").html(data.userZtjj);
			});
			// 我的股份 gufen/get
			this.handleRequest(URL+'gufen/get',null,{
				userId: userInfo.userId,
			},function (data) {
				console.log(data);
				$(".userCsgf").html(data.userCsgf);
				$(".userJlgf").html(data.userJlgf);
				$(".userTjgf").html(data.userTjgf);
			});
			// 我要买鸡蛋 jiaoyi/list?type=0&page=1&pagesize=1
			this.handleRequest(URL+'jiaoyi/list',null,{
				type: 0,
				page: 1,
				pagesize: 1,
			},function (data) {
				var str = '';
				data.forEach(function (item, index) {
					str += '<tr>\
			  						<td>'+item.id+'</td>\
			  						<td>'+item.username+'</td>\
			  						<td>200个</td>\
			  						<td>'+item.status+'</td>\
			  						<td>1835555555</td>\
			  					</tr>';
				});
				$(".goods_tables").html(str);
			});

			// 卖出记录
			this.handleRequest(URL+'jiaoyi/sellList',null,{
				userId: userInfo.userId,
			},function (data) {
				data.forEach(function (item, index) {
			  	var str = '<tr>\
												<td>'+item.productName+'</td>\
						            <td>'+item.count+'</td>\
						            <td>'+item.count+'</td>\
						          </tr>'
					$('.proInfo').append(str);
				})
			});
		},
	}
	allObj.init();
})