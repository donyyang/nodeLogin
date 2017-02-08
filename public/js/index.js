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

		requestTeam: function (pageSize) {
			// 获取排名
			// team/list?page=1&pagesize=5
			$.ajax({
				url: URL+'team/list?page='+(pageSize+1)+'&pagesize=5',
				method: 'GET',
				success: function (res) {
					var data = res.data;
					var str = '';
					data.forEach(function (item, index) {
						str += '<tr>\
											<td>'+item.teamPaiming+'</td>\
					            <td>'+item.teamLeader+'</td>\
					            <td>'+item.teamName+'</td>\
					            <td>'+item.teamSum+'</td>\
					          </tr>';
					});
					$("#rank_1").html(str);
				}
			})
		},
		
		request: function () {
			var that = this;
			var userInfo = this.userInfo;
			// 战队排名	
			$("#pagination").pagination(45,{
				callback: that.requestTeam,
		    prev_text: "前一页",
				next_text: "后一页"
		  });
			this.handleRequest(URL+'gonggao/get',null,null,function (data) {
				$(".ads_cont").html(data.content);
			});
			// 广告栏
			this.handleRequest(URL+'guanggao/get',null,null,function (data) {
				$(".carousel-caption").each(function (index, item) {
					$(item).html(data[0].content)
				})
			});
			
			// 介绍信息jieshao/get
			this.handleRequest(URL+'jieshao/get',null,null,function (data) {
				$(".introCont").html(data.content)
			});
			this.handleRequest(URL+'product/list',null,{
				page: 1,
				pagesize: 5,
			},function (data) {
				data.forEach(function (item, index) {
					var str = '<div data-id = "'+item.id+'" class = "ware checkout">\
							    			<div class = "ware-img">\
							    			<a href="javascript:void(0)">\
							    				<img src="images/demo1.jpg">\
							    			</a>\
							    			</div>\
							    			<div class = "ware-intro">\
							    				<span>'+item.productJieshao+'</span>\
							    			</div>\
							    			<div class = "ware-bottom">\
							    				<div>\
								    				<span class = "ware-name">'+item.productName+'</span>\
								    				<span class = "ware-price">'+item.productPrice	+'</span>\
							    				</div>\
							    				<div>查看详情</div>\
							    			</div>\
							    		</div>';
						$(".ware_conts").append(str);
				});
			});
			// 单个商品
			$(".ware_conts").on("click",".checkout",function () {
				var productID = $(this).attr("data-id");
				window.location.href = './wareInfo.html?productid='+productID+'';
			});
			if (window.location.href.indexOf('?productid') != -1) {
				var productStr = '?productid'.length;
				var idx = window.location.href.indexOf('?productid');
				var productID = window.location.href.substring(idx+productStr+1);
				that.handleRequest(URL+'product/get',null,{
						productid: productID,
					},function (data) {  
						console.log(data)
						$(".info-intro").html(data.productJieshao);
						$(".info-name").html(data.productName);
						$(".info-price").html(data.productPrice);
					});
			}
		},
	}
	allObj.init();
})