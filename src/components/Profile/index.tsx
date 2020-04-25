import React, { useEffect, useState } from 'react'
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Separator } from 'office-ui-fabric-react/lib/Separator';
import { Image } from 'office-ui-fabric-react/lib/Image';
import { DetailsList, IColumn, IDetailsHeaderProps, DetailsHeader } from 'office-ui-fabric-react/lib/DetailsList';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { IRenderFunction } from '@uifabric/utilities/lib/IRenderFunction';
import { connect } from 'react-redux';
import api from '../../utils/api';

export interface ProfileProps {
  id: string;
  user: any;
};
export interface User {
  role: string;
  avatar: any,
  availableTimeBlock: any[],
  _id: string,
  username: string,
  password: string,
  fullName: string,
}
export interface TimeItem {
  key: string,
  name: string,
  startTime: string,
  endTime: string,
} 

const Profile: React.FC <ProfileProps> = (props: ProfileProps) => {
  
  const initialGroups = [
    { key: 'sun', name: 'Chủ nhật', startIndex: 0, count: 0, level: 0 },
    { key: 'mon', name: 'Thứ hai', startIndex: 0, count: 0, level: 0 },
    { key: 'tue', name: 'Thứ ba', startIndex: 0, count: 0, level: 0 },
    { key: 'wed', name: 'Thứ tư', startIndex: 0, count: 0, level: 0 },
    { key: 'thu', name: 'Thứ năm', startIndex: 0, count: 0, level: 0 },
    { key: 'fri', name: 'Thứ sáu', startIndex: 0, count: 0, level: 0 },
    { key: 'sat', name: 'Thứ bảy', startIndex: 0, count: 0, level: 0 },
  ]
  
  let [rand, setRand] = useState(0);
  let [user, setUser] = useState({
    role: '',
    avatar: null,
    availableTimeBlock: [],
    _id: "",
    username: "",
    password: "",
    fullName: ""
  } as User);

  const forceReRender = () => setRand(Math.round(Math.random() * 1000000000));

  const groups = initialGroups;
  let curInd = 0;
  if (user.availableTimeBlock) 
    user.availableTimeBlock.forEach((day: any, index: number) => {
      groups[index].startIndex = curInd;
      groups[index].count = day.length;
      curInd += day.length;
    })

  const formatTimeBlock = (timeBlocks: any): TimeItem[] => {
    let firstDayOfWeek = new Date(),
        diff = firstDayOfWeek.getDate() - firstDayOfWeek.getDay();
    firstDayOfWeek.setDate(diff);
    firstDayOfWeek.setHours(0, 0, 0, 0);

    timeBlocks = timeBlocks.map((day: any[], index: number) => {
      const curDay = new Date(firstDayOfWeek.getTime() + 86400000 * index);
      day = day.map((i: number, index: number) => {
        const res = {
          key: index,
          name: 'Ca thứ ' + (index + 1),
          startTime: (new Date(curDay.getTime() + 15 * 60000 * i)).toTimeString().slice(0, 8),
          endTime: (new Date(curDay.getTime() + 15 * 60000 * (i + 1))).toTimeString().slice(0, 8),
        }
        return res;
      })
      return day;
    })

    return timeBlocks.flat();
  }

  useEffect(() => {
    if (props.id) {
      // Admin only
    }
    else {
      const user = props.user;
      setUser(user);
    }
  }, [user._id])

  const _columns = [ 
    { key: 'time', name: 'Thời gian', fieldName: 'time', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'startTime', name: 'Bắt đầu', fieldName: 'startTime', minWidth: 200, maxWidth: 300 },
    { key: 'endTime', name: 'Kết thúc', fieldName: 'endTime', minWidth: 200, maxWidth: 300 },
    { key: 'delete', name: '', fieldName: 'delete', minWidth: 200, maxWidth: 300 },
  ]

  const deleteRow = (index) => {
    let cur = 0;
    while (index >= user.availableTimeBlock[cur].length) {
      index -= user.availableTimeBlock[cur].length;
      cur++;
    }
    user.availableTimeBlock[cur].splice(index, 1);
    setUser(user);
    forceReRender();
  }

  const addRow = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.log(event);
  }

  const chooseTime = (index) => {
    return (event, target, value) => {
      let cur = 0;
      while (index >= user.availableTimeBlock[cur].length) {
        index -= user.availableTimeBlock[cur].length;
        cur++;
      }
      user.availableTimeBlock[cur][index] = value;
      setUser(user);
      forceReRender();
    }
    
  }

  let startTimeGroups = [], endTimeGroups = [];
  let curTime = 0;
  for (var i = 0; i < 96; i++) {
    let start = (new Date(curTime)).toISOString().slice(11, 19),
        end = (new Date(curTime + 15 * 60000)).toISOString().slice(11, 19);
    startTimeGroups.push({
      key: i,
      text: start,
      value: i,
    })
    endTimeGroups.push({
      key: i,
      text: end,
      value: i,
    })
    curTime += 15 * 60000;
  }

  const _onRenderItemColumn = (item: number, index: number, column: IColumn) => {
    switch (column.key) {
      case 'startTime':
        return <Dropdown onChange={chooseTime(index)} selectedKey={item} options={startTimeGroups} placeholder="Nhập thời gian bắt đầu"/>;
      case 'endTime':
        return <Dropdown onChange={chooseTime(index)} selectedKey={item} options={endTimeGroups} placeholder="Nhập thời gian kết thúc"/>;
      case 'delete':
        return <DefaultButton onClick={() => deleteRow(index)} text="Xoá thời gian"/>
      default:
        return <Label>{`Ca thứ ${index}`}</Label>;
    }
  }

  const _onRenderDetailsHeader = (props: IDetailsHeaderProps, _defaultRender?: IRenderFunction<IDetailsHeaderProps>) => {
    return (
      <>
        <DetailsHeader {...props}/>
        <DefaultButton onClick={addRow} text="Thêm ca làm việc"/>
      </>
    )
  }

  const changeTime = () => {
    user.availableTimeBlock.forEach(day => day.sort((a, b) => a - b));
    api.updateUser(user).then((res: any) => {
      if (res.success) {
        // success
      }
      else {
        // error
      }
    })
  }

  let [form, setForm] = useState([]);

  const _onChange = (value: any, type: number) => {
    if (value.hasOwnProperty('value')) value = value.value
    form[type] = value;
    setForm(form);
    forceReRender();
  }

  let [error, setError] = useState("");

  const checkMatch = () => {
    setError(form[1] === form[2] ? "" : "Mật khẩu không trùng khớp");
  }

  const changePassword = () => {
    api.changePassword(form[1]).then((res: any) => {
      if (res.success) {
        // success
      }
      else {
        // error
      }
    })
  }

  return (
    <div className="profile">
      <Pivot>
        <PivotItem headerText="Thông tin">
          <Separator><h3>Thông tin cá nhân</h3></Separator>
          <Label>{user.fullName}</Label>
          <Label>{user.role}</Label>
          <Image src={user.avatar || ""}/>
        </PivotItem>
        <PivotItem headerText="Thời gian làm việc">
          <form onSubmit={changeTime}>
            <Separator><h3>Thời gian làm việc trong tuần này</h3></Separator>
            <DetailsList
              onRenderDetailsHeader={_onRenderDetailsHeader}
              onRenderItemColumn={_onRenderItemColumn}
              items={user.availableTimeBlock.flat()}
              groups={groups}
              columns={_columns}
              ariaLabelForSelectAllCheckbox="Toggle selection for all items"
              ariaLabelForSelectionColumn="Toggle selection"
              checkButtonAriaLabel="Row checkbox"
              groupProps={{
                showEmptyGroups: true,
              }}
              compact={true}
              checkboxVisibility={2}
            />
            <PrimaryButton type="submit" text="Thay đổi thời gian làm việc"/>
          </form>
        </PivotItem>
        <PivotItem headerText="Đổi mật khẩu">
          <form onSubmit={changePassword}>
            <Separator><h3>Đổi mật khẩu</h3></Separator>
            <TextField type="password" onChange={(e, value) => _onChange(value, 0)} value={form[0]} label="Nhập mật khẩu cũ"/>
            <TextField type="password" onChange={(e, value) => _onChange(value, 1)} onBlur={checkMatch} value={form[1]} label="Nhập mật khẩu mới"/>
            <TextField type="password" onChange={(e, value) => _onChange(value, 2)} onBlur={checkMatch} errorMessage={error} value={form[2]} label="Nhập lại mật khẩu mới"/>
            <PrimaryButton type="submit" text="Thay đổi mật khẩu"/>
          </form>
        </PivotItem>
      </Pivot>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps, null)(Profile);