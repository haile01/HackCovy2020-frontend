import React, { useState } from 'react'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button'
import { setUser } from '../../actions/userAction'
import { connect } from 'react-redux'
import { Stack, IStackStyles } from 'office-ui-fabric-react/lib/Stack';

import api from '../../utils/api'
import history from '../../utils/history'

const SignIn: React.FC = (props: any) => {

  let [form, setForm] = useState([{}, {}])
  
  const _onSubmit = async (e: any) => {
    e.preventDefault();
    let res: any = await api.signIn({ username: form[0], password: form[1] })
    if (res.signed_token) {
      console.log(res);
      localStorage.setItem('token', res.signed_token);
      api.getSession().then((res: any) => {
        if (res.success) {
          props.setUser(res.data);
          history.push('/');
        }
      })
    }
    else {
      // error
    }
  }

  const updateForm = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, type: number) => {
    if (e.target == null) return;
    let value = (e.target as HTMLTextAreaElement).value;
    form[type] = value;
    setForm(form);
  }

  const stackStyles: Partial<IStackStyles> = { root: { width: 900, margin: 'auto' } };

  return (
    <div className="signin">
      <form onSubmit={_onSubmit}>
        <Stack styles={stackStyles}>
          <TextField onChange={(e) => updateForm(e, 0)} label="Tên tài khoản" required/>
          <TextField onChange={(e) => updateForm(e, 1)} type="password" label="Mật khẩu" styles={{ root: { marginBottom: 20 } }} required/>
          <PrimaryButton text="Đăng nhập" type="submit"/>
        </Stack>
      </form>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchtoProps = dispatch => ({
  setUser: payload => dispatch(setUser(payload))
})

export default connect(mapStateToProps, mapDispatchtoProps)(SignIn);