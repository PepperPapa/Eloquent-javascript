/*
Closure
The way we have defined fun allows functions in Egg to “close over”
the surrounding environment, allowing the function’s body to use local
values that were visible at the time the function was defined, just like
JavaScript functions do.
The following program illustrates this: function f returns a function
that adds its argument to f’s argument, meaning that it needs access to
the local scope inside f to be able to use variable a.
run (" do ( d e f i n e (f , fun (a , fun (b , +( a , b ) ) ) ) ," ,
" print ( f (4) (5) ) ) ") ;
// ! 9
Go back to the definition of the fun form and explain which mechanism
causes this to work.
*/
/*
A programming language: Egg
*/

function parseExpression(program) {
  program = skipSpace(program);
  var match, expr;
  if (match = /^"([^"]*)"/.exec(program)) {
    expr = {type: "value", value: match[1]};
  } else if (match = /^\d+\b/.exec(program)) {
    expr = {type: "value", value: Number(match[0])};
  } else if (match = /^[^\s(),"]+/.exec(program)) {
    expr = {type: "word", name: match[0]};
  } else {
    throw new SyntaxError("Unexpected syntax: " + progaram);
  }
  return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(string) {
  var first = string.search(/\S/);
  if (first == -1) return "";
  return string.slice(first);
}

function parseApply(expr, program) {
  program = skipSpace(program);
  if (program[0] != "(") {
    return {expr: expr, rest: program};
  }

  program = skipSpace(program.slice(1));
  expr = {type: "apply", operator: expr, args: []};
  while (program[0] != ")") {
    var arg = parseExpression(program);
    expr.args.push(arg.expr);
    program = skipSpace(arg.rest);
    if (program[0] == ",") {
      program = skipSpace(program.slice(1));
    } else if (program[0] != ")") {
      throw new SyntaxError("Expected ',' ' or ')'");
    }
  }
  return parseApply(expr, program.slice(1));
}

function parse(program) {
  var result = parseExpression(program);
  if (skipSpace(result.rest).length > 0) {
    throw new SyntaxError("Unexpected text after program");
  }
  return result.expr;
}

function evaluate(expr, env) {
  switch (expr.type) {
    case "value":
      return expr.value;
    case "word":
      if (expr.name in env) {
        return env[expr.name];
      } else {
        throw new ReferenceError("Undefined variable: " + expr.name);
      }
    case "apply":
      if (expr.operator.type == "word" &&
          expr.operator.name in specialForms) {
        return specialForms[expr.operator.name](expr.args, env);
      }
      var op = evaluate(expr.operator, env);
      if (typeof op != "function") {
        throw new TypeError("Applying a non-function.");
      }
      return op.apply(null, expr.args.map(function(arg) {
        return evaluate(arg, env);
      }));
  }
}

var specialForms = Object.create(null);

specialForms["if"] = function(args, env) {
  if (args.length != 3) {
    throw new SyntaxError("Bad number of args to if");
  }

  if (evaluate(args[0], env) !== false) {
    return evaluate(args[1], env);
  } else {
    return evaluate(args[2], env);
  }
};

specialForms["while"] = function(args, env) {
  if (args.length != 2) {
    throw new SyntaxError("Bad number of args to while");
  }

  while (evaluate(args[0], env) !== false) {
    evaluate(args[1], env);
  }

  // Since undeined does not exist in Egg, we return false,
  // for lack of a meaningful result.
  return false;
};

specialForms["do"] = function(args, env) {
  var value = false;
  args.forEach(function(arg) {
    value = evaluate(arg, env);
  });
  return value;
};

specialForms["define"] = function(args, env) {
  if (args.length != 2 || args[0].type != "word") {
    throw new SyntaxError("Bad use of define");
  }
  var value = evaluate(args[1], env);
  env[args[0].name] = value;
  return value;
};

specialForms["fun"] = function(args, env) {
  if (!args.length) {
    throw new SyntaxError("Functions need a body");
  }
  function name(expr) {
    if (expr.type != "word") {
      throw new SyntaxError("Arg names must be words");
    }
    return expr.name;
  }
  var argNames = args.slice(0, args.length - 1).map(name);
  var body = args[args.length - 1];

  return function() {
    if (arguments.length != argNames.length) {
      throw new TypeError("Wrong number of arguments");
    }
    var localEnv = Object.create(env);
    for (var i = 0; i < arguments.length; i++) {
      localEnv[argNames[i]] = arguments[i];
    }
    return evaluate(body, localEnv);
  };
};

var topEnv = Object.create(null);

topEnv["true"] = true;
topEnv["false"] = false;

["+", "-", "*", "/", "==", "<", ">"].forEach(function(op) {
  topEnv[op] = new Function("a, b", "return a " + op + " b;");
});

topEnv["print"] = function(value) {
  console.log(value);
  return value;
};

function run() {
  var env = Object.create(topEnv);
  var program = Array.prototype.slice.call(arguments, 0).join("\n");
  return evaluate(parse(program), env);
}

run("do(define(f, fun(a, fun(b, +(a, b)))),",
    "   print(f(4)(5)))");
// -> 9

// debugging info
/* toDo:
看下句代码，localEnv会继承原型链env的属性，因为该例中变量a实际上存在于原型链中，
因此在+(a, b)操作中可以查到变量a的值。
var localEnv = Object.create(env);
TODO：那为什么函数执行完毕后，局部变量会被释放？
应该是因为下面的return值实际就是一个函数，localEnv会在函数执行完毕后释放，这是原生
javascript的特性
return function() {
  if (arguments.length != argNames.length) {
    throw new TypeError("Wrong number of arguments");
  }
  var localEnv = Object.create(env);
  for (var i = 0; i < arguments.length; i++) {
    localEnv[argNames[i]] = arguments[i];
  }
  return evaluate(body, localEnv);
};
*/
argNames>> ["a"]
body>> {
type:	"apply"
operator:	{type: "word", name: "fun"}
args:	[
  {type: "word", name: "b"},
  {
    type:	"apply"
    operator:	{type: "word", name: "+"}
    args:	[
      {type: "word", name: "a"},
      {type: "word", name:	"b"}
    ]
  }
  ]
}
localEnv>> {a: 4}

argNames>> ["b"]
body>> {
type:	"apply"
operator:	{type: "word", name: "+"}
args:	[
  {type: "word", name: "a"},
  {type:	"word",name:	"b"}
  ]
}
localEnv>> {b: 5}
