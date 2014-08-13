controllersModule
	.controller('SnakeController', ['$scope','$rootScope', function($scope,$rootScope) {
		var snake = [];
		var playing = true;
		var direction = 'r';
		snake.push([0,0]); // initial snake
		var growing = false;

		$rootScope.$on('keypress', function(obj, key){
			switch(key.which) {
		        case 37: // left
		        direction = 'l';
		        break;

		        case 38: // up
		        direction = 'u';
		        break;

		        case 39: // right
		        direction = 'r';
		        break;

		        case 40: // down
		        direction = 'd';
		        break;

		        case 32: // spacebar
		        growing = true;
		        break;

		        default: return;
		    }
		});

		var clearGrid = function(){
			// Build the gameboard
			$scope.grid = [];
			var temp = [];
			var count = 0;

			for (var i = 0; i < 30; i++) {
				for (var j = 0; j < 30; j++) {
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
			for (var i = 0; i < snake.length; i++) {
				if(i == 0){
					prev = [snake[i][0],snake[i][1]];
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
				}
			};

			paint();
		}

		var paint = function(){
			// need to redraw/clear previous snake
			clearGrid();
			for(piece in snake){
				$scope.$apply(function(){
					$scope.grid[snake[piece][0]].blocks[snake[piece][1]].type = 'snake';					
				})
			}
		}

		$scope.stopGame = function(){
			clearInterval(ticker);
			// clearGrid();
		}

		$scope.keypress = function(){
			console.log('keypressed');
		}

		clearGrid();
		var ticker = setInterval(gameLoop, 400);
  	}]);