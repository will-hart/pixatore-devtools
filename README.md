# Pixatore developer tools for Chrome

> Based on the `ecsy` devtools extension announced here: https://blog.mozvr.com/ecsy-developer-tools/

This extension allows inspecting Pixatore ECS and EventBus events. Unlike ecsy-devtools, performance is not optimal!

![screenshot](https://raw.githubusercontent.com/will-hart/pixatore-devtools/stable/assets/readme/screenshot.png)


## Developing

To work on the devtools, visit `chrome://extensions` or `brave://extensions`,
set developer mode and load an unpacked extension from the `dist` dir of the
cloned repo.

Make sure the build is up to date, either by running `yarn production` or `yarn
watch`.

## Availability

Version 0.1.0 is currently under review in the Chrome app store.
