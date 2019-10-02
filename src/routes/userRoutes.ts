import express from 'express';
const router = express.Router();
import renderer from '../renderers/renderer';
import userHelper from '../helpers/userHelper';

router.get('/user.*', (req: any, res: any) => {

  const user = userHelper.findUser(req.session.username);
  if (user.admin !== 1) {
    renderer.error(res, req.session.username);
    return;
  }

  if (req.query.userid) {
    const id = parseInt(req.query.userid, 10);
    console.log('Edit user with id', id);
    renderer.user(res, req.session.username, userHelper.findUserById(id));
    return;
  }
});

router.post('/user', (req: any, res: any) => {

  if (req.body.cancel) {
    renderer.users(res, req.session.username, userHelper.getAllUsers());
    return;
  }
  if (req.body.save) {
    const id = parseInt(req.body.userid, 10);
    const role = req.body.role;
    const adminValue = role === 'admin' ? 1 : 0;
    console.log('Update user with id', id);
    console.log(userHelper.findUserById(id));
    const users = userHelper.getAllUsers();
    for (const u of users) {
      if (u.id === id) {
        u.admin = adminValue;
      }
    }
    userHelper.saveContents(users);
    renderer.user(res, req.session.username, userHelper.findUserById(id), undefined, 'User updated successfully');
    return;
  }
});

  //
router.get('/users*', (req: any, res: any) => {
  const user = userHelper.findUser(req.session.username);
  if (user.admin === 1) {
    renderer.users(res, req.session.username, userHelper.getAllUsers());
  } else {
    renderer.error(res, req.session.username);
  }
  });

router.post('/users', (req: any, res: any) => {

    const users = userHelper.getAllUsers();
    const usernameToDelete = req.body.deleteUser;
    console.log('Delete user(s) with id: ', usernameToDelete );

    if (usernameToDelete) {
      if (usernameToDelete === req.session.username) {
        renderer.users(res, req.session.username, 'Error occured while deleting user.');
        return;
      }
      console.log('Multi delete.', usernameToDelete);
      userHelper.removeUser(usernameToDelete);

      renderer.users(res, req.session.username, userHelper.getAllUsers(), undefined, 'User successfully removed');
    } else {
      renderer.users(res, req.session.username, userHelper.getAllUsers(), 'You must select a user to delete.');

    }

  });

export {router as userRoutes};
