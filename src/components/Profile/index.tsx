import React, { useEffect, useState } from 'react'
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Separator } from 'office-ui-fabric-react/lib/Separator';
import { Image } from 'office-ui-fabric-react/lib/Image';
import { DetailsList } from 'office-ui-fabric-react/lib/DetailsList';

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

const Profile: React.FC <ProfileProps> = (props: ProfileProps) => {
  console.log(props.id);
  
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
    availableTimeBlock: [],
    _id: "5ea30cc248136638f5d69c61",
    username: "rknguyen",
    password: "12345678",
    fullName: "Nguyen Minh Huy",
  }
  
  let [user, setUser] = useState({} as User);
  let [groups, setGroups] = useState(initialGroups);

  const formatTimeBlock = (timeBlocks: any) => {
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

    let curInd = 0;
    timeBlocks.forEach((day: any, index: number) => {
      groups[index].startIndex = curInd;
      groups[index].count = day.length;
      curInd += day.length;
    })

    setGroups(groups);
    console.log('func', timeBlocks.flat());
    return timeBlocks.flat();
  }

  useEffect(() => {
    if (props.id === "") {
      // Me
      setUser({...fakeUser, availableTimeBlock: formatTimeBlock(fakeUser.availableTimeBlock)});
    }
    else {
      // Admin only
    }
  })

  const _columns = [
    { key: 'time', name: 'Thời gian', fieldName: 'time', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'startTime', name: 'Bắt đầu', fieldName: 'startTime', minWidth: 200, maxWidth: 300 },
    { key: 'endTime', name: 'Kết thúc', fieldName: 'endTime', minWidth: 200, maxWidth: 300 },
  ]

  console.log(user.availableTimeBlock);

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
            items={user.availableTimeBlock}
            groups={groups}
            columns={_columns}
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            ariaLabelForSelectionColumn="Toggle selection"
            checkButtonAriaLabel="Row checkbox"
            groupProps={{
              showEmptyGroups: true,
            }}
            compact={true}
          />
        </PivotItem>
        <PivotItem headerText="Đổi mật khẩu">
          Password
        </PivotItem>
      </Pivot>
    </div>
  )
}

export default Profile;