const math = require('mathjs');
let expr = "x^3";
const compiled = math.compile(expr);
let y = compiled.evaluate({ x: -2, e: Math.E, pi: Math.PI });
console.log("x^3 for x=-2:", y);
