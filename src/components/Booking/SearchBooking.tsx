import React, { useState, useEffect } from "react";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
} from "office-ui-fabric-react/lib/DetailsList";
import omit from "lodash/omit";
import { Stack, IStackStyles } from "office-ui-fabric-react/lib/Stack";
import { Spinner } from "office-ui-fabric-react/lib/Spinner";
import { MessageBar, MessageBarType } from "office-ui-fabric-react";
import history from "../../utils/history";
import api from "../../utils/api";

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
  let [formLoading, setFormLoading] = useState(false);
  let [firstTimeVisit, setFirstTimeVisit] = useState(true);
  let [items, setItems] = useState([] as SingleItem[]);

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
      key: "column3",
      name: "Doctor name",
      className: "doctorName",
      fieldName: "doctorName",
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
  ];

  let [timeOut, newTimeOut] = useState(null as NodeJS.Timeout | null);
  let [query, setQuery] = useState("");

  useEffect(() => {
    if (timeOut) clearTimeout(timeOut);
    newTimeOut(setTimeout(() => search(query), 1000));
  }, [query]);

  const search = async (query: string) => {
    if (query.length === 0) return;
    setFormLoading(true);
    setFirstTimeVisit(false);
    let res: any = await api.searchBooking(query);
    if (res.data) {
      res = await Promise.all(
        res.data.map(async (item: any, index: number) => {
          const doctorName = item.doctor.fullName,
            startTime = new Date(
              item.bookingDateTimestamp + 15 * 60000 * item.startBlockTimeIndex
            ),
            endTime = new Date(
              item.bookingDateTimestamp +
                15 * 60000 * (item.endBlockTimeIndex + 1)
            );
          return omit(
            {
              ...item,
              key: index,
              startTime:
                startTime.toDateString() + " - " + startTime.toTimeString(),
              endTime: endTime.toDateString() + " - " + endTime.toTimeString(),
              doctorName: doctorName,
            },
            ["bookingDateTimestamp", "startBlockTimeIndex", "endBlockTimeIndex"]
          );
        })
      );

      setItems(res);
      setFormLoading(false);
    } else {
      setItems([]);
    }
  };

  const _onChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    value: any
  ) => {
    setQuery(value);
  };

  const _getKey = (item: any) => item.key;

  const _onItemInvoked = (item: any) => {
    history.push("meet/" + item._id);
  };

  const stackStyles: Partial<IStackStyles> = {
    root: { width: 500, margin: "auto" },
  };

  const stackListStyles: Partial<IStackStyles> = {
    root: { width: "90vw", margin: "auto" },
  };

  return (
    <div className="search-booking">
      <div className="hp-lookup-container">
        <div className="hp-lookup-content">
          <p>
            <h1 className="hp-slogan">Find your booking</h1>
          </p>
          <Stack styles={stackStyles}>
            <TextField
              onChange={_onChange}
              disabled={formLoading}
              placeholder="Input your phone number here."
            />
          </Stack>
        </div>
      </div>
      <div className="results">
        {items.length == 0 && !formLoading && (
          <p style={{ marginTop: "30px" }}>
            {firstTimeVisit
              ? "Input your phone number to find your bookings"
              : "No data"}
          </p>
        )}
        {items.length == 0 && formLoading && (
          <Spinner
            style={{ marginTop: "30px" }}
            label="Finding your booking"
          ></Spinner>
        )}
        {items.length > 0 && (
          <Stack styles={stackListStyles} style={{ paddingTop: "30px" }}>
            <MessageBar
              messageBarType={MessageBarType.success}
              messageBarIconProps={null}
            >
              Get your booking success! Double click on the booking date you
              want to get detail.
            </MessageBar>
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
          </Stack>
        )}
      </div>
    </div>
  );
};

export default SearchBooking;
