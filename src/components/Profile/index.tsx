
import React, { useEffect, useState } from 'react'
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Separator } from 'office-ui-fabric-react/lib/Separator';
import { Image } from 'office-ui-fabric-react/lib/Image';
import { DetailsList, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

export interface ProfileProps {
  id: string;
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

  const fakeUser: User = {
    role: "admin",
    avatar: null,
    availableTimeBlock: [
      [1,2,3,4,5,10,12,30,31],
      [1],
      [2],
      [3],
      [4],
      [5],
      [6,7,8]
    ],
    _id: "5ea30cc248136638f5d69c61",
    username: "rknguyen",
    password: "12345678",
    fullName: "Nguyen Minh Huy",
  }
  
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
      // Me
      const user = fakeUser
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
    while (index >= user.availableTimeBlock[cur].length) index -= user.availableTimeBlock[cur].length, cur++;
    user.availableTimeBlock[cur].splice(index, 1);
    setUser(user);
    forceReRender();
  }

  const _onRenderItemColumn = (item: TimeItem, index: number, column: IColumn) => {
    const fieldContent = item[column.fieldName as keyof TimeItem]
    switch (column.key) {
      case 'startTime':
        return <TextField value={fieldContent} placeholder="Nhập thời gian bắt đầu"/>;
      case 'endTime':
        return <TextField value={fieldContent} placeholder="Nhập thời gian kết thúc"/>;
      case 'delete':
        return <DefaultButton onClick={() => deleteRow(index)} text="Xoá thời gian"/>
      default:
        return <Label>{fieldContent}</Label>;
    }
  }

  console.log(groups, user);

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
          <Separator><h3>Thời gian làm việc trong tuần này</h3></Separator>
          <DetailsList
            onRenderItemColumn={_onRenderItemColumn}
            items={formatTimeBlock(user.availableTimeBlock) as TimeItem[]}
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
          <PrimaryButton text="Thay đổi thời gian làm việc"/>
        </PivotItem>
        <PivotItem headerText="Đổi mật khẩu">
          Password
        </PivotItem>
      </Pivot>
    </div>
  )
}

export default Profile;