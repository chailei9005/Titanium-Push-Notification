$.win.open();


 
var jpush = require('cn.cmri.jgpush');
Ti.API.info("module is => " + jpush);


// 获取DeviceToken成功之后调用的函数
function deviceTokenSuccess(e) {
    jpush.registerDevice(e.deviceToken);  		// 调用模块内函数，将获取到的DeviceToken上传到极光服务器上
    Ti.API.info('Received device token: ' + e.deviceToken);
    jpush.setAlias("cmri");						// 这里可以设置设备的别名（Alias），一般设置为用户名，这样便于定向推送
    redirect();//
}

// 获取DeviceToken失败之后调用的函数
function deviceTokenError(e) {
    Ti.API.info('Error:' + e.error);
    var alert = Ti.UI.createAlertDialog({
        title: 'Error',
        message: e.error
    });
    alert.show();		// 弹出一个错误的提示框
}


// 获取到远程推送消息后调用的函数
function receivePush(e) {
	Ti.API.info("receivePush", JSON.stringify(e));
	/*receivePush {"code":0,"data":{"alert":"a","_j_msgid":1871380413,"questionID":"123456","badge":1,"sound":"default","aps":{"badge":1,"sound":"default","alert":"a"}},"type
":"remote","source":{},"inBackground":true,"success":true}*/
	
	// Pass the notification to the module
    jpush.handleNotification(e.data);		// 调用模块内的API进行处理消息（现在仅仅Log了一下，未做进一步处理）
    	
    // TODO: 需要添加对获取到的消息进行处理的代码	
   
  	Ti.API.info('Push message received');
  	Ti.API.info('  Message: ' + e.data.alert);		// e.data.alert 为消息的内容
  	Ti.API.info('  Payload: alert:' + e.data.aps.alert + ' badge:' + e.data.aps.badge + ' sound:' + e.data.aps.sound);		// e.data.aps 中存放一些关于通知的方式
  	
  	// 这部分将来视需求而定，一部分写在这里，一部分写在模块的函数里。
  	if(e.data.questionID) {
  		$.label.text = "收到参数\n" + JSON.stringify(e.data);
  	}
  	
  	Alloy.Globals.isPNClicked = true;
  	Ti.App.Properties.setBool("isPNClicked", true);
}


// 以下部分为注册远程推送
var deviceToken = null;

// ios8 之后的 API 略有不同
if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
	
	Ti.API.info("Ti.Platform.version", Ti.Platform.version);
 
	// Wait for user settings to be registered before registering for push notifications
    Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {
 
        // Remove event listener once registered for push notifications
        Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush); 
 
        Ti.Network.registerForPushNotifications({
            success: deviceTokenSuccess,			// 注册远程推送的同时，会去获取设备的DeviceToken值，这里设置获取成功的回调函数
            error: deviceTokenError,				// 这里设置获取DeviceToken失败的回调函数
            callback: receivePush					// 这里设置收到远程推送消息的回调函数
        });
    });
    
    // Register notification types to use
    Ti.App.iOS.registerUserNotificationSettings({
	    types: [
            Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
            Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
            Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
        ]
    });
}
 
// ios 7 及以前的 API，基本类似
else {
    Ti.Network.registerForPushNotifications({
        // Specifies which notifications to receive
        types: [
            Ti.Network.NOTIFICATION_TYPE_BADGE,
            Ti.Network.NOTIFICATION_TYPE_ALERT,
            Ti.Network.NOTIFICATION_TYPE_SOUND
        ],
        success: deviceTokenSuccess,			// 注册远程推送的同时，会去获取设备的DeviceToken值，这里设置获取成功的回调函数
        error: deviceTokenError,				// 这里设置获取DeviceToken失败的回调函数
        callback: receivePush					// 这里设置收到远程推送消息的回调函数
    });
}


Ti.App.addEventListener('resumed', function() {
	Ti.API.info("on resumed");
	redirect();
}); 

function redirect() {
	//if (Alloy.Globals.isPNClicked) {
	if (Ti.App.Properties.getBool("isPNClicked", false)) {
		Ti.API.info("App opened on notification clicked");
		alert("open on notification");
	}
} 

Ti.App.addEventListener('paused', function() {
	Alloy.Globals.isPNClicked = false;
	Ti.App.Properties.setBool("isPNClicked", false);
}); 