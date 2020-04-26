import React, { useEffect, useState } from 'react'
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Separator } from 'office-ui-fabric-react/lib/Separator';
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn
} from "office-ui-fabric-react/lib/DetailsList";
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { connect } from 'react-redux';
import { Stack, IStackStyles, IStackProps } from 'office-ui-fabric-react/lib/Stack';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { omit } from 'lodash'
import { ZoomMtg } from "@zoomus/websdk";

import { setUser } from '../../actions/userAction'
import api from '../../utils/api';

ZoomMtg.setZoomJSLib("https://source.zoom.us/1.7.6/lib", "/av");
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

const API_KEY = "dXUjsOe2THCVHLUFcuA_JA";
const API_SECRET = "KDn6c6NYqTvqQSsc2lsNtulUZ969pB9wBSqW";
const password = "8tfXvC";

const map = {
  'bcc': 'ung thư biểu mô tế bào đáy',
  'bkl': 'dày sừng tiết bã',
  'df': 'u da lành tính',
  'nv': 'nốt ruồi',
  'mel': 'ung thư tế bào hắc tố hay u sắc tố',
  'vasc': 'tổn thương mạch máu da'
}

export interface ProfileProps {
  id: string;
  user: any;
  setUser: any;
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

  let groups = initialGroups;
  let curInd = 0;
  if (user.availableTimeBlock) 
    user.availableTimeBlock.forEach((day: any, index: number) => {
      groups[index].startIndex = curInd;
      groups[index].count = day.length;
      curInd += day.length;
    })

  useEffect(() => {
    if (props.id) {
      // Admin only
    }
    else {
      const user = props.user;
      if (!user.hasOwnProperty('_id')) api.getSession().then((res: any) => {
        if (res.success) {
          props.setUser(res.data);
          setUser(res.data);
          forceReRender();
        }
      })
      else 
        setUser(user);
    }
  }, [user._id])

  const _columns = [ 
    { key: 'time', name: 'Thời gian', fieldName: 'time', minWidth: 200, maxWidth: 200, isResizable: true },
    { key: 'startTime', name: 'Bắt đầu', fieldName: 'startTime', minWidth: 150, maxWidth: 200 },
    { key: 'endTime', name: 'Kết thúc', fieldName: 'endTime', minWidth: 150, maxWidth: 200 },
    { key: 'delete', name: '', fieldName: 'delete', minWidth: 200, maxWidth: 200 },
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

  const _onRenderItemColumnTime = (item: number, index: number, column: IColumn) => {
    switch (column.key) {
      case 'startTime':
        return <Dropdown onChange={chooseTime(index)} selectedKey={item} options={startTimeGroups} placeholder="Nhập thời gian bắt đầu"/>;
      case 'endTime':
        return <Dropdown onChange={chooseTime(index)} selectedKey={item} options={endTimeGroups} placeholder="Nhập thời gian kết thúc"/>;
      case 'delete':
        return <DefaultButton styles={{ root: { margin: 'auto' } }} onClick={() => deleteRow(index)} text="Xoá thời gian"/>
      default:
        return <Label>{`Ca thứ ${index}`}</Label>;
    }
  }

  const changeTime = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    user.availableTimeBlock.forEach(day => day.sort((a, b) => a - b));
    api.updateTimeBlock({ availableTimeBlock: user.availableTimeBlock }).then((res: any) => {
      if (res.success) {
        forceReRender();
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
    api.changePassword({ password: form[1] }).then((res: any) => {
      if (res.success) {
        // success
      }
      else {
        // error
      }
    })
  }

  let [groupItems, setGroupItems] = useState([]);
  
  useEffect(() => {
    api.getGroups().then((res: any) => {
      if (res.data) {
        res = res.data.map(g => ({
          id: g._id,
          name: g.name,
          desc: g.description
        }))
        console.log(res)
        setGroupItems(res);
      }
    })
  }, [groupItems.length])

  const groupColumns = [
    { key: 'name', name: 'Tên khoa', fieldName: 'name', minWidth: 200, maxWidth: 300, isResizable: true },
    { key: 'desc', name: 'Mô tả', fieldName: 'desc', minWidth: 200, maxWidth: 300, isResizable: true },
    { key: 'delete', name: '', minWidth: 150, maxWidth: 200, isResizable: true}
  ]

  const deleteGroup = (index) => {
    api.deleteGroup(groupItems[index].id).then((res: any) => {
      if (res.success) {
        // success
      }
      else {
        // error
      }
    })
  }

  const _onRenderItemColumnGroup = (item: number, index: number, column: IColumn) => {
    console.log(item, column);
    switch (column.key) {
      case 'delete':
        return <DefaultButton onClick={() => deleteGroup(index)} text="Xoá khoa"/>
      default:
        return <Label>{item[column.fieldName]}</Label>;
    }
  }

  const createGroup = () => {
    if (form[3].length === 0 || form[4].length === 0) return;
    const body = {
      name: form[3],
      description: form[4]
    }
    api.createGroup(body).then((res: any) => {
      if (res.success) {
        // success
        api.getGroups().then((res: any) => {
          if (res.data) {
            res = res.data.map(g => ({
              name: g.name
            }))
            setGroupItems(res);
          }
        })
      }
      else {
        // error
      }
    })
  }

  let [doctorItems, setDoctorItems] = useState([]);
  
  useEffect(() => {
    api.getAllUsers().then((res: any) => {
      if (res.data) {
        res = res.data.filter(u => u.role !== 'admin').map(d => ({
          id: d._id,
          name: d.fullName,
          group: d.group.name
        }))
        setDoctorItems(res);
      }
    })
  }, [doctorItems.length])

  const doctorColumns = [
    { key: 'name', name: 'Tên bác sĩ', fieldName: 'name', minWidth: 200, maxWidth: 300, isResizable: true },
    { key: 'group', name: 'Tên khoa', fieldName: 'group', minWidth: 200, maxWidth: 300, isResizable: true },
    { key: 'delete', name: '', minWidth: 150, maxWidth: 200, isResizable: true}
  ]

  const deleteDoctor = (index) => {
    api.deleteUser(groupItems[index].id).then((res: any) => {
      if (res.success) {
        // success
      }
      else {
        // error
      }
    })
  }

  const _onRenderItemColumnDoctor = (item: number, index: number, column: IColumn) => {
    console.log(item, column);
    switch (column.key) {
      case 'delete':
        return <DefaultButton onClick={() => deleteDoctor(index)} text="Xoá khoa"/>
      default:
        return <Label>{item[column.fieldName]}</Label>;
    }
  }

  const createDoctor = () => {
    const body = {
      fullName: form[5],
      username: form[6],
      password: form[7],
      phoneNumber: form[8],
      email: form[9],
      passportNumber: form[10],
      groupId: form[11],
    }
    api.createUser(body).then((res: any) => {
      if (res.success) {
        // success
        api.getAllUsers().then((res: any) => {
          if (res.data) {
            res = res.data.filter(u => u.role !== 'admin').map(d => ({
              id: d._id,
              name: d.fullName,
              group: d.group.name
            }))
            setDoctorItems(res);
          }
        })
      }
      else {
        // error
      }
    })
  }
  
  let [bookings, setBooking] = useState([])

  useEffect(() => {
    api.getMyBookings().then(async (res: any) => {
      if (res.success) {
        console.log(res.data);
        res.data = await Promise.all(res.data.map(async (item: any, index: number) => {
            console.log('item', item);
            const startTime = new Date(
              item.bookingDateTimestamp + 15 * 60000 * item.startBlockTimeIndex
            ),
            endTime = new Date(
              item.bookingDateTimestamp +
                15 * 60000 * (item.endBlockTimeIndex + 1)
            );
            let label = "Cannot recognize";
            if (item.attachments.length) 
              label = await api.imageLabel({ path: item.attachments[0] }).then((res: any) => {
                if (res.data.label.data) {
                  return res.data.label.data.CustomLabels.map((l: any) => (map[l.Name] + " -  " + l.Confidence));
                }
                else {
                  return "Cannot recognize";
                }
              });
          return omit(
            {
              ...item,
              label: label,
              attachments: item.attachments[0],
              key: index,
              startTime: startTime.toDateString() + " - " + startTime.toTimeString(),
              endTime: endTime.toDateString() + " - " + endTime.toTimeString(),
              meetingId: item.status !== "RUNNING" ? null : item.zoomMeetingId,
            },
            ["bookingDateTimestamp", "startBlockTimeIndex", "endBlockTimeIndex"]
          );
        }));
        console.log('bookings', res.data)
        setBooking(res.data);
      }
    })
  }, [bookings.length])

  const columns = [
  {
    key: "column1",
    name: "Registered name",
    className: "name",
    fieldName: "name",
    minWidth: 100,
    maxWidth: 170,
  },
  {
    key: "column2",
    name: "Attatchments",
    className: "attachments",
    fieldName: "attachments",
    minWidth: 100,
    maxWidth: 170,
  },
  {
    key: "column3",
    name: "Diagnostic",
    className: "label",
    fieldName: "label",
    minWidth: 100,
    maxWidth: 170,
  },
  {
    key: "column4",
    name: "Start time",
    className: "startTime",
    fieldName: "startTime",
    minWidth: 250,
    maxWidth: 350,
  },
  {
    key: "column5",
    name: "End time",
    className: "endTime",
    fieldName: "endTime",
    minWidth: 250,
    maxWidth: 350,
  },
  {
    key: "column6",
    name: "Action",
    className: "meetingId",
    fieldName: "meetingId",
    minWidth: 250,
    maxWidth: 350,
  },
  ]

  const joinMeeting = (meetingNumber: any) => {
    const zoomRoot = document.getElementById("zmmtg-root");
    zoomRoot.style.display = "block";
    const meetConfig = {
      apiKey: API_KEY,
      apiSecret: API_SECRET,
      meetingNumber: meetingNumber,
      passWord: password,
      leaveUrl: document.location.href,
      role: 0,
      userName: "Patient",
    };
    try {
      var signature = ZoomMtg.generateSignature({
        meetingNumber: meetConfig.meetingNumber,
        apiKey: meetConfig.apiKey,
        apiSecret: meetConfig.apiSecret,
        role: meetConfig.role,
        success() {},
      });

      ZoomMtg.init({
        leaveUrl: meetConfig.leaveUrl,
        isSupportAV: true,
        success: function () {
          ZoomMtg.join({
            meetingNumber: meetConfig.meetingNumber,
            userName: meetConfig.userName,
            signature: signature,
            apiKey: meetConfig.apiKey,
            passWord: meetConfig.passWord,
            success: function (res) {
              console.log("join meeting success");
            },
            error: function (res) {
              console.log(res);
            },
          });
        },
        error: function (res) {
          console.log(res);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  function _renderItemColumn(item: any, index: number, column: IColumn) {
    let  fieldContent = item[column.fieldName];
    switch (column.key) {
      case "column3": {
        if (typeof fieldContent !== typeof("")) fieldContent = fieldContent.join(", ");
        console.log('label', fieldContent);
        return <span>{fieldContent}</span>;
      }
      case "column2": {
        return <Image src={fieldContent} width={100} height={100} imageFit={ImageFit.cover} />
      }
      case "column6":
        return fieldContent === null ? (
          <span>Finished</span>
        ) : (
          <PrimaryButton
            text="Join meeting"
            onClick={() => joinMeeting(fieldContent)}
            allowDisabledFocus
          />
        );
      default:
        return <span>{fieldContent}</span>;
    }
  }
  
  const _getKey = (item: any) => item.key;

  const stackStyles: Partial<IStackStyles> = { root: { width: 900, margin: 'auto' } };

  const columnProps: Partial<IStackProps> = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 350, float: 'left' } },
  };

  return (
    <div className="profile">
      <Pivot styles={{root: { marginBottom: 20 } } }>
        <PivotItem headerText="Thông tin">
          <Separator><h3>Thông tin cá nhân</h3></Separator>
          <Label>{user.fullName}</Label>
          <Label>{(user.role === "user" ? "Doctor" : user.role)}</Label>
          <Image src={user.avatar || ""}/>
          <DetailsList
            items={bookings}
            compact={false}
            columns={columns}
            selectionMode={SelectionMode.none}
            getKey={_getKey}
            setKey="none"
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
            onRenderItemColumn={_renderItemColumn}
            />
        </PivotItem>
        <PivotItem headerText="Thời gian làm việc">
          <form onSubmit={changeTime}>
            <Separator><h3>Thời gian làm việc trong tuần này</h3></Separator>
            <Stack horizontal tokens={{ childrenGap: 100 }} styles={stackStyles}>
              {user.availableTimeBlock && <DetailsList
                onRenderItemColumn={_onRenderItemColumnTime}
                items={user.availableTimeBlock.flat()}
                groups={groups}
                columns={_columns}
                groupProps={{
                  showEmptyGroups: true,
                }}
                compact={true}
                checkboxVisibility={2}
                styles={{ root: { marginBottom: 20 } }}
              />}
            </Stack>
            <PrimaryButton type="submit" text="Thay đổi thời gian làm việc"/>
          </form>
        </PivotItem>
        <PivotItem headerText="Đổi mật khẩu">
          <form onSubmit={changePassword}>
            <Separator><h3>Đổi mật khẩu</h3></Separator>
            <Stack styles={stackStyles}>
              <TextField type="password" onChange={(e, value) => _onChange(value, 0)} value={form[0]} label="Nhập mật khẩu cũ"/>
              <TextField type="password" onChange={(e, value) => _onChange(value, 1)} onBlur={checkMatch} value={form[1]} label="Nhập mật khẩu mới"/>
              <TextField type="password" onChange={(e, value) => _onChange(value, 2)} onBlur={checkMatch} errorMessage={error} value={form[2]} styles={{ root: { marginBottom: 20 } }} label="Nhập lại mật khẩu mới"/>
              <PrimaryButton type="submit" text="Thay đổi mật khẩu"/>
            </Stack>
          </form>
        </PivotItem>
        <PivotItem headerText="[Admin] Quản lý khoa">
          <div>
              <Separator><h3>Quản lý các khoa của bệnh viện</h3></Separator>
              <Stack horizontal tokens={{ childrenGap: 100 }} styles={stackStyles}>
                <Stack {...columnProps}>
                  <DetailsList
                    items={groupItems}
                    columns={groupColumns}
                    onRenderItemColumn={_onRenderItemColumnGroup}
                    checkboxVisibility={2}
                  />
                </Stack>
                <Stack {...columnProps}>
                  <TextField onChange={(e, value) => _onChange(value, 3)} label="Tạo khoa mới"/>
                  <TextField onChange={(e, value) => _onChange(value, 4)} label="Mô tả khoa"/>
                  <PrimaryButton onClick={createGroup} text="Tạo khoa"/>
                </Stack>
              </Stack>
          </div>
        </PivotItem>
        <PivotItem headerText="[Admin] Quản lý bác sĩ">
          <div>
              <Separator><h3>Quản lý các bác sĩ của bệnh viện</h3></Separator>
              <Stack horizontal tokens={{ childrenGap: 100 }} styles={stackStyles}>
                <Stack {...columnProps}>
                  <DetailsList
                    items={doctorItems}
                    columns={doctorColumns}
                    onRenderItemColumn={_onRenderItemColumnDoctor}
                    checkboxVisibility={2}
                  />
                </Stack>
                <Stack {...columnProps}>
                  <TextField onChange={(e, value) => _onChange(value, 5)} label="Tạo bác sĩ mới"/>
                  <TextField onChange={(e, value) => _onChange(value, 6)} label="Tài khoản"/>
                  <TextField onChange={(e, value) => _onChange(value, 7)} label="Mật khẩu"/>
                  <TextField onChange={(e, value) => _onChange(value, 8)} label="Số điện thoại"/>
                  <TextField onChange={(e, value) => _onChange(value, 9)} type="email" label="Email"/>
                  <TextField onChange={(e, value) => _onChange(value, 10)} label="CMND"/>
                  <Dropdown  
                    onChange={(e, value) => _onChange(value, 11)} 
                    options={groupItems.map(g => ({
                      key: g.id,
                      value: g.id,
                      text: g.name + ' - ' + g.desc
                    }))} 
                    label="Chọn khoa" required/>
                  <PrimaryButton onClick={createDoctor} text="Tạo bác sĩ"/>
                </Stack>
              </Stack>
          </div>
        </PivotItem>
      </Pivot>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchtoProps = dispatch => ({
  setUser: payload => dispatch(setUser(payload))
})

export default connect(mapStateToProps, mapDispatchtoProps)(Profile);