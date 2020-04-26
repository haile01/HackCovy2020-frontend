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
import { Stack, IStackProps, IStackStyles } from 'office-ui-fabric-react/lib/Stack';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Container, Row, Col } from 'react-bootstrap';
import './index.css'

import api from '../../utils/api';
import history from '../../utils/history';

declare global {
  interface FileList {
      forEach(callback: (f: File) => void) : void;
  }
}

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
    { key: 'male', value: 'male', text: 'Male' },
    { key: 'female', value: 'female', text: 'Female' },
    { key: 'lgbt', value: 'lgbt', text: 'Other' },
  ]

  const dayOptions = [
    { key: '0', value: 0, text: 'Sunday' },
    { key: '1', value: 1, text: 'Monday' },
    { key: '2', value: 2, text: 'Tuesday' },
    { key: '3', value: 3, text: 'Wednesday' },
    { key: '4', value: 4, text: 'Thursday' },
    { key: '5', value: 5, text: 'Friday' },
    { key: '6', value: 6, text: 'Saturday' },
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
    api.getGroups().then((res: any) => {
      res.data = res.data.map(g => ({
        key: g._id,
        value: g._id,
        text: g.name + ' - ' + g.description
      }));
      setGroups(res.data)
    })
  }, [groups.length, ...form])

  const _onChange = (value: any, type: number) => {
    if (value.hasOwnProperty('value')) value = value.value
    form[type] = value;
    setForm(form);
    
    if (type === 7) {
      api.getDoctors(value).then((res: any) => {
        res.data = [res.data].map(d => ({
          key: d._id,
          value: d._id,
          text: d.fullName
        }))
        console.log(res.data);
        setDoctors(res.data)
      });
    }
    if (type === 8) {
      api.getUser(value).then((res: any) => {
        console.log(res.data);
        if (!res.data) return;
        if (res.data.availableTimeBlock.length === 0) res.data.availableTimeBlock = Array(7).fill(0).map(a => new Array());
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
            return res;
          })
          return day;
        })
        console.log('timeblocks', timeBlocks);
        setTimeBlocks(timeBlocks);
      })
    }
    if (type === 11) {
      if (timeBlocks[value])
      setTimeItems(timeBlocks[value])
    }
    forceReRender();
  }

  let [error, setError] = useState("");

  const _onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form[12] === "" || form[13] === "") return;
    const body = {
      phoneNumber: form[0],
      passportNumber: form[1],
      name: form[2],
      gender: form[3],
      dob: form[4].getDate() + '/' + (form[4].getMonth() + 1) + '/' + form[4].getFullYear(),
      address: form[5],
      healthCareId: form[6],
      doctorId: form[8],
      description: form[9],
      symptom: form[10].split(','),
      bookingDateTimestamp: form[14],
      startBlockTimeIndex: form[12],
      endBlockTimeIndex: form[13],
      attachments: [form[15]],
    }
    console.log(body)
    api.book(body).then((res: any) => {
      if (res.success) {
        console.log(res);
        history.push('/search')
      }
      else {
        setError(res.error);
      }
    })
  }

  let [checkBubble, { toggle: toggleCheckBubble }] = useBoolean(false);

  const checkPrevious = async () => {
    const phone = form[0], Id = form[1];
    let res: any = await api.searchBooking(phone)
    if (res.data) {
      res = res.data;

      // if (res.passportNumber !== Id) return;
      // res = [res];
      
      form[1] = res[0].passportNumber;
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

  let _selection : Selection = new Selection({
    onSelectionChanged: () => {
      if (_selection.getSelection().length === 0) return;
      const selections: any = _selection.getSelection().sort((a: any, b: any) => a.value - b.value);
      console.log(_selection.getSelection())
      form[12] = selections[0].value; // startBlock
      form[13] = selections[selections.length - 1].value; // endBlock
      let firstDayOfWeek = new Date(),
          diff = firstDayOfWeek.getDate() - firstDayOfWeek.getDay();
      firstDayOfWeek.setDate(diff);
      firstDayOfWeek.setHours(0, 0, 0, 0);
      form[14] = (new Date(firstDayOfWeek.getTime() + form[11] * 86400000)).getTime() //blockDateTimeStamp
      setForm(form);
    }
  });

  const timeColumns = [
    { key: 'column1', name: 'From', fieldName: 'startTime', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'column2', name: 'To', fieldName: 'endTime', minWidth: 100, maxWidth: 200, isResizable: true },
  ];

  const upLoadImage = async (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    var files = (e.target as HTMLInputElement).files;
    let body = [];
    for (var i = 0; i < files.length; i++) {
      let f = files[i];
      body.push({
        fileName: (new Date()).getTime() + f.name,
        fileType: f.type
      })
    }
    console.log(body);
    let _res = await Promise.all(body.map(b => api.generateSignedUrl(b).then((res: any) => res)))
    _res.forEach((r, index) => {
      api.uploadImage({
        url: r.signedRequest,
        type: 'PUT',
        dataType: 'html',
        processData: false,
        headers: {'Content-Type': files[index].type},
        crossDomain: true,
        data: files[index]
      })
    })
    form[15] = _res.map(r => r.url);
    setForm(form);
  }

  const columnProps: Partial<IStackProps> = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 350, float: 'left' } },
  };

  const stackStyles: Partial<IStackStyles> = { root: { width: 800, margin: 'auto' } };

  const ErrorMessage = (props) => (
    props.error != "" && <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={false}
      dismissButtonAriaLabel="Close"
    >
      Error: {props.error}
    </MessageBar>
  );
  
  

  return (
    <div className="booking">
      <form onSubmit={_onSubmit}>
        <Container style={{ width: 1000, overflow: 'hidden', marginTop: 100, marginBottom: 100 }}>
          <div style={{ width: 2000, display: 'flex', flexDirection: 'row', transform: 'translateX(0px)', transition: 'transform .3s ease-in-out' }}>
            <Row>
              <Col style={{ position: 'relative', width: 1000 }}>
                <NavRight/>
                <h3>Personal Information</h3>
                <Stack horizontal tokens={{ childrenGap: 100 }} styles={stackStyles}>
                  <Stack {...columnProps}>
                  
                    <TextField   onChange={(e, value) => _onChange(value, 0)} value={form[0]} label="Telephone number" required/>
                    <PrimaryButton id="checkPrevious" text="Autofill" onClick={toggleCheckBubble}/>
                    {
                      checkBubble && (
                      <TeachingBubble
                                    target="#checkPrevious" 
                                    primaryButtonProps={_primaryButtonProps}
                                    headline="Tự động điền thông tin"
                                    onDismiss={toggleCheckBubble}
                                    >
                        If you've already used this before, let us fill in this part for you
                      </TeachingBubble>
                    )}
                    <TextField   onChange={(e, value) => _onChange(value, 1)} value={form[1]} label="Identification" required/>
                    <TextField   onChange={(e, value) => _onChange(value, 2)} value={form[2]} label="Full name" required/>
                  </Stack>
                  <Stack {...columnProps}>
                    <DatePicker onSelectDate={(value) => _onChange(value, 4)} value={form[4]} label="Date of birth" placeholder="Choose a date..."/>
                    <TextField   onChange={(e, value) => _onChange(value, 5)} value={form[5]} label="Address" required/>
                    <TextField   onChange={(e, value) => _onChange(value, 6)} value={form[6]} label="Medical Insurance" required/>
                    <ChoiceGroup onChange={(e, value) => _onChange(value, 3)} selectedKey={form[3].toString()} label="Gender" options={genderOptions} required/>
                  </Stack>
                </Stack>
              </Col>
              <Col style={{ position: 'relative', width: 1000 }}>
                <NavLeft/>
                <h3>Register</h3>
                <Stack horizontal tokens={{ childrenGap: 100 }} styles={stackStyles}>
                  <Stack {...columnProps}>
                    <ErrorMessage error={error}/>
                    <Dropdown  onChange={(e, value) => _onChange(value, 7)} options={groups} label="Choose department" required/>
                    <Dropdown  onChange={(e, value) => _onChange(value, 8)} options={doctors} label="Choose doctor" required/>
                    <TextField onChange={(e, value) => _onChange(value, 9)} label="Description" required/>
                    <TextField onChange={(e, value) => _onChange(value, 10)} label="Symptoms (separated by only a coma)"/>
                    <Dropdown  onChange={(e, value) => _onChange(value, 11)} options={dayOptions} label="Choose date"required/>
                    <input type="file" onChange={upLoadImage} multiple/>
                  </Stack>
                  <Stack {...columnProps}>
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
                  </Stack>
                </Stack>
                <PrimaryButton type="submit" text="Register"/>
              </Col>
            </Row>
          </div>
        </Container>
      </form>
    </div>
  )
}

const NavLeft: React.FC = () => {
  
  const navLeft = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = (e.target as HTMLElement).parentElement.parentElement.parentElement;
    let curVal: any = target.style.transform.slice(11, -3);
    curVal = parseInt(curVal);
    console.log(curVal);
    curVal += 1000;
    target.style.transform = 'translateX(' + curVal + 'px)';
  }

  return (
    <div className="Nav" onClick={navLeft} style={{ left: 0 }}></div>
  )
}

const NavRight: React.FC = () => {
  
  const navRight = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = (e.target as HTMLElement).parentElement.parentElement.parentElement;
    console.log(target, target.style.transform);
    let curVal: any = target.style.transform.slice(11, -3);
    curVal = parseInt(curVal);
    console.log(curVal);
    curVal -= 1000;
    target.style.transform = 'translateX(' + curVal + 'px)';
  }

  return (
    <div className="Nav" onClick={navRight} style={{ right: 0 }}></div>
  )
}

export default Booking;