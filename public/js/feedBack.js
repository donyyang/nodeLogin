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
			// 咨询列表 question/list?page=1&pagesize=1
			this.handleRequest(URL+'question/list',null,{
				userId: userInfo.userId,
				page: 1,
				pagesize: 5,
			},function (data) {
				var str = '';
				data.forEach(function (item,index) {
					str += '<li style = "text-align: left;">\
						  				<p><span>'+item.id+':</span>'+item.question+'</p>\
						  				<p><span>答复：</span><span>';
					if (item.answer == '') {
						str += '暂无答复';
					} else {
						str += item.answer;
					}
	  			str += '</span></p>\
	  			</li>';
				})
				$(".answerLists").append(str);	
			});	
			// 问题
			$(".submitQuestion").on("click",function () {
				var questionVal = $(".questionVal").val();
				if (questionVal.trim() == '') {
					return;
				}
				that.handleRequest(URL+'question/ask',null,{
					userId: userInfo.userId,
					userName: userInfo.userName,
					question: questionVal,
				},function (res) {
					alert(res.msg);
				})
			});
		},
	}
	allObj.init();
})