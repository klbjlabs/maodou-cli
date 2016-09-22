var fs = require('fs');

var UserConfig = function() {
  this.dir = getUserHome() + '/.maodou/';
  // console.log('this.dir ...>',this.dir);

  if(!fs.existsSync(this.dir)) {
    fs.mkdirSync(this.dir);
  }
};

UserConfig.prototype.load = function() {
  this.dir = getUserHome() + '/.maodou/';
  var configFile = this.dir + 'current-modc.json';
  if(fs.existsSync(configFile)) {
    try {
      this.data = JSON.parse(fs.readFileSync(configFile));
    } catch(e) {
      this.data = null;
    }
    return true;
  } else {
    return false;
  }
};

UserConfig.prototype.save = function(data) {
  this.dir = getUserHome() + '/.maodou/';
  // console.log('this.dir ...>',this.dir);
  var configFile = this.dir + 'current-modc.json';
  fs.writeFileSync(configFile, JSON.stringify(data));

  return true;
};

UserConfig.prototype.clearSession = function() {
  this.load();

  delete this.data.apiKey;
  delete this.data.userId;
  delete this.data.username;
  this.save(this.data);

  return true;
};

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports = UserConfig;
