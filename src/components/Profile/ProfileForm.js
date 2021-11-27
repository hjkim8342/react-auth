import { useContext, useRef } from 'react';
import { useHistory } from 'react-router';

import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const history = useHistory();
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const submitHandler = (e) => {
    e.preventDefault();
    const enteredNewPassword = newPasswordInputRef.current.value;
    fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyD15pkQYSPvP4hWvxrSk-HVk6AkLwa0q_8',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnSecureToken: false,
        }),
      }
    ).then(res => {
      history.replace('/');
    });
  };
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength='7' ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;