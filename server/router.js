const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  //app.get('/getDrawings', mid.requiresLogin, controllers.Drawing.getDrawings);
  app.get('/getDrawings', controllers.Drawing.getDrawings);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  //app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  //app.get('/make', mid.requiresLogin, controllers.Drawing.makerPage);
  //app.post('/make', mid.requiresLogin, controllers.Drawing.make);
  //app.get('/guess', mid.requiresLogin, controllers.Account.guessPage);
  app.get('/logout', controllers.Account.logout);
  app.get('/make', controllers.Drawing.makerPage);
  app.post('/make', controllers.Drawing.make);
  app.get('/guess', controllers.Account.guessPage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
