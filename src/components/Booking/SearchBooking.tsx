import React, { useState, useEffect } from 'react'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from 'office-ui-fabric-react/lib/DetailsList'
import omit from 'lodash/omit'
import { Stack, IStackStyles } from 'office-ui-fabric-react/lib/Stack';

import history from '../../utils/history'
import api from '../../utils/api'

export interface SingleItem {
  key: string;
  name: string;
  description: string;
  symtom: string[];
  gender: string;
  dob: string;
  address: string;
  phoneNumber: string;
  passportNumber: string;
  healthcareId: string;
  doctorId: string;
  doctorName: string;
  startTime: string;
  endTime: string;
}

const SearchBooking: React.FC = () => {

  let [items, setItems] = useState([] as SingleItem[])

  const columns = [
    {
      key: 'column1',
        name: 'Tên',
        className: "name",
        fieldName: 'name',
        minWidth: 100,
        maxWidth: 120,
    },
    {
      key: 'column2',
        name: 'Miêu tả',
        className: "description",
        fieldName: 'description',
        minWidth: 210,
        maxWidth: 350,
    },
    {
      key: 'column3',
        name: 'Bác sĩ',
        className: "doctorName",
        fieldName: 'doctorName',
        minWidth: 100,
        maxWidth: 120,
    },
    {
      key: 'column4',
        name: 'Bắt đầu',
        className: "startTime",
        fieldName: 'startTime',
        minWidth: 250,
        maxWidth: 300,
    },
    {
      key: 'column5',
        name: 'Kết thúc',
        className: "endTime",
        fieldName: 'endTime',
        minWidth: 250,
        maxWidth: 300,
    },
  ]
  let [timeOut, newTimeOut] = useState(null as NodeJS.Timeout | null)
  let [query, setQuery] = useState("")

  useEffect(() => {
    if (timeOut) clearTimeout(timeOut)
    newTimeOut(setTimeout(() => search(query), 3000));
  }, [query])

  const search = async (query: string) => {
    if (query.length === 0) return;
    let res: any = await api.searchBooking(query);
    if (res.data) {
      res = await Promise.all(res.data.map(async (item: any, index: number) => {
        const doctorName = item.doctor.fullName,
              startTime = new Date(item.bookingDateTimestamp + 15 * 60000 * item.startBlockTimeIndex),
              endTime = new Date(item.bookingDateTimestamp + 15 * 60000 * (item.endBlockTimeIndex + 1))
        return omit({
          ...item, 
          key: index, 
          startTime: startTime.toTimeString() + ' - ' + startTime.toDateString(),
          endTime: endTime.toTimeString() + ' - ' + endTime.toDateString(),
          doctorName: doctorName
        }, ['bookingDateTimestamp', 'startBlockTimeIndex', 'endBlockTimeIndex'])
      }))

      console.log(res);
      setItems(res);
    }
    else {
      setItems([]);
    }
  }

  const _onChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value: any) => {
    setQuery(value);
  }

  const _getKey = (item: any) => item.key

  const _onItemInvoked = (item: any) => {
    history.push('meet/' + item._id);
  }

  const stackStyles: Partial<IStackStyles> = { root: { width: 900, margin: 'auto' } };

  return (
    <div className="search-booking">
      <Stack styles={stackStyles}>
        <TextField onChange={_onChange} label="Tìm kiếm lịch hẹn"/>
      </Stack>
      <div className="results">
        <DetailsList
          items={items}
          compact={false}
          columns={columns}
          selectionMode={SelectionMode.none}
          getKey={_getKey}
          setKey="none"
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible={true}
          onItemInvoked={_onItemInvoked}
        />
      </div>
    </div>
  )
}

export default SearchBooking;