function ButtonActuator (app){
  this.active="unknown"
  this.id=""
  this.down = function(){}
  this.up = function(){}
  this.click = function(){}
  app.on("known-data",function(data){
    if(data.senderId==this.id){
      var val = data.values[0].value
      var ba = val.split(" ")
      if(ba[0]=="released")  {
        this.up({button:this.active,event:"down"})
        if(this.active!="unknown") this.click({button:this.active,event:"click"})
        this.active="unknown"
        return
      }
      this.active = ba[0]
      this.down({button:this.active,event:"up"})
    }
  }.bind(this))
}
module.exports=ButtonActuator
