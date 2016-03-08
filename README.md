# Titanium-Push-Notification
使用Titanium开发APP的消息推送功能时，需要用到第三方推送服务，例如极光、百度等（本例程使用的是极光推送），在集成第三方推送的SDK时，Titanium与Native开发区别很大，尤其在收到消息之后的处理过程中，比Native要费劲的多。
本例的Android模块是在[刘明星开发的模块][1]基础上修改而来，在此感谢刘明星大神的帮助！IOS模块为自己集成。

开发前准备工作：
- 申请极光推送账号、创建应用；
- 生成IOS推送证书、并上传至极光刚创建的应用中（这个步骤不是必须的，IOS可以不经过第三方推送服务器，而是由自己的服务器实现推送消息封装，并调用苹果官方推送的API；）；

  [1]: https://github.com/liumingxing/titanium_module_jpush_android