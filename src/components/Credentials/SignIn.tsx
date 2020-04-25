import React, { useState } from 'react'
import { TextField } from 'office-ui-fabric-react/lib/TextField'

import api from '../../utils/api'

const SignIn: React.FC = () => {

  let [form, setForm] = useState([{}, {}])
  
  const signIn = async (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    let res: any = await api.signIn({ username: form[0], password: form[1] })
    if (res.success) {
      // success
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

  return (
    <div className="signin">
      <form>
        <TextField onChange={(e) => updateForm(e, 0)} label="Tên tài khoản" required/>
        <TextField onChange={(e) => updateForm(e, 1)} type="password" label="Mật khẩu" required/>
      </form>
    </div>
  )
}

export default SignIn