var registerSchema = require('../model').registerSchema;

module.exports = function (app) {
	// 格式化数据库中的 registerSchema 
	function getFormattedregister(register) {
		var register = {
			id: register._id,
			userName: register.name,
			pwd: register.pwd,
		}
	}
	// ZHECE
	app.post('/api/register',function (req, res) {
		var name = req.body.userName;
		var pwd = req.body.pwd;

		if (!name) {
			return res.json({code: 403, message: 'no userName'});
		}

		if (!pwd) {
			return res.json({code: 403, message: 'no pwd'});
		}

		var options = {
			userName: name,
			pwd: pwd,
		}

		registerSchema.findOne({userName:name}).then(function (item) {
			if (!item) {
				new registerSchema(options).save().then(function (user) {
					console.log(user);
					res.json({
						code: 200,
						data: {
							userId: user._id,
							userName: user.userName,
							pwd: user.pwd,
						}
					});
				}, function (err) {
					res.json({
						code: 600,
						message: err.message
					})
				});
			} else {
				return res.json({code: 302,message: '已经存在'});
			}
		},function (err) {
			res.json({
				code: 600,
				message: err.message
			});
		})
	})
	// DENGLU
	app.post('/api/login',function (req, res) {
		var userName = req.body.userName,
				pwd = req.body.pwd;

		if (!userName) {
			return res.json({code: 403, message: 'no userName'});
		}

		if (!pwd) {
			return res.json({code: 403, message: 'no pwd'});
		}

		registerSchema.findOne({userName: userName}).then(function (item) {
			if (!item) {
				res.json({
					code: 600,
					msg: '未注册'
				})
			} else {
				if (item.pwd == pwd) {
					res.json({
						code: 200,
						msg: '登录成功'
					})
				} else {
					res.json({
						code: 600,
						msg: '密码或者用户名错误'
					})
				}
			}
		},function (err) {
			res.json({
				code: 600,
				msg: err.message,
			})
		})
	});
}