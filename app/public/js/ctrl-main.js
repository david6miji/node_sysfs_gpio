(function(){
'use strict';

angular.module('hipoApp')

.controller('mainCtrl', 
function( $scope, $http ) {
	console.log( 'CALL mainCtrl' );

	$scope.forward_time  = 100;
	$scope.forward_count = 10;
	$scope.backward_time  = 100;
	$scope.backward_count = 10;

	$scope.goStop = function() {
		console.log( "Stop" );
		
		$http({
			url: "/control/stop", 
			method: "GET",
		}).	success( function(data){
			console.log( "CALL API /control/stop" );
		});
	}
	
	$scope.goForward = function() {
		console.log( "Forward" );
		$http({
			url: "/control/forward", 
			method: "GET",
			params: { time: $scope.forward_time , count : $scope.forward_count }
		}).	success( function(data){
			console.log( "CALL API /control/forward" );
		});
	}
	
	$scope.goBackward = function() {
		console.log( "Backward" );
		$http({
			url: "/control/backward", 
			method: "GET",
			params: { time: $scope.backward_time , count : $scope.backward_count }
		}).	success( function(data){
			console.log( "CALL API /control/backward" );
		});

	}

})

;

})();

