import React, { useState, useEffect } from "react";
import { PrimaryButton } from "office-ui-fabric-react/lib/Button";
import { ZoomMtg } from "@zoomus/websdk";
import api from "../../utils/api";
require("dotenv").config({ silent: true });

ZoomMtg.setZoomJSLib("https://source.zoom.us/1.7.6/lib", "/av");
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

const API_KEY = "dXUjsOe2THCVHLUFcuA_JA";
const API_SECRET = "KDn6c6NYqTvqQSsc2lsNtulUZ969pB9wBSqW";
const password = "8tfXvC";

export interface Meeting {
  status: string;
  symptom: string[];
  rating: any;
  attachments: string[];
  _id: string;
  name: string;
  description: string;
  gender: string;
  dob: string;
  address: string;
  phoneNumber: string;
  passportNumber: string;
  healthCareId: string;
  doctorId: string;
  bookingDateTimestamp: number;
  startBlockTimeIndex: number;
  endBlockTimeIndex: number;
  zoomMeetingId: number;
  modifiedAt: number;
  createdAt: number;
}

const Meet: React.FC = (props: any) => {
  console.log(props);

  const { id } = props.match.params;
  let [meeting, setMeeting] = useState({} as Meeting);

  useEffect(() => {
    api.getBooking(id).then((res: any) => {
      if (res.data) {
        setMeeting(res.data);
      }
    });
  }, [meeting.hasOwnProperty("_id")]);

  const meet = () => {
    const zoomRoot = document.getElementById("zmmtg-root");
    zoomRoot.style.display = "block";
    const meetConfig = {
      apiKey: API_KEY,
      apiSecret: API_SECRET,
      meetingNumber: (meeting as any).zoomMeetingId.toString(),
      passWord: password,
      leaveUrl: "/",
      role: 0,
      userName: "Huy",
    };
    try {
      var signature = ZoomMtg.generateSignature({
        meetingNumber: meetConfig.meetingNumber,
        apiKey: meetConfig.apiKey,
        apiSecret: meetConfig.apiSecret,
        role: meetConfig.role,
        success(res) {
          // console.log("signature", res.result);
        },
      });
      console.log(signature);
      ZoomMtg.init({
        leaveUrl: "http://www.zoom.us",
        isSupportAV: true,
        success: function () {
          console.log(signature);
          console.log({
            meetingNumber: meetConfig.meetingNumber,
            userName: meetConfig.userName,
            userEmail: "nmhuy132@gmail.com",
            signature: signature,
            apiKey: meetConfig.apiKey,
            passWord: meetConfig.passWord,
          });
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

  return (
    <div className="meeting">
      {meeting.hasOwnProperty("status") ? (
        <>
          {meeting.status !== "RUNNING" ? (
            <div>Countdown</div>
          ) : (
            <div>
              <PrimaryButton onClick={meet} text="Bắt đầu gọi" />
            </div>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Meet;
