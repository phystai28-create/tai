const math = require('mathjs');
let expr = "x^(1/3)";
const compiled = math.compile(expr);
let y = compiled.evaluate({ x: -8, e: Math.E, pi: Math.PI });
console.log("x^(1/3) for x=-8:", y);
