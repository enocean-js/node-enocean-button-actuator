var ButtonActuator= require("../")
var enocean = require("node-enocean")();

var button = new ButtonActuator(enocean)

var timer

button.down = (data) => timer=new Date()
button.up = (data) => {if(data.button!="unknown"){timer=(new Date())-timer;console.log(`the ${data.button}-button was hold down for ${timer/1000} s`)}}



//  the rest of the code is for learning in the first receive rocker switch
enocean.on("learned",function(sensor){
  console.log("")
  console.log("Great! press it again!")
  button.id=sensor.id
})

enocean.on("ready",function(){
  enocean.startLearning()
  console.log("press a button")
})

// and to forget the sensor uppun closing
process.on("SIGINT",function(){
  enocean.forget(button.id)
  enocean.on("forgotten",function(){
    process.exit();
  })
})
enocean.listen("/dev/ttyUSB0");
