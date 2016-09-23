var btoa = require('btoa');
var rp = require('request-promise');
var netrc = require('netrc');

function userAuth(username, password) {
  var options = {
    method: 'POST',
    uri: 'http://maodou.io/user/authenticate',
    body: {
      baseAuth: btoa(username + ':' + password)
    },
    json: true // Automatically stringifies the body to JSON
  };

  var myNetrc = netrc();

  rp(options)
    .then(function(parsedBody) {

      myNetrc['git.maodou.io'] = {
        login: parsedBody.username,
        password: parsedBody.apiKey
      };
      netrc.save(myNetrc);

      console.log('Login Succeeded!'.green);
    })
    .catch(function (err) {
      console.log(err);
      console.log('Login failed.'.red)
    });
}

module.exports = function(maodou) {
  function login() {
    maodou.program.prompt('Username(email): ', function (username) {
      maodou.program.password('Password: ', function (password) {
        console.log('');
        userAuth(username, password);
        process.stdin.destroy();
      });
    });
  }

  maodou.program
    .command('login')
    .description('Login to maodou.io with your credentials.')
    .action(login);
};