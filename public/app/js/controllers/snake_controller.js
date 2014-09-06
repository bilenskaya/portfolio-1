controllersModule
	.controller('SnakeController', ['$scope','$rootScope', '$timeout', '$modal', function($scope,$rootScope,$timeout,$modal) {

		$rootScope.$on("$routeChangeStart", function(args, to, from){
			if(from.$$route.originalPath == '/snake')
					pause();
		});

		var snake,food,moves,playing,direction,growing,timer,state,GRIDSIZE,pauseModal;
		$scope.init = function(){
			var parent = $scope.$parent.game;
			snake = parent.snake || [[0,0]];
			food = parent.food || [];
			moves = parent.moves || ['r'];
			playing = parent.playing || true;
			direction = parent.direction || '';
			growing = parent.growing || false;
			timer = parent.timer || null;
			state = parent.state || 'play';
			GRIDSIZE = parent.GRIDSIZE || 30;	// eventually give user choices.
			$scope.score = parent.score || 0;
			
			pauseModal;

			clearGrid();		
			timer = $timeout(gameLoop, 155);
			if(state == 'paused')
				pause();
		}

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

				$rootScope.$broadcast('save-game', {
					snake: snake,
					food: food,
					moves: moves,
					playing: playing,
					direction: direction,
					growing: growing,
					timer: timer,
					state: state,
					GRIDSIZE: GRIDSIZE,
					score: $scope.score
				});
				// Save game state
				// $scope.$parent.game = {
				// 	snake: snake,
				// 	food: food,
				// 	moves: moves,
				// 	playing: playing,
				// 	direction: direction,
				// 	growing: growing,
				// 	timer: timer,
				// 	state: state,
				// 	GRIDSIZE: GRIDSIZE,
				// 	score: $scope.score
				// }
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

		
  	}]);

// modal controller
var pauseController = function($scope, $modalInstance){

}
