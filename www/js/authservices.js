//Auth服务实现，业务逻辑
'use strict';

angular.module('otrsapp.authservices', []).factory('AuthService', function ($q, CommonService) {

  return {
    login: function ($http, credentials) {
      var deferred = $q.defer();

      var request = $http({
        method: "post",
        url: "http://61.133.217.140:808/otrs/nph-genericinterface.pl/Webservice/GenericTicketConnector",
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        data: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
          'xmlns:tic="http://www.otrs.org/TicketConnector/"> ' +
          '<soapenv:Header/>' +
          '<soapenv:Body>' +
          '<SessionCreate>' +
          '  <tic:UserLogin>' + credentials.username + '</tic:UserLogin>' +
          '  <tic:Password>' + credentials.password + '</tic:Password>' +
          '</SessionCreate>' +
          '</soapenv:Body>' +
          '</soapenv:Envelope>'
      });
      request.success(
        function (html) {
          var domParser = new DOMParser();
          var xml = domParser.parseFromString(html, 'text/xml')
            .childNodes[0]
            .childNodes[0]
            .childNodes[0]
            .childNodes[0];
          if (xml.nodeName == 'Error') {
            deferred.reject(CommonService.xml2json(xml));
          } else {
            deferred.resolve(CommonService.xml2json(xml));
          }
        }
      ).error(function (status) {
        deferred.reject(status);
      });
      return deferred.promise;
    },
    logout: function ($window) {
      if (typeof $window.localStorage.auth != 'undefined'){
        delete  $window.localStorage.auth ; 
      }
    },
    isLoggedIn: function ($window) {
      if (typeof $window.localStorage.auth == 'undefined') {
        return false;
      } else {
        return true;
      }
    }
  }
});