var plan = ["############################",
            "#      #    #      o      ##",
            "#                          #",
            "#          #####           #",
            "##         #   #    ##     #",
            "###           ##     #     #",
            "#           ###      #     #",
            "#   ####                   #",
            "#   ##       o             #",
            "# o  #         o       ### #",
            "#    #                     #",
            "############################"];

function Vector(x, y) {
  this.x = x;
  this.y = y;
}
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};

function Grid(width, height) {
  this.space = new Array(width * height);
  this.width = width;
  this.height = height;
}
Grid.prototype.isInside = function(vector) {
  return vector.x >= 0 && vector.x < this.width &&
       	 vector.y >= 0 && vector.y < this.height;
};
Grid.prototype.get = function(vector) {
  return this.space[vector.x + this.width * vector.y];
};
Grid.prototype.set = function(vector, value) {
  this.space[vector.x + this.width * vector.y] = value;
};

var directions = {
  "n":  new Vector( 0, -1),
  "ne": new Vector( 1, -1),
  "e":  new Vector( 1,  0),
  "se": new Vector( 1,  1),
  "s":  new Vector( 0,  1),
  "sw": new Vector(-1,  1),
  "w":  new Vector(-1,  0),
  "nw": new Vector(-1, -1)
};

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

var directionNames = "n ne e se s sw w nw".split(" ");

// function BouncingCritter() {
//   this.direction = randomElement(directionNames);
// };
//
// BouncingCritter.prototype.act = function(view) {
//   if (view.look(this.direction) != " ")
//     this.direction = view.find(" ") || "s";
//   return {type: "move", direction: this.direction};
// };

function elementFromChar(legend, ch) {
  if (ch == " ")
    return null;
  var element = new legend[ch]();
  element.originChar = ch;
  return element;
}

function World(map, legend) {
  var grid = new Grid(map[0].length, map.length);
  this.grid = grid;
  this.legend = legend;

  map.forEach(function(line, y) {
    for (var x = 0; x < line.length; x++)
      grid.set(new Vector(x, y),
               elementFromChar(legend, line[x]));
  });
}

function charFromElement(element) {
  if (element == null)
    return " ";
  else
    return element.originChar;
}

World.prototype.toString = function() {
  var output = "";
  for (var y = 0; y < this.grid.height; y++) {
    for (var x = 0; x < this.grid.width; x++) {
      var element = this.grid.get(new Vector(x, y));
      output += charFromElement(element);
    }
    output += "\n";
  }
  return output;
};

function Wall() {}

// var world = new World(plan, {"#": Wall,
//                              "o": BouncingCritter});
//   #      #    #      o      ##
//   #                          #
//   #          #####           #
//   ##         #   #    ##     #
//   ###           ##     #     #
//   #           ###      #     #
//   #   ####                   #
//   #   ##       o             #
//   # o  #         o       ### #
//   #    #                     #
//   ############################

Grid.prototype.forEach = function(f, context) {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var value = this.space[x + y * this.width];
      if (value != null)
        f.call(context, value, new Vector(x, y));
    }
  }
};

World.prototype.turn = function() {
  var acted = [];
  this.grid.forEach(function(critter, vector) {
    if (critter.act && acted.indexOf(critter) == -1) {
      acted.push(critter);
      this.letAct(critter, vector);
    }
  }, this);
};

World.prototype.letAct = function(critter, vector) {
  var action = critter.act(new View(this, vector));
  if (action && action.type == "move") {
    var dest = this.checkDestination(action, vector);
    if (dest && this.grid.get(dest) == null) {
      this.grid.set(vector, null);
      this.grid.set(dest, critter);
    }
  }
};

World.prototype.checkDestination = function(action, vector) {
  if (directions.hasOwnProperty(action.direction)) {
    var dest = vector.plus(directions[action.direction]);
    if (this.grid.isInside(dest))
      return dest;
  }
};

function View(world, vector) {
  this.world = world;
  this.vector = vector;
}
View.prototype.look = function(dir) {
  var target = this.vector.plus(directions[dir]);
  if (this.world.grid.isInside(target))
    return charFromElement(this.world.grid.get(target));
  else
    return "#";
};
View.prototype.findAll = function(ch) {
  var found = [];
  for (var dir in directions)
    if (this.look(dir) == ch)
      found.push(dir);
  return found;
};
View.prototype.find = function(ch) {
  var found = this.findAll(ch);
  if (found.length == 0)  return null;
  //随机一个能找到的所有目标位置
  return randomElement(found);
};

function dirPlus(dir, n) {
  var index = directionNames.indexOf(dir);
  return directionNames[(index + n + 8) % 8];
}

function WallFollower() {
  this.dir = "s";
}

WallFollower.prototype.act = function(view) {
  var start = this.dir;
  if (view.look(dirPlus(this.dir, -3)) != " ")
    start = this.dir = dirPlus(this.dir, -2);
  while (view.look(this.dir) != " ") {
    this.dir = dirPlus(this.dir, 1);
    if (this.dir == start) break;
  }
  return {type: "move", direction: this.dir};
};

function LifelikeWorld(map, legend) {
  World.call(this, map, legend);
}
LifelikeWorld.prototype = Object.create(World.prototype);

var actionTypes = Object.create(null);

LifelikeWorld.prototype.letAct = function(critter, vector) {
  var action = critter.act(new View(this, vector));
  var handled = action && action.type in actionTypes &&
                actionTypes[action.type].call(this, critter, vector, action);

  if (!handled) {
    critter.energy -= 0.2;
    if (critter.energy <= 0)
      this.grid.set(vector, null);
  }
};

actionTypes.grow = function(critter) {
  critter.energy += 0.5;
  return true;
};
actionTypes.move = function(critter, vector, action) {
  var dest = this.checkDestination(action, vector);
  if (dest == null ||
      critter.energy <= 1 ||
      this.grid.get(dest) != null)
    return false;
  critter.energy -= 1;
  this.grid.set(vector, null);
  this.grid.set(dest, critter);
  return true;
};
actionTypes.eat = function(critter, vector, action) {
  var dest = this.checkDestination(action, vector);
  var atDest = dest != null && this.grid.get(dest);  //TODO: 没看懂
  if (!atDest || atDest.energy == null)
    return false;
  critter.energy += atDest.energy;
  this.grid.set(dest, null);
  return true;
};
actionTypes.reproduce = function(critter, vector, action) {
  var baby = elementFromChar(this.legend, critter.originChar);
  var dest = this.checkDestination(action, vector);
  if (dest == null ||
      critter.energy <= 2 * baby.energy ||
      this.grid.get(dest) != null)
    return false;
  critter.energy -= 2 * baby.energy;
  this.grid.set(dest, baby);
  return true;
};

function Plant() {
  this.energy = 3 + Math.random() * 4;
}
Plant.prototype.act = function(view) {
  if (this.energy > 15) {
    var space = view.find(" ");
    if (space)
      return {type: "reproduce", direction: space};
  }
  if (this.energy < 20)
    return {type: "grow"};
};

function PlantEater() {
  this.energy = 20;
}
PlantEater.prototype.act = function(view) {
  var space = view.find(" ");
  if (this.energy > 60 && space)
    return {type: "reproduce", direction: space};
  var plant = view.find("*");
  if (plant)
    return {type: "eat", direction: plant};
  if (space)
    return {type: "move", direction: space};
};

function SmartPlantEater() {
  this.energy = 20;
}
SmartPlantEater.prototype.act = function(view) {
  var space = view.find(" ");
  if (this.energy > 60 && space)
    return {type: "reproduce", direction: space};
  var plant = view.find("*");
  //周围只有大于1棵Plant时才吃
  if (view.findAll("*").length > 1)
    return {type: "eat", direction: plant};
  if (space)
    return {type: "move", direction: space};
};

var valley = new LifelikeWorld(
  ["############################",
   "#####                 ######",
   "##   ***                **##",
   "#   *##**         **  O  *##",
   "#    ***     O    ##**    *#",
   "#       O         ##***    #",
   "#                 ##**     #",
   "#   O       #*             #",
   "#*          #**       O    #",
   "#***       ##**    O     **#",
   "##****    ###***        *###",
   "############################"],
             {"#": Wall,
              "O": SmartPlantEater,
              "*": Plant}
                              );


/*
阅读代码
1.整个程序包含了哪些对象？
-LifelikeWorld
-World
-Wall
-PlantEater
-View
-Vector
-Plant
-Grid
-actionTypes
2.每个对象的属性和方法是什么，都代表什么含义？
-LifelikeWorld
  -继承自World
  -letAct属性进行了重写

-World
  -grid: 属性值为Grid对象，主要以数组形式记录 width * height个World中的个体信息,
  数组中的每个元素为element元素，格式如PlantEater{energy: 20, originChar: "O"}
  -legend: 属性值为legend对象，指示不同个体符号(如#表示Wall)代表对象
  ===prototype===
  -turn: 遍历World中的个体，当个体不为空（也不重复）则通过调用letAct执行个体行为
  -letAct: 如果行为类型为move，且目标位置有效的情况下，使该个体移动到目标位置
  -toString: 打印整个World的信息
  -checkDestination:  根据移动方向判断目标位置是否有效，
                      有效则返回目标位置的Vector对象

-Wall
  -空对象，什么都不做

-PlantEater
  -energy: 初始能量为20
  ===prototype===
  -act: 存在三种行为 reproduce、eat、move，以对象格式返回{行为类型, 至目标位置方向}

-View
  -world: 为World或LifelikeWorld对象
  -vector: 为Vector对象
  ===prototype===
  -look: 返回指定方向表示的目标点符号，如# O *
  -find: 随机返回能到达目标点的一个方向，不存在返回null
  -findAll: 查找能到达目标点（用符号表示，如"*" " "）的所有方向信息

-Vector
  -x: 模拟世界的坐标x
  -y: 模拟世界的坐标y
  ===prototype===
  -plus: 坐标的相加

-Plant
  -energy: 初始值返回3~7,随机选择
  ===prototype===
  -act: 存在两种行为 reproduce、grow 以对象格式返回{行为类型, 至目标位置方向},
        其中grow行为由于不发生移动，不返回方向信息

-Grid
  -space: 长度为width * height的数组
  -width: Grid的宽
  -height: Grid的高
  ===prototype===
  -get: 返回指定坐标位置的数组值
  -set: 设置指定作为位置的数组值为指定值
  -forEach: 遍历grid中的每一个坐标的个体，如果个体不为空则执行指定的行为
  -isInside: 返回指定坐标是走在Grid表示的坐标范围内，返回是或否

-actionTypes
  -grow: Plant或PlantEater的energy属性加0.5, 返回true
  -move: 无法移动返回false，否则energy属性减1，当前坐标清空，目标位置设置为要移动的
  个体，返回true
  -eat: 目标个体如Plant如果有效则PlantEater会吃掉Plant，PlantEater的energy属性增加
  为Plant的energy值，Plant坐标位置清空，返回true，否则返回false
  -reproduce: 符合reproduce条件的个体energy属性减2*baby.energy, 目标点产生新个体
3.各个对象之间是什么关系？


*/


// the author's solution
/*
function SmartPlantEater() {
  this.energy = 30;
  this.direction = "e";
}
SmartPlantEater.prototype.act = function(view) {
  var space = view.find(" ");
  if (this.energy > 90 && space)
    return {type: "reproduce", direction: space};
  var plants = view.findAll("*");
  if (plants.length > 1)
    return {type: "eat", direction: randomElement(plants)};
  if (view.look(this.direction) != " " && space)
    this.direction = space;
  return {type: "move", direction: this.direction};
};
*/
