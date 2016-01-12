/*
Fixing scope
Currently, the only way to assign a variable a value is define. This
construct acts as a way both to define new variables and to give existing
ones a new value.
This ambiguity causes a problem. When you try to give a nonlocal
variable a new value, you will end up defining a local one with the same
name instead. (Some languages work like this by design, but I’ve always
found it a silly way to handle scope.)
Add a special form set, similar to define, which gives a variable a new
value, updating the variable in an outer scope if it doesn’t already exist in
the inner scope. If the variable is not defined at all, throw a ReferenceError
(which is another standard error type).
The technique of representing scopes as simple objects, which has made
things convenient so far, will get in your way a little at this point. You
might want to use the Object.getPrototypeOf function, which returns the
prototype of an object. Also remember that scopes do not derive from
Object.prototype, so if you want to call hasOwnProperty on them, you have
to use this clumsy expression:
O b j e c t . p r o t o t y p e . h a s O w n P r o p e r t y . call ( scope , name ) ;
This fetches the hasOwnProperty method from the Object prototype and
then calls it on a scope object.
*/

specialForms["set"] = function(args, env) {
  // TODO: 不会做
};

run("do(define(x, 4),",
    "   define(setx, fun(val, set(x, val))),",
    "   setx(50),",
    "   print(x))");
// → 50
run("set(quux, true)");


// → Some kind of ReferenceError
/* the author's solution:
specialForms["set"] = function(args, env) {
  if (args.length != 2 || args[0].type != "word")
    throw new SyntaxError("Bad use of set");
  var varName = args[0].name;
  var value = evaluate(args[1], env);

  for (var scope = env; scope; scope = Object.getPrototypeOf(scope)) {
    if (Object.prototype.hasOwnProperty.call(scope, varName)) {
      scope[varName] = value;
      return value;
    }
  }
  throw new ReferenceError("Setting undefined variable " + varName);
};

run("do(define(x, 4),",
    "   define(setx, fun(val, set(x, val))),",
    "   setx(50),",
    "   print(x))");
// → 50
run("set(quux, true)");
// → Some kind of ReferenceError
*/
