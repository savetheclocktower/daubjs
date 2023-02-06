let emptyString = "";
let anotherEmptyString = '';

let ternary = true ? '1' : "2";

let ternary = true ? "2" : '1';

let multiLineTernary = true ?
  doSomething() :
  doSomethingElse();

var Try = {
  these: function(one, two, three, ...rest) {
    var returnValue;

    // What is this

    for (var i = 0, length = /* ahaha */ arguments.length; i < length; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) {
        /(foo(bar))/.test('aha', 13, 'boo');
        throw 'This isn\'t what I had in mind.';
      }
    }

    return returnValue;
  }
};
