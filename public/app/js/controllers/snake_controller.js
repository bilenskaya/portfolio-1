controllersModule
	.controller('SnakeController', ['$scope','$rootScope', '$timeout', function($scope,$rootScope,$timeout) {
		var snake = [];
		var food = [];
		var playing = true;
		var direction = 'r';
		snake.push([0,0]); // initial snake
		var growing = false;
		var timer;

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
					if(prev[0] == food[0] && prev[1] == food[1]) //check for an eat
						growing = true;

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
			for (var i = 0; i < 30; i++) {
				for (var j = 0; j < 30; j++) {
					if($scope.grid[i].blocks[j].type == 'empty')
						break top; // we know they didnt win yet
				};
			};

			// did they lose?
			var o = 0;
			for(block in snake){
				for (var i = 0; i < snake.length; i++) {
					if(snake[block][0] == snake[i][0] && snake[block][1] == snake[i][1])
						o++;
				};
			}
			if(o > 1)
				$scope.stopGame('lose'); //snake/snake intersection

			o = 0;
		}

		var paint = function(){
			clearGrid();
			if(food.length == 0){
				var x = Math.floor(Math.random()*28) + 1;
				var y = Math.floor(Math.random()*23) + 1;
				if($scope.grid[x].blocks[y].type != 'snake')
					food = [x,y];
			}
			
			for(piece in snake){
				// $scope.$apply(function(){
					$scope.grid[snake[piece][0]].blocks[snake[piece][1]].type = 'snake';					
				// })
			}

			// draw food
			// $scope.$apply(function(){
				$scope.grid[food[0]].blocks[food[1]].type = 'food';
			// });

			// checkCollisions();
			timer = $timeout(gameLoop, 200);
		}

		$scope.stopGame = function(reason){
			// clearInterval(ticker);
			// clearGrid();
			$timeout.cancel(timer);
		}

		clearGrid();
		
		// timer = $timeout(gameLoop, 200);
  	}]);