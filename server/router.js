const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getDrawings', mid.requiresLogin, controllers.Drawing.getDrawings);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/game', mid.requiresLogin, controllers.Drawing.makerPage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/getScore', mid.requiresLogin, controllers.Account.getCurrentUserScore);
  app.get('/getScores', mid.requiresLogin, controllers.Account.getAllUserScores);

  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/make', mid.requiresLogin, controllers.Drawing.make);
  app.post('/changePass', mid.requiresSecure, mid.requiresLogout, controllers.Account.updatePassword);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/updateScore', mid.requiresLogin, controllers.Account.updateUserScore);
};

module.exports = router;
