function ButtonActuator (app){
  this.app=app
  this.active="unknown"
  this.id=""
  this.down = function(){}
  this.up = function(){}
  this.click = function(){}
  this.removeListener=function(){
    this.app.removeListener("known-data",this.action)
  }.bind(this)
  this.action = function(data){
    if(data.senderId==this.id){
      var val = data.values[0].value
      var ba = val.split(" ")
      if(ba[0]=="released")  {
        this.up({button:this.active,event:"up"})
        if(this.active!="unknown") this.click({button:this.active,event:"click"})
        this.active="unknown"
      }else{
        this.active = ba[0]
        this.down({button:this.active,event:"down"})
      }
    }
  }.bind(this)
  app.on("known-data",this.action)
}
module.exports=ButtonActuator
