# Little Lords of Twilight Static Website

## Installing
Be sure [Node.js](https://nodejs.org/) is installed.

This website is built with [Gulp](https://gulpjs.com). You can install it with these lines (might require admin privileges):
```
npm install gulp-cli -g
```

Navigate to the project's root folder and install the required `npm` components by typing this line:
```
npm install
```

## Development
Once the installation is complete, you can launch a development local server to develop simply by typing:
```
gulp
```

## Deployment
Once the installation is complete, you can build the project folder by typing:
```
gulp build
```
Then push the content of the *build* folder to a webserver using any method.
https://console.cloud.google.com/storage/browser/heroesoftwilight_landingpage;tab=objects?authuser=1&prefix=&forceOnObjectsSortingFiltering=false