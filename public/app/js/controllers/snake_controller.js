controllersModule
	.controller('SnakeController', ['$scope','$rootScope', '$timeout', '$modal', function($scope,$rootScope,$timeout,$modal) {
		var snake = [];
		var food = [];
		var moves = ['r'];
		var playing = true;
		var direction;
		snake.push([0,0]); // snake starts at 0,0 now, might want to randomize
		var growing = false;
		var timer;
		var state = 'play';
		var GRIDSIZE = 30;	// eventually give user choices.
		$scope.score = 0;
		var pauseModal;

		$rootScope.$on('keypress', function(obj, key){
			if(state == 'play' || key.which == 32){
				switch(key.which) {
			        case 37: // left
			        if(moves[moves.length - 1] != 'l')
					    (moves[moves.length - 1] == 'r' || (moves.length == 0 && direction == 'r')) && snake.length > 1 ? moves.push('r') : moves.push('l');		        
			        break;

			        case 38: // up
			        if(moves[moves.length - 1] != 'u')
	   		        	(moves[moves.length - 1] == 'd' || (moves.length == 0 && direction == 'd')) && snake.length > 1 ? moves.push('d') : moves.push('u');
			        break;

			        case 39: // right
			        if(moves[moves.length - 1] != 'r')
			        	(moves[moves.length - 1] == 'l' || (moves.length == 0 && direction == 'l')) && snake.length > 1 ? moves.push('l') : moves.push('r');
			        break;

			        case 40: // down
			        if(moves[moves.length - 1] != 'd')
			        	(moves[moves.length - 1] == 'u' || (moves.length == 0 && direction == 'u')) && snake.length > 1 ? moves.push('u') : moves.push('d');
			        break;

			        case 32: // spacebar
			        // growing = true;
			        pause();
			        break;

			        default: return;
			    }
			}
		});

		var pause = function(){
			if(state == 'paused'){
				pauseModal.dismiss();
			}else{
				pauseModal = $modal.open({
					templateUrl: 'pause.html',
					size: 'sm'
				}, function(){
					console.log('open')
				});
				$timeout.cancel(timer);
				state = 'paused';
				pauseModal.result.then(function(){}, 
					function(){
						// Resume game 
						timer = $timeout(gameLoop, 155);
						state = 'play';
					});	
			}			
		}

		var clearGrid = function(){
			// Build the gameboard
			$scope.grid = [];
			var temp = [];
			var count = 0;

			for (var i = 0; i < GRIDSIZE; i++) {
				for (var j = 0; j < GRIDSIZE; j++) {
					temp.push({
						id: count,
						type: 'empty'
					});
					count++;
				};
				$scope.grid.push({
					id: i,
					blocks: temp
				});
				temp = [];
			};
		}

		// Start the game loop
		var gameLoop = function(){
			var prev;
			var temp;
			var dir = moves.shift();
			if(dir != undefined)
				direction = dir;

			for (var i = 0; i < snake.length; i++) {
				if(i == 0){
					prev = [snake[i][0],snake[i][1]];
					if(prev[0] == food[0] && prev[1] == food[1]){ //check for an eat
						growing = true;
						$scope.score ++;
					}

					switch(direction){
						case "r":
							snake[i][1]++;
							break;
						case "d":
							snake[i][0]++;
							break;
						case "l":
							snake[i][1]--;
							break;
						case "u":
							snake[i][0]--;
							break;
						default:
							break;
					}
				}else{
					temp = [snake[i][0],snake[i][1]];
					snake[i] = prev;
					prev = temp;
				}
				if(growing && i == (snake.length - 1)){
					snake.push(prev);
					growing = false;					
					food = [];
				}
			};

			paint();

		}

		var checkCollisions = function(){
			// did they win?
			top:
			for (var i = 0; i < GRIDSIZE; i++) {
				for (var j = 0; j < GRIDSIZE; j++) {
					if($scope.grid[i].blocks[j].type == 'empty')
						break top; // we know they didnt win yet
				};
			};
		}

		var paint = function(){
			if($scope.grid[snake[0][0]] == undefined || $scope.grid[snake[0][0]].blocks[snake[0][1]] == undefined || snake.length > 2 && $scope.grid[snake[0][0]].blocks[snake[0][1]].type == 'snake'){
				// out-of-bounds / intersection
				$scope.stopGame('lost');
			}else{
				clearGrid();
				if(food.length == 0){
					var x = Math.floor(Math.random()*28) + 1;
					var y = Math.floor(Math.random()*23) + 1;
					if($scope.grid[x].blocks[y].type != 'snake')
						food = [x,y];
				}

				for(piece in snake){				
					$scope.grid[snake[piece][0]].blocks[snake[piece][1]].type = 'snake';
				}
				
				$scope.grid[food[0]].blocks[food[1]].type = 'food';
				// checkCollisions();
				timer = $timeout(gameLoop, 155);
			}
			
		}

		$scope.stopGame = function(reason){
			$timeout.cancel(timer);
			state = 'stop';
		}

		clearGrid();		
		timer = $timeout(gameLoop, 155);
  	}]);

// modal controller
var pauseController = function($scope, $modalInstance){

}
