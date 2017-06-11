function processAreaData($scope) {

        $scope.area.candidates.sort(function(a,b) {
            return (a.votes < b.votes) ? 1 : (a.votes > b.votes ? -1 : 0);
        });

        $scope.pieChart = {type : "PieChart",
            options : { legend:'right',
                chartArea:{left:0, top:0, width:"100%", height:"100%"}
        }};
        $scope.pieChart.data = new google.visualization.DataTable();
        $scope.pieChart.data.addColumn('string', 'Kandydat');
        $scope.pieChart.data.addColumn('number', 'Wynik');

        for (var c in $scope.area.candidates) {
            cand = $scope.area.candidates[c];
            cand.result = Math.round(cand.votes / $scope.area.votes * 10000) / 100;
            $scope.pieChart.data.addRows([[cand.name, cand.result]]);
        }
}

var mainApp = angular.module('mainApp', ['googlechart', 'ngRoute', 'ngResource', 'angular-cache', 'angular-jwt', 'adTokenAuth', 'ui.bootstrap']);

mainApp.config(function($routeProvider, $authProvider) {
    $routeProvider.when('/', {
        templateUrl: 'country.htm',
        controler: 'CountryController'
    }).when('/v/:no', {
        templateUrl: 'voivodeship.htm',
        controler: 'VoivodeshipController'
    }).when('/d/:no', {
        templateUrl: 'district.htm',
        controler: 'DistrictController'
    }).when('/c/:code', {
        templateUrl: 'commune.htm',
        controler: 'CommuneController'
    }).when('/csearch', {
        templateUrl: 'csearch.htm',
        controler: 'CSearchController'
    }).when('/vsearch', {
        templateUrl: 'vsearch.htm',
        controler: 'VSearchController'
    }).when('/dsearch', {
        templateUrl: 'dsearch.htm',
        controler: 'DSearchController'
    }).when('/ccsearch', {
        templateUrl: 'ccsearch.htm',
        controler: 'CCSearchController'
    }).when('/login', {
        templateUrl: 'login.htm',
        controler: 'LoginController'
    }).when('/logout', {
        templateUrl: 'logout.htm',
        controler: 'LogoutController'
    }).when('/update/:id', {
        templateUrl: 'update.htm',
        controler: 'UpdateController'
    });

     $authProvider.config({
		 	apiUrl: window.location.origin,
            signOutUrl: '/api/token-logout/',
            emailSignInPath: '/api/token-auth/',
            tokenValidationPath: '/api/token-auth/',
            tokenRefreshPath: '/api/token-refresh/',
            validateOnPageLoad: false,
            tokenFormat: {
                'Authorization': 'JWT {{ token }}'
            }
		});
});

mainApp.run(function ($http, $rootScope, $window, $location, jwtHelper, CacheFactory) {
  var appCache = CacheFactory('appCache', {
    capacity : 500,
    deleteOnExpire: 'aggressive',
    storageMode: 'localStorage',
    maxAge: 15 * 60 * 1000
  });
   $rootScope.lastPage = '/';
   if (localStorage.getItem('token')) {
      $rootScope.username = jwtHelper.decodeToken(localStorage.getItem('token')).username;
      $http.defaults.headers.common.Authorization = 'JWT ' + localStorage.getItem('token');
   }

   $rootScope.$on('auth:success', function(e, type, data) {
      $rootScope.alertType = null;
      $rootScope.username = jwtHelper.decodeToken(data.token).username;
      $http.defaults.headers.common.Authorization = 'JWT ' + data.token;
      localStorage.setItem('token', data.token);
      $location.path($rootScope.lastPage);
	});

	$rootScope.$on('auth:error', function(e, type, err) {
      $rootScope.username = null;
      $rootScope.alertType = 'danger';
      $rootScope.alertMsg = 'Błąd logowania! Wpisz poprawnego użytkownika i hasło.';
      $location.path('/login');
	});

	$rootScope.$on('auth:logout-success', function() {
      $rootScope.alertType = null;
      $rootScope.username = null;
      $http.defaults.headers.common.Authorization = null;
      localStorage.removeItem('token');
      $location.path($rootScope.lastPage);
	});

	$rootScope.$on('auth:logout-error', function(e, err) {
      $rootScope.username = null;
      $http.defaults.headers.common.Authorization = null;
      localStorage.removeItem('token');
      $location.path($rootScope.lastPage);
	});
});

mainApp.controller('CountryController', function CountryController($scope, $http, $rootScope, $location, CacheFactory, googleChartApiPromise) {
    $rootScope.lastPage = $location.$$path;
    $rootScope.alertType = null;

    $http.get('/api/countries/Polska', {cache: CacheFactory.get('appCache')})
    .then(function (response) {
        $rootScope.alertType = null;
        $scope.area = response.data;

        googleChartApiPromise.then(function () {
           processAreaData($scope);
        });

    }).catch(function(response) {
        $rootScope.alertType = 'danger';
        $rootScope.alertMsg = 'Błąd połączenia z serwerem. Spróbuj ponownie później.';
    });

});

mainApp.controller('VoivodeshipController', function VoivodeshipController($scope, $rootScope, $routeParams, $http, $location, CacheFactory, googleChartApiPromise) {
    $rootScope.lastPage = $location.$$path;
    $rootScope.alertType = null;

    $http.get('/api/voivodeships/'+$routeParams.no, {cache: CacheFactory.get('appCache')})
        .then(function (response) {
        $rootScope.alertType = null;
        $scope.area = response.data;

        googleChartApiPromise.then(function () {
           processAreaData($scope);
        });

    }).catch(function(response) {
        $rootScope.alertType = 'danger';
        $rootScope.alertMsg = 'Błąd połączenia z serwerem. Spróbuj ponownie później.';
    });
});

mainApp.controller('DistrictController', function DistrictController($scope, $rootScope, $routeParams, $http, $location, CacheFactory, googleChartApiPromise) {
    $rootScope.lastPage = $location.$$path;
    $rootScope.alertType = null;

    $http.get('/api/districts/'+$routeParams.no, {cache: CacheFactory.get('appCache')})
    .then(function (response) {
        $rootScope.alertType = null;
        $scope.area = response.data;

        googleChartApiPromise.then(function () {
           processAreaData($scope);
        });

    }).catch(function(response) {
        $rootScope.alertType = 'danger';
        $rootScope.alertMsg = 'Błąd połączenia z serwerem. Spróbuj ponownie później.';
    });
});

mainApp.controller('CommuneController', function CommuneController($scope, $rootScope, $routeParams, $http, $location, googleChartApiPromise, CacheFactory) {
    $rootScope.lastPage = $location.$$path;
    $rootScope.alertType = null;

    $http.get('/api/communes/'+$routeParams.code, {cache: CacheFactory.get('appCache')})
    .then(function (response) {
        $rootScope.alertType = null;
        $scope.area = response.data;

        googleChartApiPromise.then(function () {
           processAreaData($scope);
        });

    }).catch(function(response) {
        $rootScope.alertType = 'danger';
        $rootScope.alertMsg = 'Błąd połączenia z serwerem. Spróbuj ponownie później.';
    });
});

mainApp.controller('CSearchController', function ($scope, $rootScope, $location, $http) {
    $rootScope.lastPage = $location.$$path;
    $rootScope.alertType = null;
    $scope.sortKey = 'code';
    $scope.reverse = false;

    $scope.pageChanged = function() {
      $scope.loadData($scope.query, $scope.currentPage);
    };

    $scope.loadData = function(q, p){
      $http.get('/api/csearch?q=' + q + '&page=' + p + '&ordering=' + ($scope.reverse?'-':'') + $scope.sortKey)
      .then(function (response) {
          $rootScope.alertType = null;
          $scope.data = response.data.count > 0 ? response.data : null;
          $scope.count = response.data.count;
          $scope.numPages = response.data.numPages;
          $scope.pageSize = response.data.pageSize;
      }).catch(function(response) {
          $scope.data = null;
          $rootScope.alertType = 'danger';
          $rootScope.alertMsg = 'Błąd połączenia z serwerem. Spróbuj ponownie później.';
      });
    }

  $scope.search = function(){
      $scope.currentPage = 1;
      $scope.loadData($scope.query, 1);
  }

  $scope.sort = function(keyname){
		$scope.sortKey = keyname;
		$scope.reverse = !$scope.reverse;
		$scope.loadData($scope.query, 1);
}

});

mainApp.controller('VSearchController', function ($scope, $rootScope, $location, $http) {
    $rootScope.lastPage = $location.$$path;
    $rootScope.alertType = null;
    $scope.sortKey = 'no';
    $scope.reverse = false;

    $scope.pageChanged = function() {
      $scope.loadData($scope.query, $scope.currentPage);
    };

    $scope.loadData = function(q, p){
      $http.get('/api/vsearch?q=' + q + '&page=' + p + '&ordering=' + ($scope.reverse?'-':'') + $scope.sortKey)
      .then(function (response) {
          $rootScope.alertType = null;
          $scope.data = response.data.count > 0 ? response.data : null;
          $scope.count = response.data.count;
          $scope.numPages = response.data.numPages;
          $scope.pageSize = response.data.pageSize;
      }).catch(function(response) {
          $scope.data = null;
          $rootScope.alertType = 'danger';
          $rootScope.alertMsg = 'Błąd połączenia z serwerem. Spróbuj ponownie później.';
      });
    }

  $scope.search = function(){
      $scope.currentPage = 1;
      $scope.loadData($scope.query, 1);
  }

  $scope.sort = function(keyname){
		$scope.sortKey = keyname;
		$scope.reverse = !$scope.reverse;
		$scope.loadData($scope.query, 1);
}

});

mainApp.controller('DSearchController', function ($scope, $rootScope, $location, $http) {
    $rootScope.lastPage = $location.$$path;
    $rootScope.alertType = null;
    $scope.sortKey = 'no';
    $scope.reverse = false;

    $scope.pageChanged = function() {
      $scope.loadData($scope.query, $scope.currentPage);
    };

    $scope.loadData = function(q, p){
      $http.get('/api/dsearch?q=' + q + '&page=' + p + '&ordering=' + ($scope.reverse?'-':'') + $scope.sortKey)
      .then(function (response) {
          $rootScope.alertType = null;
          $scope.data = response.data.count > 0 ? response.data : null;
          $scope.count = response.data.count;
          $scope.numPages = response.data.numPages;
          $scope.pageSize = response.data.pageSize;
      }).catch(function(response) {
          $scope.data = null;
          $rootScope.alertType = 'danger';
          $rootScope.alertMsg = 'Błąd połączenia z serwerem. Spróbuj ponownie później.';
      });
    }

  $scope.search = function(){
      $scope.currentPage = 1;
      $scope.loadData($scope.query, 1);
  }

  $scope.sort = function(keyname){
		$scope.sortKey = keyname;
		$scope.reverse = !$scope.reverse;
		$scope.loadData($scope.query, 1);
}

});

mainApp.controller('CCSearchController', function ($scope, $rootScope, $location, $http) {
    $rootScope.lastPage = $location.$$path;
    $rootScope.alertType = null;
    $scope.sortKey = 'no';
    $scope.reverse = false;

    $scope.pageChanged = function() {
      $scope.loadData($scope.query, $scope.currentPage);
    };

    $scope.loadData = function(q, p){
      $http.get('/api/ccsearch?q=' + q + '&page=' + p + '&ordering=' + ($scope.reverse?'-':'') + $scope.sortKey)
      .then(function (response) {
          $rootScope.alertType = null;
          $scope.data = response.data.count > 0 ? response.data : null;
          $scope.count = response.data.count;
          $scope.numPages = response.data.numPages;
          $scope.pageSize = response.data.pageSize;
      }).catch(function(response) {
          $scope.data = null;
          $rootScope.alertType = 'danger';
          $rootScope.alertMsg = 'Błąd połączenia z serwerem. Spróbuj ponownie później.';
      });
    }

  $scope.search = function(){
      $scope.currentPage = 1;
      $scope.loadData($scope.query, 1);
  }

  $scope.sort = function(keyname){
		$scope.sortKey = keyname;
		$scope.reverse = !$scope.reverse;
		$scope.loadData($scope.query, 1);
}

});


mainApp.controller('LoginController', function($scope, $rootScope, $location, $auth) {

    $scope.login = function() {
        params = {username: $scope.username,  password: $scope.password};
        $auth.signIn(params);
	};

});

mainApp.controller('LogoutController', function($scope, $rootScope, $location, $auth) {
    $auth.signOut();
});

mainApp.factory('Vote', function($resource, $rootScope) {
  return $resource('/api/votes/:id', null, {
      'update': { method:'PUT' }
            }
  );
});

mainApp.controller('UpdateController', function ($scope, $rootScope, $routeParams, $location, Vote, CacheFactory) {
    $rootScope.lastPage = $location.$$path;
    $rootScope.alertType = null;

    $scope.vote = Vote.get({ id: $routeParams.id });

    $scope.update = function() {
        Vote.update({id: $scope.vote.id}, $scope.vote, function() {
            $rootScope.alertType = 'success';
            $rootScope.alertMsg = 'Dane zmodyfikowane poprawnie.';

            cache = CacheFactory.get('appCache');
            cache.remove('/api/communes/'+$scope.vote.circuit.commune.code);
            cache.remove('/api/districts/'+$scope.vote.circuit.commune.district.no);
            cache.remove('/api/voivodeships/'+$scope.vote.circuit.commune.district.voivodeship.no);
            cache.remove('/api/countries/Polska');
        }, function() {
            $rootScope.alertType = 'danger';
            $rootScope.alertMsg = 'Błąd połączenia z serwerem. Spróbuj ponownie później.';
        });
    };
});
