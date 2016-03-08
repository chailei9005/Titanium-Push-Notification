# Android例程

## 关键是理解刘明星jpush模块中MamashaiReceiver的代码

``` java
	if (running_activity_name.equals("org.appcelerator.titanium.TiActivity")){
    	//收到通知
        	if (JPushInterface.ACTION_NOTIFICATION_RECEIVED.equals(intent.getAction())){
	        	Intent intent2 = new Intent();
	            intent2.setAction("ACTION_NOTIFICATION");
	        	intent2.putExtras(intent.getExtras());
	            
	            context.sendBroadcast(intent2);
	        }
        	//收到自定义消息
        	if (JPushInterface.ACTION_MESSAGE_RECEIVED.equals(intent.getAction())){
        		Intent intent2 = new Intent();
        		intent2.setAction("ACTION_MESSAGE");
        		intent2.putExtras(intent.getExtras());
        		
        		context.sendBroadcast(intent2);
        	}
            //打开消息通知
        	if (JPushInterface.ACTION_NOTIFICATION_OPENED.equals(intent.getAction())){
        		Intent intent2 = new Intent();
        		intent2.setAction("ACTION_NOTIFICATION_OPENED");
        		intent2.putExtras(intent.getExtras());
        		
        		context.sendBroadcast(intent2);
        	}
        }
        else{
        	if (JPushInterface.ACTION_NOTIFICATION_OPENED.equals(intent.getAction())){
	        	PackageManager pm = context.getPackageManager();
    			Intent intent2 = pm.getLaunchIntentForPackage(context.getPackageName());
    			intent2.putExtras(intent.getExtras());
    			context.startActivity(intent2);
    			
	        	return;
	        }
        }
```
在上述代码中，
+ app前台运行时，执行的逻辑是running_activity_name.equals("org.appcelerator.titanium.TiActivity")条件中的代码，代码很好理解，根据不同的类型发送相应的Broadcast，
+ app后台运行或者关闭时，执行的是else中的代码；使用Android系统的Launcher来启动app

