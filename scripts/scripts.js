"use strict";angular.module("parkingCheckApp",["ngCookies","ngResource","ngSanitize","ngRoute","ngTouch","ngAnimate","ui.router","gsDirectives","ngStorage","ngMap","ngAutocomplete"]).constant("$config",{app:{name:"Parking Check"},"package":{name:"com.parkingcheck.gautham"},api:{prefix:"http:/",url:"api.parkwhiz.com",action:"search",key:"840e0ffb46613429dd2e90c99316ff50",builder:function(a){var b,c=this;if(a&&a.destination)return b=[c.prefix,c.url,c.action].join("/"),b+="?destination="+a.destination+"&key="+c.key,b.replace(/\s/g,"+")},builderBackup:function(a){var b,c;return b=1===a.type?"https://maps.googleapis.com/maps/api/place/textsearch/json?query=parking in ":"https://maps.googleapis.com/maps/api/place/search/json?types=parking&location=",c="&radius=500&key=AIzaSyBbW2hMLYX-YkJ4CqwObIuA1CynCoJ3tno",(b+a.destination+c).replace(/\s/g,"+")}},map:{linkType1:"https://www.google.com/maps/dir/Current+Location/",linkType2:"https://maps.google.com/maps?saddr=Current+Location&dirflg=w&daddr="},timer:5e3,geoConfig:{alternate:!1,timeout:1e4}}).config(["$stateProvider","$urlRouterProvider","$compileProvider",function(a,b,c){b.otherwise("/park"),a.state("app",{views:{"@":{templateUrl:"/views/app-page.html"},"Header@app":{templateUrl:"/views/header.html",controller:["$scope","$rootScope",function(a,b){a.back=function(){b.$broadcast("$$back")}}]},"Footer@app":{templateUrl:"/views/footer.html"}}}).state("app.park",{url:"/park",views:{"Content@app":{templateUrl:"/views/parking.html",controller:"ParkingCtrl"}}}).state("app.park.locate",{url:"/locate/:latitude/:longitude",views:{"Content@app":{templateUrl:"/views/locate-user.html",controller:"LocateUserCtrl"}}}).state("app.search",{url:"/search",views:{"Content@app":{templateUrl:"/views/search-parking.html",controller:"SearchParkingCtrl"}}}).state("app.history",{url:"/history",views:{"Content@app":{templateUrl:"/views/history.html",controller:"HistoryCtrl"}}}).state("app.connect",{url:"/connect",views:{"Content@app":{templateUrl:"/views/connect.html",controller:"ConnectCtrl"}}}),c.aHrefSanitizationWhitelist(/^\s*(https?|geo|javascript):/)}]).run(["$rootScope","$state","$deviceListeners","NotificationService","$config",function(a,b,c,d,e){a.$state=b,a.$app=e.app,c.init(),a.$on("$$ready",function(){d.ready()})}]),angular.module("parkingCheckApp").controller("MainCtrl",["$scope","$geocode",function(a,b){a.locate=function(){b.geocode(a,{timeout:1e4}).then(function(b){a.position=b})},a.$on("$$ready",function(){a.isAvailable=!1,window.plugin&&window.plugin.notification&&window.plugin.notification.local&&(a.isAvailable=!0)})}]),function(){navigator.geolocation.getAccurateCurrentPosition=function(a,b,c,d){var e,f,g,h=0;d=d||{};var i=function(a){e=a,h+=1,a.coords.accuracy<=d.desiredAccuracy&&h>1?(clearTimeout(g),navigator.geolocation.clearWatch(f),l(a)):c(a)},j=function(){navigator.geolocation.clearWatch(f),l(e)},k=function(a){clearTimeout(g),navigator.geolocation.clearWatch(f),b(a)},l=function(b){a(b)};d.maxWait||(d.maxWait=1e4),d.desiredAccuracy||(d.desiredAccuracy=20),d.timeout||(d.timeout=d.maxWait),d.maximumAge=0,d.enableHighAccuracy=!0,f=navigator.geolocation.watchPosition(i,k,d),g=setTimeout(j,d.maxWait)}}(),angular.module("parkingCheckApp").factory("$geocode",["$config","$q",function(a,b){function c(a,b,c){switch(a.code){case 1:b.$apply(function(){c.reject("You have rejected access to your location!")});break;case 2:b.$apply(function(){c.reject("Unable to determine your location. Please try again!")});break;case 3:b.$apply(function(){c.reject("Unable to determine your location. Please make sure your GPS is enabled!")})}}return{geocode:function(d,e){var f=b.defer(),g={enableHighAccuracy:!0,timeout:a.geoConfig.timeout,maximumAge:0};return e&&e.timeout&&(g.timeout=e.timeout),navigator&&navigator.geolocation?navigator.geolocation.getAccurateCurrentPosition&&a.geoConfig.alternate?navigator.geolocation.getAccurateCurrentPosition(function(a){d.$apply(function(){f.resolve(a)})},function(a){c(a,d,f)},function(a){d.$apply(function(){a.coords?f.resolve(a):f.notify(a)})},g):navigator.geolocation.getCurrentPosition(function(a){d.$apply(function(){f.resolve(a)})},function(a){c(a,d,f)},g):f.reject("Browser does not support location services"),f.promise},watch:function(a,d){var e=b.defer(),f={enableHighAccuracy:!0,timeout:5e3,maximumAge:0};return d&&d.timeout&&(f.timeout=d.timeout),navigator&&navigator.geolocation?navigator.geolocation.watchPosition(function(b){a.$apply(function(){e.resolve(b)})},function(b){c(b,a,e)},f):e.reject("Browser does not support location services"),e.promise}}}]),angular.module("parkingCheckApp").factory("$deviceListeners",["$document","$rootScope",function(a,b){function c(){a[0].addEventListener("deviceReady",function(a){b.$broadcast("$$ready",{eventDefault:a}),window.cordova&&window.cordova.plugins.Keyboard&&cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0)}),a[0].addEventListener("backbutton",function(a){b.$broadcast("$$back",{eventDefault:a})}),a[0].addEventListener("menubutton",function(a){b.$broadcast("$$menu",{eventDefault:a})}),a[0].addEventListener("blur",function(a){b.$broadcast("$$blur",{eventDefault:a})}),a[0].addEventListener("focus",function(a){b.$broadcast("$$focus",{eventDefault:a})}),a[0].addEventListener("pause",function(a){b.$broadcast("$$pause",{eventDefault:a})}),a[0].addEventListener("resume",function(a){b.$broadcast("$$resume",{eventDefault:a})}),a[0].addEventListener("online",function(a){b.$broadcast("$$online",{eventDefault:a})}),a[0].addEventListener("offline",function(a){b.$broadcast("$$offline",{eventDefault:a})})}return{init:c}}]),angular.module("parkingCheckApp").service("NotificationService",[function(){this.ready=function(){}}]),angular.module("parkingCheckApp").service("$parking",["$localStorage",function(a){function b(b,c){a[c]={location:b,date:new Date}}function c(){a.started=null,a.ended=null}a.parkings||(a.parkings=[]),this.isStarted=function(){return a.started},this.isEnded=function(){return a.ended},this.parked=function(d,e){"start"===e?b(d,"started"):"end"===e&&(b(d,"ended"),a.parkings.push({start:a.started,end:a.ended}),c())}}]),angular.module("parkingCheckApp").controller("DashboardCtrl",["$scope","$parking","$transit","$geocode","$config","$timeout","$rootScope","$state",function(a,b,c,d,e,f,g,h){function i(b){a.isParked&&d.geocode(a).then(function(c){a.location=c,b&&b(),a.mapReady=!0},function(a){console.log("bug found: ",a)})}function j(a,b){h.go("app.park.locate",{location:[a.latitude,a.longitude,b.latitude,b.longitude].join(",")})}var k;a.isParked=b.isStarted(),a.parkingControl=function(){a.isParked?(a.isParked=null,a.location=null,a.mapReady=null,f.cancel(k),g.$emit("$alert",{message:"Your parking session ended",showTime:3e3}),d.geocode(a).then(function(a){b.parked(a,"end")})):(g.$emit("$alert",{message:"Registering your parking location",showTime:3e3}),d.geocode(a).then(function(c){b.parked(c,"start"),a.isParked=b.isStarted(),i()},function(a){g.$emit("$alert",{message:a,showTime:3e3})}))},a.getWalkable=function(){i(function(){c.get(a.location.coords,a.isParked.location.coords).then(function(b){200===b.status&&(a.walking=b.data.route)})})},a.locateInMap=function(){j(a.location.coords,a.isParked.location.coords)},i(),a.$on("$$resume",i),a.$on("$$back",function(){navigator.app.exitApp()})}]),angular.module("parkingCheckApp").directive("parkingButton",function(){return{templateUrl:"/views/directives/parking-button.html",restrict:"E",scope:{clicker:"="},replace:!0,required:"clicker"}}),angular.module("parkingCheckApp").filter("parkingTime",function(){return function(a){if(a){var b=moment(a);return b.fromNow()}}}),angular.module("parkingCheckApp").directive("geoLink",["$config",function(a){return{template:function(){var a='<a class="map-link" data-ng-href="{{prefix}}{{geo.latitude}},{{geo.longitude}}{{suffixLink}}" data-rel="external" data-ng-transclude></a>';return a},restrict:"E",transclude:!0,replace:!0,scope:{geo:"=",suffix:"="},link:function(b){var c=document.body.dataset.platform||"web";switch(b.deviceType=c,c.toLowerCase()){case"android":b.prefix="geo:";break;case"ios":b.prefix="comgooglemaps://";break;default:b.prefix=a.map.linkType1}}}}]),angular.module("parkingCheckApp").directive("devicePlatform",["$window",function(a){return{restrict:"EA",link:function(b,c){var d="android";a.cordova&&(d=a.cordova.platformId),c[0].setAttribute("data-platform",d)}}}]),angular.module("parkingCheckApp").constant("$transitConfig",{example:["http://www.mapquestapi.com/directions/v2/route?key=Fmjtd%7Cluurn1uz2u%2Cbl%3Do5-9wyx50&from=37.973591,-122.532823&to=37.973489,-122.532030&routeType=pedestrian","key=Fmjtd%7Cluurn1uz2u%2Cbl%3Do5-9wyx50","callback=renderAdvancedNarrative","ambiguities=ignore","avoidTimedConditions=false","doReverseGeocode=true","outFormat=json","routeType=fastest","timeType=1","enhancedNarrative=false","shapeFormat=raw","generalize=0","locale=en_US","unit=m","from=Clarendon%20Blvd,%20Arlington,%20VA","to=2400%20S%20Glebe%20Rd,%20Arlington,%20VA","drivingStyle=2","highwayEfficiency=21.0"],url:"http://www.mapquestapi.com/directions/v2/route?key=Fmjtd%7Cluurn1uz2u%2Cbl%3Do5-9wyx50",configuration:{ambiguities:"ignore",routeType:"pedestrian",from:"Clarendon%20Blvd,%20Arlington,%20VA",to:"2400%20S%20Glebe%20Rd,%20Arlington,%20VA"}}).service("$transit",["$http","$transitConfig",function(a,b){var c=b.url,d=b.configuration;this.get=function(b,e){return d.from=b.latitude+","+b.longitude,d.to=e.latitude+","+e.longitude,a.get(c,{params:d})}}]),angular.module("parkingCheckApp").controller("LocateUserCtrl",["$scope","$state","$stateParams","$geocode","$rootScope",function(a,b,c,d,e){var f={latitude:c.latitude,longitude:c.longitude},g={latitude:f.latitude,longitude:f.longitude,icon:"images/map-icon-red.png",title:"To"};e.$emit("$alert",{message:"Locating your current location",showTime:3e3}),d.geocode(a).then(function(b){var c={latitude:b.coords.latitude,longitude:b.coords.longitude,icon:"images/map-icon-blue.png",title:"From"};a.mapConfig={zoom:18,center:c,markers:[c,g]}},function(a){e.$emit("$alert",{message:a,showTime:3e3})},function(a){e.$emit("$alert",{message:a,showTime:3e3})}),a.$on("$$back",function(){b.go("app.park")}),e.header={back:{label:"back",title:"Locate User",align:"right"}},a.$on("$destroy",function(){e.header=null})}]),angular.module("parkingCheckApp").controller("HistoryCtrl",["$scope","$state","$parkingData",function(a,b,c){a.$on("$$back",function(){b.go("app.park")}),a.history=c.history()}]),angular.module("parkingCheckApp").controller("ConnectCtrl",["$scope","$state","$parkingData",function(a,b,c){a.$on("$$back",function(){b.go("app.park")}),a.active=c.current()}]),angular.module("parkingCheckApp").controller("ParkingCtrl",["$scope","$state","$parkingData","$geocode","$rootScope","$location","$anchorScroll","$timeout",function(a,b,c,d,e,f,g,h){function i(){l=c.current(),a.isParked=!!l.start,a.activeParking=l,a.parkingImage=l.image,a.extras=l.extras||{level:null,slot:null,notes:null}}function j(b){a.parkingImage="data:image/jpeg;base64,"+b,c.takePic(a.parkingImage),k("Saving image inside the app")}function k(a){e.$emit("$alert",{message:a,showTime:3e3})}var l,m={parkNow:!1,completed:!0};h(i),a.parkingControl=function(){a.isParked===m.parkNow?(a.isParked=m.completed,a.activeParking=null,a.parkingImage=null,a.extras=null,d.geocode(a).then(function(a){c.start(a),i()})):a.isParked===m.completed&&(a.isParked=m.parkNow,c.end({timestamp:(new Date).getTime()}))},a.openInMaps=function(){l.start&&b.go("app.park.locate",{latitude:l.start.coords.latitude,longitude:l.start.coords.longitude})},a.needExtra=!1,a.saveExtra=function(){a.needExtra&&c.addExtras(a.extras),a.needExtra=!1,f.hash("")},a.cancelExtra=function(){a.needExtra=!1,f.hash("")},a.addNotes=function(){a.needExtra=!a.needExtra,f.hash("additionalInformation"),g()},a.clickPicture=function(){window.navigator&&navigator.camera?navigator.camera.getPicture(j,k,{quality:100,destinationType:Camera.DestinationType.DATA_URL,sourceType:Camera.PictureSourceType.CAMERA,allowEdit:!0,encodingType:Camera.EncodingType.PNG,popoverOptions:null,saveToPhotoAlbum:!1,correctOrientation:!1,targetWidth:800,targetHeight:800}):k("Camera plugin unavailable")},a.$on("$$back",function(){navigator.app.exitApp()})}]),angular.module("parkingCheckApp").directive("screenSize",function(){return{restrict:"A",scope:{screenSize:"@"},link:function(a,b){function c(){a.screenSize&&b.css({height:window.innerHeight-parseFloat(a.screenSize)+"px"})}c(),window.addEventListener("deviceorientation",c,!1)}}}),angular.module("parkingCheckApp").factory("$parkingData",["$localStorage",function(a){function b(b){return a[b]||(a[b]={active:{},history:[]}),a[b]}function c(b,c){a[b]&&c&&(a[b]=c)}function d(b){a[k].active.image=b}function e(b){a[k].active.extras=b}function f(){return b(k).active}function g(){return f().start}function h(a){var d=b(k);d.active.start=a,c(k,d)}function i(a){var d={start:g(),end:a},e=b(k);return e.history.unshift(d),e.active={},c(k,e),d}function j(){return b(k).history}var k="parking-data";return{current:f,started:g,start:h,end:i,history:j,takePic:d,addExtras:e}}]),angular.module("parkingCheckApp").directive("parkingListItem",function(){return{templateUrl:"/views/directives/parking-list-item.html",restrict:"E",scope:{parking:"=listItem"},replace:!0,required:"listItem"}}),angular.module("parkingCheckApp").controller("SearchParkingCtrl",["$scope","$geocode","$state","ParkingSearchData","$rootScope",function(a,b,c,d,e){function f(b){d.callApi(b).then(function(b){a.parking=b,a.searching.started=!1,console.log("output",b)},function(b){a.failure.reason=b,a.searching.started=!1})}a.customLocation=d.lastActiveSearch,a.searching={},a.failure={},a.findNearMe=function(){e.$emit("$alert",{message:"Searching for parking near your current location",showTime:5e3}),a.searching.started=!0,a.parking=null,b.geocode(a).then(function(a){f({destination:a.coords.latitude+","+a.coords.longitude,type:0})},function(b){e.$emit("$alert",{message:b,showTime:3e3}),a.searching.started=!1},function(b){e.$emit("$alert",{message:b,showTime:3e3}),a.searching.started=!1})},a.findParking=function(){a.searching.started=!0,a.parking=null,e.$emit("$alert",{message:"Searching for parking places",showTime:3e3}),a.customLocation&&f({destination:a.customLocation,type:1})},a.$on("$$back",function(){c.go("app.park")}),a.customLocation&&"string"==typeof a.customLocation&&f({destination:a.customLocation})}]),angular.module("parkingCheckApp").service("ParkingSearchData",["$q","$http","$sessionStorage","$config",function(a,b,c,d){var e=this;this.lastActiveSearch=null,this.callApi=function(f){var g=d.api.builder(f),h=a.defer();return g=d.api.builderBackup(f),c.parkingSearches=c.parkingSearches||{},c.parkingSearches&&c.parkingSearches[f.destination]&&Math.floor(moment.duration(moment().diff(moment(c.parkingSearches[f.destination].cacheTime))).asMinutes())<5?(e.lastActiveSearch=f.destination,h.resolve(c.parkingSearches[f.destination].data)):b.get(g).then(function(a){a.data.parking_listings||a.data.results?(c.parkingSearches[f.destination]={cacheTime:(new Date).getTime(),data:a.data},h.resolve(a.data),e.lastActiveSearch=f.destination):(h.reject("No parking information found."),e.lastActiveSearch=f.destination)},function(a){h.reject(a),e.lastActiveSearch=null}),h.promise}}]);