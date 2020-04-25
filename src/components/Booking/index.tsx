import React, { useState, useEffect } from 'react';
import { useBoolean } from '@uifabric/react-hooks'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup'
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker'
import { Separator } from 'office-ui-fabric-react/lib/Separator'
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown'
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button'
import { TeachingBubble } from 'office-ui-fabric-react/lib/TeachingBubble'
import { DetailsList, DetailsListLayoutMode, Selection } from 'office-ui-fabric-react/lib/DetailsList'
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';

import api from '../../utils/api';

export interface IDetailsListBasic {
  key: number;
  name: string;
  value: number;
}

export interface TimeItem {
  key: number;
  value: number;
  startTime: string;
  endTime: string;
}

const Booking: React.FC = () => {

  const genderOptions = [
    { key: 'male', value: 'male', text: 'Nam' },
    { key: 'female', value: 'female', text: 'Nữ' },
    { key: 'lgbt', value: 'lgbt', text: 'Không muốn tiết lộ' },
  ]

  const dayOptions = [
    { key: '0', value: 0, text: 'Chủ nhật' },
    { key: '1', value: 1, text: 'Thứ hai' },
    { key: '2', value: 2, text: 'Thứ ba' },
    { key: '3', value: 3, text: 'Thứ tư' },
    { key: '4', value: 4, text: 'Thứ năm' },
    { key: '5', value: 5, text: 'Thứ sáu' },
    { key: '6', value: 6, text: 'Thứ bảy' },
  ]

  let [groups, setGroups] = useState([] as IDropdownOption[]);
  let [doctors, setDoctors] = useState([] as IDropdownOption[]);
  let [timeBlocks, setTimeBlocks] = useState([] as TimeItem[][]);
  let [timeItems, setTimeItems] = useState([] as TimeItem[]);
  let [rand, setRand] = useState(0);

  const forceReRender = () => setRand(Math.round(Math.random() * 1000000000));

  const initialForm = Array(15).fill("");
  initialForm[4] = new Date();
  let [form, setForm] = useState(initialForm);

  useEffect(() => {
    api.getGroups().then((res: any) => setGroups(res.data))
  }, [groups.length, ...form])

  const _onChange = (value: any, type: number) => {
    console.log('change', value, type);
    if (value.hasOwnProperty('value')) value = value.value
    form[type] = value;
    setForm(form);
    
    if (type === 7) {
      api.getDoctors(value).then((res: any) => setDoctors(res.data));
    }
    if (type === 8) {
      api.getUser(value).then((res: any) => {
        let timeBlocks = res.data.availableTimeBlock,
            firstDayOfWeek = new Date(),
            diff = firstDayOfWeek.getDate() - firstDayOfWeek.getDay();
        firstDayOfWeek.setDate(diff);
        firstDayOfWeek.setHours(0, 0, 0, 0);

        timeBlocks = timeBlocks.map((day: any[], index: number) => {
          const curDay = new Date(firstDayOfWeek.getTime() + 86400000 * index);
          day = day.map((i: number, index: number) => {
            const res = {
              key: index,
              value: i,
              startTime: (new Date(curDay.getTime() + 15 * 60000 * i)).toTimeString().slice(0, 8),
              endTime: (new Date(curDay.getTime() + 15 * 60000 * (i + 1))).toTimeString().slice(0, 8),
            }
            console.log(res);
            return res;
          })
          return day;
        })
        console.log(timeBlocks);
        setTimeBlocks(timeBlocks);
      })
    }
    if (type === 11) {
      console.log(value, timeBlocks[value])
      setTimeItems(timeBlocks[value])
    }
    forceReRender();
  }

  const _onSubmit = () => {
    const body = {
      phoneNumber: form[0],
      passportNumber: form[1],
      name: form[2],
      gender: form[3],
      dob: form[4].getDate() + '/' + form[2].getMonth() + '/' + form[3].getFullYear,
      address: form[5],
      healthCareId: form[6],
      doctorId: form[8],
      description: form[9],
      symptom: form[10].split(','),
      bookingDateTimestamp: form[14],
      startBlockTimeIndex: form[12],
      endBlockTimeIndex: form[13]
    }
    api.book(body).then((res: any) => {
      if (res.success) {
        // success
      }
      else {
        // error
      }
    })
  }

  let [checkBubble, { toggle: toggleCheckBubble }] = useBoolean(false);

  const checkPrevious = async () => {
    const phone = form[0], Id = form[1];
    let res: any = await api.searchBooking(phone)
    if (res.success) {
      res = res.data;
      res.filter((book: any) => book.passportNumber == Id);
      if (res.length === 0) {
        // error
        return;
      }
      
      form[2] = res[0].name;
      form[3] = res[0].gender;
      form[4] = new Date(res[0].dob.slice(6) + '-' + res[0].dob.slice(3, 5) + '-' + res[0].dob.slice(0, 2));
      form[5] = res[0].address;
      form[6] = res[0].healthCareId;
      setForm(form);
      forceReRender()
    }
    else {
      // error
    }
  }

  const _primaryButtonProps: IButtonProps = {
    children: "Kiếm tra những hồ sơ trước",
    onClick: () => {
      checkPrevious(); 
      toggleCheckBubble()
    }
  }

  const _secondaryButtonProps: IButtonProps = {
    children: "Không, đây là lần đầu tiên của tôi",
    onClick: toggleCheckBubble
  }

  let _selection : Selection = new Selection({
    onSelectionChanged: () => {
      const selections: any = _selection.getSelection().sort((a: any, b: any) => a.value - b.value);
      form[12] = selections[0].value; // startBlock
      form[13] = selections[0].value; // endBlock
      let firstDayOfWeek = new Date(),
          diff = firstDayOfWeek.getDate() - firstDayOfWeek.getDay();
      firstDayOfWeek.setDate(diff);
      firstDayOfWeek.setHours(0, 0, 0, 0);
      form[14] = (new Date(firstDayOfWeek.getTime() + form[11] * 86400000)).getTime() //blockDateTimeStamp
      setForm(form);
    }
  });

  const timeColumns = [
    { key: 'column1', name: 'Từ', fieldName: 'startTime', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'column2', name: 'Đến', fieldName: 'endTime', minWidth: 100, maxWidth: 200, isResizable: true },
  ];

  return (
    <div className="booking">
      <form onSubmit={() => _onSubmit()}>
        <Separator><h3>Thông tin cá nhân</h3></Separator>
        <TextField   onChange={(e, value) => _onChange(value, 0)} value={form[0]} label="Số điện thoại" required/>
        <TextField   onChange={(e, value) => _onChange(value, 1)} value={form[1]} label="CMND" required/>
        <DefaultButton id="checkPrevious" text="Kiểm tra" onClick={toggleCheckBubble}/>
        {
          checkBubble && (
          <TeachingBubble target="#checkPrevious" 
                        primaryButtonProps={_primaryButtonProps} 
                        secondaryButtonProps={_secondaryButtonProps}
                        headline="Tự động điền thông tin"
                        onDismiss={toggleCheckBubble}
                        >
            Nếu bạn đã dùng thông tin này cho những hồ sơ trước, hãy để chúng tôi điền thông tin cho bạn
          </TeachingBubble>
        )}
        <TextField   onChange={(e, value) => _onChange(value, 2)} value={form[2]} label="Tên" required/>
        <ChoiceGroup onChange={(e, value) => _onChange(value, 3)} selectedKey={form[3].toString()} label="Giới tính" defaultSelectedKey="m" options={genderOptions} required/>
        <DatePicker onSelectDate={(value) => _onChange(value, 4)} value={form[4]} label="Ngày sinh" placeholder="Chọn ngày..."/>
        <TextField   onChange={(e, value) => _onChange(value, 5)} value={form[5]} label="Địa chỉ" required/>
        <TextField   onChange={(e, value) => _onChange(value, 6)} value={form[6]} label="BHYT" required/>
        <Separator><h3>Thông tin thanh toán</h3></Separator>
        Cummin' soon
        <Separator><h3>Đăng kí khám bệnh</h3></Separator>
        <Dropdown  onChange={(e, value) => _onChange(value, 7)} options={groups} label="Chọn khoa"/>
        <Dropdown  onChange={(e, value) => _onChange(value, 8)} options={doctors} label="Chọn bác sĩ"/>
        <TextField onChange={(e, value) => _onChange(value, 9)} label="Mô tả" required/>
        <TextField onChange={(e, value) => _onChange(value, 10)} label="Triệu chứng (chỉ cách nhau bởi dấu phẩy)" required/>
        <Dropdown  onChange={(e, value) => _onChange(value, 11)} options={dayOptions} label="Chọn ngày khám"/>
        <MarqueeSelection selection={_selection}>
          <DetailsList
            items={timeItems}
            columns={timeColumns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            selection={_selection}
            selectionPreservedOnEmptyClick={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="Row checkbox"
          />
        </MarqueeSelection>
        <PrimaryButton type="submit" text="Đăng kí khám bệnh"/>
      </form>
    </div>
  )
}

export default Booking;