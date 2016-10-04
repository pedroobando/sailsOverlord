/*
/  Police to diferent type users.
*/

module.exports = function (req, res, ok) {
  // User is allowed, procces to controller
  if (req.session.User && req.session.User.admin) {
    return ok();
  }
  // User is not allowed
  else {
    var requireAdminError = [{name: 'requireAdminError', message: 'You mus be an admin.'}];
    req.session.flash = {
      err: requireAdminError
    }
    return res.redirect('/session/new');
  }
};
