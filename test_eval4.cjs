const math = require('mathjs');
let expr = "cbrt(x)";
const compiled = math.compile(expr);
let y = compiled.evaluate({ x: -8, e: Math.E, pi: Math.PI });
console.log("cbrt(x) for x=-8:", y);
