// http://115.236.94.220:56012/egg/
var URL = 'http://114.215.25.230/egg/';
 
$(function () {
	var allObj = {
		init: function () {
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
		request: function () {
			var that = this;
			var userInfo = this.userInfo;
			if (!userInfo) {
				alert('请先登录');
				$(".logins").modal("show");
				return;
			};
			// 个人信息
			this.handleRequest(URL+'user/get',null,{
				userid: userInfo.userId,
			},function (data) {
				$(".user_name").val(data.userName);
				$(".user_tel").val(data.userTel);
				$(".user_adress").val(data.userShouhuoAddress);
				$(".user_wechat").val(data.userWeixin);
				$(".user_pay").val(data.userZhifubao);
				$(".user_blankid").val(data.userKahao);
			});
		},
	}
	allObj.init();
})