// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase : {
    apiKey: "AIzaSyCheuhjcCzPTWRWbr4Dcq3RjI78kBYhEWI",
    authDomain: "fb-lessons.firebaseapp.com",
    databaseURL: "https://fb-lessons.firebaseio.com",
    projectId: "fb-lessons",
    storageBucket: "fb-lessons.appspot.com",
    messagingSenderId: "380996647685",
    appId: "1:380996647685:web:5db54bbd956390af45956c"
  }

};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
