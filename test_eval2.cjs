const math = require('mathjs');
let expr = "e^x";
const compiled = math.compile(expr);
let y = compiled.evaluate({ x: 2, e: Math.E, pi: Math.PI });
console.log("e^x for x=2:", y);
