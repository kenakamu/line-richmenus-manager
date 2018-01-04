# LINE Rich Menus Manager
日本語は[こちら](./README_ja.md)

This is a tool to manager Rich Menus for your LINE bot. See [here](https://developers.line.me/en/docs/messaging-api/using-rich-menus/) for more detail about Rich Menu.

# Install from npm
If you just want to use it, install and run from npm.

```
npm install -g line-richmenus-manager
line-richmenus-manager
```
or for macOS, 
```
sudo npm install -g line-richmenus-manager
sudo line-richmenus-manager
```
It will open a browser and start the service on port 3000. I recommend using Chrome as browser.
When you stop it, Ctrl+C from the terminal.
You can also pass port parameter to specify port to run the app.
```
line-richmenus-manager --port:3200
```
# How to use the application.
It's simple enough to figure out. Please try and let me know if you stuck somewhere.

# Features
At the moment, the applicaiton let you:
- List Rich Menus for your bot.
- Find a Rich Menu for a user.
- See the Rich Menu detail, link or unlink it from a user.
- Create new Rich Menu.
- Delete the Rich Menu.
You can use mouse to draw the area for action in the image you specify, or/and use text box to specify x/y/width/hight for pixel level modificaiton.

# Get it from GitHub
## Prerequisits
- LINE developer account
- node.js
- And of course your LINE bot app :)
- Visual Studio Code
- Debugger for Chrome extension
- **This app is only tested in Chrome**

## Setup
Use following commands to clone and install module.
```
git clone https://github.com/kenakamu/line-richmenus-manager
npm install
```

## Start debugging
This application consists of express server and Angular 2 application. To debug this, do the following.

1. Open Integarated Console and run the following command. It runs Angular 2 application and use proxy.js to talk with server (express in this case.)
```
ng serve --aot --progress=false --proxy-config proxy.conf.json
```

2. If you want to debug express server, then select Debug menu in VSCode, then select "Launch Node". Press F5, which will run the node app in debug mode.

3. To debug browser, select "Launch Chrome" and Press F5.

## Special Thanks
Azuma Ken

This application uses [Ignite UI for Angular](https://www.infragistics.com/products/ignite-ui-angular) by INFRAGISTICS as UI component.