var ButtonAktor= require("../")
var enocean = require("node-enocean")();

const exec = require('child_process').exec;
var proc
var button = new ButtonAktor(enocean)
button.id="002a1d4d"

button.addEventListener("down",function(data){
  proc = exec("gnome-calculator",function(err,stdin,stdout){console.log(err,stdin,stdout)})
  //proc.on("error",function(err){console.log(err)})
  proc.on("exit",function(ret){console.log(ret)})
})
button.addEventListener("up",function(data){
  proc.kill()
})
button.addEventListener("click",function(data){
  console.log("fun stuff")
})

enocean.listen("/dev/ttyUSB0");
// enocean.on("ready",function(){
//   enocean.learn({
//           id:"002a1d4d",
//           eep: "f6-02-03",
//           desc:"Switch",
//           manufacturer:"Enocean GmbH"
//       })
// })
