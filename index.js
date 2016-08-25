function ButtonAktor (app){
  this.active=""
  this.id=""
  this.down = function(){}
  this.up = function(){}
  this.click = function(){}
  this.addEventListener=function(event,callback){
    this[event]=callback
  }
  app.on("known-data",function(data){
    if(data.senderId==this.id){
      var val = data.values[0].value
      var ba = val.split(" ")

      if(ba[0]=="released")  {
        this.up({button:this.active})
        this.click({button:this.active})
        this.active=""
        return
      }
      this.active = ba[0]
      this.down({button:this.active})
    }
  }.bind(this))
}
module.exports=ButtonAktor
