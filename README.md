# Titanium-Push-Notification
使用Titanium开发APP的消息推送功能时，需要用到第三方推送服务，例如极光、百度等（本例程使用的是极光推送），在集成第三方推送的SDK时，Titanium与Native开发区别很大，尤其在收到消息之后的处理过程中，比Native要费劲的多。
本例的Android模块是在[刘明星开发的模块][1]基础上修改而来，在此感谢刘明星大神的帮助！IOS模块为同事fan同学开发。

## 开发前准备工作：
- 申请极光推送账号、创建应用；
- 生成IOS推送证书、并上传至极光刚创建的应用中（这个步骤不是必须的，IOS可以不经过第三方推送服务器，而是由自己的服务器实现推送功能，也就是按照苹果官方规定的方式调用推送API；使用第三方的好处在于极光帮你做了这个封装，你的服务器只需要按照极光的格式调用极光API，比调用苹果的API简单很多）；

## 开发思路
开发时首先要实现的是：收到推送的消息，这一步不难，按照module教程很快可以实现；难点在于收到消息后，该如果处理消息，处理逻辑与功能设计有很大关系，所以开发前必须明确收到消息后要实现哪些功能，这一步Android和IOS还不一样，下面以我刚开发的项目举例说明：
- 类似于微博，APP前台运行时收到消息，在底部tab对应的位置显示红点，提示用户；APP后台运行或者未打开时，会在通知栏收到提示，点击提示启动app，并跳转到某个页面。

需要注意
- Android无论app是何种状态（前台、后台或者关闭），通知栏都会收到提示；
- IOS的app前台运行时，无通知栏提示；后台或者关闭状态，才会有通知栏提示；

实际的方案
+ Android
  + app前台运行时，在index.js中创建一个BroadcastReceiver，将该Broadcast Receiver注册到系统“ACTION_NOTIFICATION_OPENED”事件中；Broadcast Receiver中的onReceive方法中，根据消息携带的参数以及不同条件更新UI，对之前的项目，此时更新Tab，加小红点。
  + app后台运行或者关闭时，在index.js代码开始部分，判断activity是否携带了intent参数，如果参数中有符合条件的参数，则执行页面跳转逻辑；

+ IOS
  + 要处理的情况有：app前台运行、app后台运行、app被kill
  + 关键是Ti.Network.registerForPushNotifications中的callback以及Ti.App.addEventListener('resumed')监听
  + app前台运行时，收到push通知会自动运行callback，在callback中执行加小红点的逻辑，并且在Ti.App.Properties中将一个标志位置为true；
  + app后台运行时，收到push，点击push打开app，运行callback（应该是先执行callback，后进入resume监听），resume监听中，根据Ti.App.Properties中标志位决定是否需要跳转；
  + app被kill，跳转的业务逻辑代码，除了在resume监听里调用，还需要在获取device token成功的回调函数里调用，（操作步骤：kiall app-收到push-点击push，打开app后代码执行顺序：push处理回调（将标志位设置为true）->device token成功回调（根据标志位判断页面跳转））

## 具体例程
参见代码以及例程中的注释
- [Android][2]
- [IOS][3]

## 开发时遇到的难题以及解决办法：

+ Android
  + 点击通知-打开APP-页面跳转，之后点击APP图标-打开APP，页面也跳转，原因&解决办法：注册的BroadcastReceiver一定要在该页面关闭的监听中注销掉；
  + 如果index本身就有页面跳转逻辑，比如根据用户缓存进行index-login或者index-home的跳转，那么消息处理的跳转最好放到home中，index里不能连续执行两次跳转，否则只打开最后那个页面。

+ IOS
  + app被kill之后，收到通知，点击消息栏中的通知打开app，resume监听中的跳转逻辑未执行，解决办法：如上述IOS实际方案中的描述，跳转的业务逻辑代码，除了在resume监听里调用，还需要在获取device token成功的回调函数里调用


  [1]: https://github.com/liumingxing/titanium_module_jpush_android
  [2]: https://github.com/jackgreentemp/Titanium-Push-Notification/tree/master/example_jpush_android
  [3]: https://github.com/jackgreentemp/Titanium-Push-Notification/tree/master/example_jpush_ios
