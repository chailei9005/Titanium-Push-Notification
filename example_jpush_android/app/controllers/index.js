/**
 * Global Navigation Handler
 */
Alloy.Globals.Navigator = {
	
	/**
	 * Handle to the Navigation Controller
	 */
	navGroup: $.nav,
	
	open: function(controller, payload){
		var win = Alloy.createController(controller, payload || {}).getView();
		
		if(OS_IOS){
			$.nav.openWindow(win);
		}
		else if(OS_MOBILEWEB){
			$.nav.open(win);
		}
		else {
			
			// added this property to the payload to know if the window is a child
			if (payload.displayHomeAsUp){
				
				win.addEventListener('open',function(evt){
					var activity=win.activity;
					activity.actionBar.displayHomeAsUp=payload.displayHomeAsUp;
					activity.actionBar.onHomeIconItemSelected=function(){
						evt.source.close();
					};
				});
			}
			win.open();
		}
	}
};

function doClick(e) {
    // alert($.label.text);
    Alloy.Globals.Navigator.open("home", {displayHomeAsUp:true});
}

$.win.open();

var push = require('com.mamashai.jpush');
push.setAlias(Ti.App.Properties.getString("userid", "test"), function(e){
    Ti.API.info("register to jpush code: " + e.code + ", token: " + e.device_token);
});

handle();
function handle() {
	var act = Titanium.Android.currentActivity;
	var _intent = act.intent;
	var str = _intent.getStringExtra("cn.jpush.android.EXTRA");
	if (str && str.length > 0){
	    Ti.API.info("str=", str);
	    // var oldPush = Ti.App.Properties.getString("push", "");
	    // if(JSON.stringify(str) !== oldPush) {
	    	// doClick();
	    // } else {
	    	// Ti.API.info("重复通知");
	    // }
	    // Ti.App.Properties.setString("push", JSON.stringify(str));
	    doClick();
	}
	var alert = _intent.getStringExtra("cn.jpush.android.ALERT");
	if(alert && alert.length > 0){
		Ti.API.info("alert", alert);
	}
	
	var message = _intent.getStringExtra("cn.jpush.android.MESSAGE");
	if(message && message.length > 0){
		Ti.API.info("message", message);
	}
}

/*收到 通知 的log如下
[DEBUG] MamashaiJPush: [MamashaiReceiver] onReceive - cn.jpush.android.intent.NOTIFICATION_RECEIVED, extras:
[DEBUG] MamashaiJPush: key:cn.jpush.android.PUSH_ID, value:4032817545
[DEBUG] MamashaiJPush: key:cn.jpush.android.ALERT, value:123
[DEBUG] MamashaiJPush: key:cn.jpush.android.EXTRA, value:{}
[DEBUG] MamashaiJPush: key:cn.jpush.android.NOTIFICATION_ID, value:185926152
[DEBUG] MamashaiJPush: key:cn.jpush.android.NOTIFICATION_CONTENT_TITLE, value:example_jpush_android
[DEBUG] MamashaiJPush: key:cn.jpush.android.MSG_ID, value:4032817545
[DEBUG] D/~~~~~~~~~~~: org.appcelerator.titanium.TiActivity
*/

/*收到 自定义消息 的log如下
[DEBUG] MamashaiJPush: [MamashaiReceiver] onReceive - cn.jpush.android.intent.MESSAGE_RECEIVED, extras:
[DEBUG] MamashaiJPush: key:cn.jpush.android.EXTRA, value:
[DEBUG] MamashaiJPush: key:cn.jpush.android.TITLE, value:
[DEBUG] MamashaiJPush: key:cn.jpush.android.MESSAGE, value:123
[DEBUG] MamashaiJPush: key:cn.jpush.android.CONTENT_TYPE, value:
[DEBUG] MamashaiJPush: key:cn.jpush.android.APPKEY, value:d4965b92772476340028943b
[DEBUG] MamashaiJPush: key:cn.jpush.android.MSG_ID, value:1132633616
[DEBUG] D/~~~~~~~~~~~: org.appcelerator.titanium.TiActivity
*/

//用户点击了推送
var bc = Ti.Android.createBroadcastReceiver({
    onReceived : function(e) {
    	Ti.API.info(JSON.stringify(e));
        // Ti.API.info("cn.jpush.android.PUSH_ID: " + e.intent.getStringExtra("cn.jpush.android.PUSH_ID"));
        // Ti.API.info("app: "                             + e.intent.getStringExtra("app"));
        Ti.API.info("cn.jpush.android.ALERT: "          + e.intent.getStringExtra("cn.jpush.android.ALERT"));
        Ti.API.info("cn.jpush.android.EXTRA: "          + e.intent.getStringExtra("cn.jpush.android.EXTRA"));
        // Ti.API.info("cn.jpush.android.NOTIFICATION_ID: "+ e.intent.getStringExtra("cn.jpush.android.NOTIFICATION_ID"));
        // Ti.API.info("cn.jpush.android.NOTIFICATION_CONTENT_TITLE: " + e.intent.getStringExtra("cn.jpush.android.NOTIFICATION_CONTENT_TITLE"));
        // Ti.API.info("cn.jpush.android.MSG_ID: "         + e.intent.getStringExtra("cn.jpush.android.MSG_ID"));
        Ti.API.info("cn.jpush.android.TITLE: "          + e.intent.getStringExtra("cn.jpush.android.TITLE"));
        // Ti.API.info("cn.jpush.android.MESSAGE: "        + e.intent.getStringExtra("cn.jpush.android.MESSAGE"));
        // Ti.API.info("cn.jpush.android.CONTENT_TYPE: "   + e.intent.getStringExtra("cn.jpush.android.CONTENT_TYPE"));
        // var str = e.intent.getStringExtra("cn.jpush.android.ALERT"); 
        // var str = e.intent.getStringExtra("cn.jpush.android.MESSAGE"); 
        // if (str && str.length > 0){
            // // show_alert("提示", e.intent.getStringExtra("cn.jpush.android.EXTRA"));
            // $.label.text = str;
            // alert("收到推送消息: "+e.intent.getStringExtra("cn.jpush.android.MESSAGE"));
        // }
        // alert("收到推送消息: "+e.intent.getStringExtra("cn.jpush.android.ALERT"));
    }
});

//Ti.Android.registerBroadcastReceiver(bc, ['ACTION_NOTIFICATION']);
//一定要释放掉，否则容易出问题
// $.win.addEventListener("close", function(){
    // Ti.Android.unregisterBroadcastReceiver(bc);
// }); 

//收到推送，还未打开
var bc2 = Ti.Android.createBroadcastReceiver({
    onReceived : function(e) {
        // var json = JSON.parse(e.intent.getStringExtra("cn.jpush.android.EXTRA"));
        // Ti.API.info("received notify");
        // Ti.API.info(e.intent.getStringExtra("cn.jpush.android.ALERT"));
        // //to do
        // if(e.intent.getStringExtra("cn.jpush.android.ALERT")){
	        // alert("收到推送通知: "+e.intent.getStringExtra("cn.jpush.android.ALERT"));
        // } else {
	        // alert("收到推送消息: "+e.intent.getStringExtra("cn.jpush.android.MESSAGE"));
        // }
        Ti.API.info(JSON.stringify(e));
        Ti.API.info("cn.jpush.android.TITLE: "          + e.intent.getStringExtra("cn.jpush.android.TITLE"));
        Ti.API.info("cn.jpush.android.MESSAGE: "        + e.intent.getStringExtra("cn.jpush.android.MESSAGE"));
        Ti.API.info("cn.jpush.android.EXTRA: "          + e.intent.getStringExtra("cn.jpush.android.EXTRA"));
        // alert("收到推送消息: "+e.intent.getStringExtra("cn.jpush.android.MESSAGE"));
    }
});
//Ti.Android.registerBroadcastReceiver(bc2, ['ACTION_MESSAGE']);
//一定要释放掉，否则容易出问题
// $.win.addEventListener("close", function(){
    // Ti.Android.unregisterBroadcastReceiver(bc2);
// }); 

var bc3 = Ti.Android.createBroadcastReceiver({
    onReceived : function(e) {
    	Ti.API.info("~~~~~~~~~~~~~~~~~~~~");
    	Ti.API.info(JSON.stringify(e));
        Ti.API.info("cn.jpush.android.ALERT: "          + e.intent.getStringExtra("cn.jpush.android.ALERT"));
        Ti.API.info("cn.jpush.android.EXTRA: "          + e.intent.getStringExtra("cn.jpush.android.EXTRA"));
        Ti.API.info("cn.jpush.android.TITLE: "          + e.intent.getStringExtra("cn.jpush.android.TITLE"));
        Ti.API.info("~~~~~~~~~~~~~~~~~~~~");
        Ti.Android.unregisterBroadcastReceiver(bc3);
    }
});

// Ti.Android.registerBroadcastReceiver(bc3, ['ACTION_NOTIFICATION_OPENED']);
//一定要释放掉，否则容易出问题
// $.win.addEventListener("close", function(){
    // Ti.Android.unregisterBroadcastReceiver(bc3);
// }); 