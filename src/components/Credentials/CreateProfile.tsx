import React, { useState, useEffect } from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { Separator } from 'office-ui-fabric-react/lib/Separator'
import api from '../../utils/api';

const CreateProfile: React.FC = () => {

  let [form, setForm] = useState([] as any);
  let [error, setError] = useState("");

  const _onChange = (value: any, type: number) => {
    form[type] = value;
    setForm(form);
  }

  const checkMatch = () => {
    setError(form[2] === form[3] ? "" : "Mật khẩu không trùng khớp")
  }

  const _onSubmit = () => {
    const body = {
      name: form[0],
      gender: form[1],
      dob: form[2].getDate() + '/' + form[2].getMonth() + '/' + form[3].getFullYear,
      address: form[3],
      phoneNumber: form[4],
      passportNumber: form[5],
      healthCareId: form[6]
    }
  }
  
  return (
    <div className="booking">
      <form>
        <Separator><h3>Thông tin cá nhân</h3></Separator>
        <TextField onChange={(e, value) => _onChange(value, 0)} label="Tên" required/>
        <TextField onChange={(e, value) => _onChange(value, 1)} label="Tài khoản" required/>
        <TextField onChange={(e, value) => _onChange(value, 2)} type="pasword" onBlur={checkMatch} label="Mật khẩu" required/>
        <TextField onChange={(e, value) => _onChange(value, 3)} type="pasword" onBlur={checkMatch} label="Nhập lại mật khẩu" errorMessage={error} required/>
      </form>
    </div>
  )
}

export default CreateProfile;