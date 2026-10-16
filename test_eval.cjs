const math = require('mathjs');
let expr = "2^x";
const compiled = math.compile(expr);
let y = compiled.evaluate({ x: 2, e: Math.E, pi: Math.PI });
console.log("2^x for x=2:", y);
