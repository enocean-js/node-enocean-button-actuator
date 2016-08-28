var assert = require('chai').assert
var should = require('chai').should()
var path = require("path")
var fs = require("fs")
var en
var neba
var testConfig={timeout:30,configFilePath:path.resolve("./test/config.json"),sensorFilePath:path.resolve("./test/sensors.json")}
var Actuator = require('../')
describe('node-enocean-button-actuator', function() {
	before(function(done) {
      fs.closeSync(fs.openSync('test/sensors.json', 'w'));
      fs.closeSync(fs.openSync('test/config.json', 'w'));
      fs.writeFileSync('test/sensors.json', `{
        "002a1d4d":{
          "id": "002a1d4d",
          "eep": "f6-02-03",
          "manufacturer": "Enocean",
          "title": "lightswitch",
          "desc": "...",
          "eepFunc": "Rocker Switch, 2 Rocker",
          "eepType": "Light Control - Application Style 1"
        }
      }`)
      fs.writeFileSync('test/config.json', '{"base":"00000000"}')
    	en = require("node-enocean")(testConfig);
      neba = new Actuator(en)
      neba.id = "002a1d4d"
    	en.listen("/dev/ttyUSB0");
      en.on("ready",function(){
        done()
     })
  	});
  after(function() {
      fs.unlinkSync('test/sensors.json')
      fs.unlinkSync('test/config.json')
      en.close(function(err){})
    });
    it('should enable you to bind functions for "down", "up" and "click" events', function () {

      var f=function(data){var x=1}
      neba.down=f
      neba.up=f
      neba.click=f
      assert.equal(neba.down,f)
      assert.equal(neba.up,f)
      assert.equal(neba.click,f)
  	});
    it('on receiving an event from the bound id the registered functions should be invoked', function (done) {
      neba.id = "002a1d4d"
      var down = Buffer.from("55000707017af670002a1d4d3001ffffffff370090","hex")
      var up = Buffer.from("55000707017af600002a1d4d2001ffffffff3a0034","hex")
      var c=0
      var order=""
      var f=function(data){c++}
      var f2=function(data){
        c++
        assert.equal(c,3)
        done()
      }
      neba.down=f
      neba.up=f
      neba.click=f2
      en.receive(down)
      en.receive(up)

  	});
    it('the functions should be invoked in order (down->up->click)', function (done) {
      neba.id = "002a1d4d"
      var down = Buffer.from("55000707017af670002a1d4d3001ffffffff370090","hex")
      var up = Buffer.from("55000707017af600002a1d4d2001ffffffff3a0034","hex")
      var order=""
      var f0=function(data){order+="down";assert.equal(data.event,"down")}
      var f1=function(data){order+="up";assert.equal(data.event,"up")}
      var f2=function(data){
        order+="click"
				console.log()
				assert.equal(data.event,"click")
        assert.equal(order,"downupclick")
        done()
      }
      neba.down=f0
      neba.up=f1
      neba.click=f2
      en.receive(down)
      en.receive(up)

  	});
    it('if there was no down event before the up event the button clicked is unknown and no click event is fired', function (done) {
      neba.id = "002a1d4d"
      var up = Buffer.from("55000707017af600002a1d4d2001ffffffff3a0034","hex")
      neba.up= (data)=>{assert.equal(data.button,"unknown");}
      neba.click= (data)=>{throw "Fehler"}
      en.receive(up)
      setTimeout(function(){done()},500)
  	});

});
