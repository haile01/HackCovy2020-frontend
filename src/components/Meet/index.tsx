import React, { useState, useEffect } from 'react'
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button'
import { ZoomMtg } from '@zoomus/websdk';
import api from '../../utils/api';
require('dotenv').config({ silent: true })

const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET
const password = process.env.password

export interface Meeting {
  status: string,
  symptom: string[],
  rating: any,
  attachments: string[],
  _id: string,
  name: string,
  description: string,
  gender: string,
  dob: string,
  address: string,
  phoneNumber: string,
  passportNumber: string,
  healthCareId: string,
  doctorId: string,
  bookingDateTimestamp: number,
  startBlockTimeIndex: number,
  endBlockTimeIndex: number,
  zoomMeetingId: number,
  modifiedAt: number,
  createdAt: number,
}

const Meet: React.FC = (props: any) => {

  console.log(props);

  const { id } = props.match.params;
  let [meeting, setMeeting] = useState({} as Meeting)

  useEffect(() => {
    api.getBooking(id).then((res: any) => {
      if (res.data) {
        setMeeting(res.data)
      }
    })
  }, [(meeting.hasOwnProperty('_id'))])

  const meet = () => {
    const meetConfig = {
      apiKey: API_KEY,
      apiSecret: API_SECRET,
      meetingNumber: meeting,
      passWord: password,
      leaveUrl: '/',
      role: 'assistant'
    };

    ZoomMtg.generateSignature({
        meetingNumber: meetConfig.meetingNumber,
        apiKey: meetConfig.apiKey,
        apiSecret: meetConfig.apiSecret,
        role: meetConfig.role,
        success(res) {
            console.log('signature', res.result);
            ZoomMtg.init({
                leaveUrl: '/',
                success() {
                    ZoomMtg.join(
                        {
                            meetingNumber: meetConfig.meetingNumber,
                            signature: res.result,
                            apiKey: meetConfig.apiKey,
                            passWord: meetConfig.passWord,
                            success() {
                              // succ
                            },
                            error(res) {
                                console.log(res);
                            }
                        }
                    );
                },
                error(res) {
                    console.log(res);
                }
            });
        }
    });
  }

  return (
    <div className="meeting">
      {meeting.hasOwnProperty('status') ? (
        <>
        {
          meeting.status !== 'RUNNING' ? (
            <div>Countdown</div>
          ) : (
            <div>
              <PrimaryButton onClick={meet} text="Bắt đầu gọi"/>
            </div>
          )
        }
        </>
      ):(
        <></>
      )}
    </div>
  )
}

export default Meet;
