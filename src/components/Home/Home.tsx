import React from "react";
import history from "../../utils/history";
import { PrimaryButton } from "office-ui-fabric-react";
import { Container, Row, Col } from "react-bootstrap";

const Home: React.FC = () => {
  return (
    <div>
      <div className="hp-container">
        <div className="hp-content">
          <h1 className="hp-brand">Homespital</h1>
          <h4 className="hp-slogan">
            No more day-long lining. No more cross infection.
          </h4>
          <p className="hp-slogan">
            Need a check but don't want to go to hospital?
          </p>
          <PrimaryButton
            text="Book an online meeting"
            onClick={() => history.push("/book")}
            allowDisabledFocus
          />
        </div>
      </div>
      <Container style={{ paddingTop: "80px" }}>
        <Row>
          <Col>
            <p>
              <i
                className="fa fa-5x fa-universal-access"
                aria-hidden="true"
              ></i>
            </p>
            <p>
              <b>Reduce cross-infection</b>
            </p>
            <p>
              With online meeting with doctor, patient do not need to go to the
              hospital where cross-infection may takes place.
            </p>
          </Col>
          <Col>
            <p>
              <i className="fa fa-5x fa-users" aria-hidden="true"></i>
            </p>
            <p>
              <b>Reduce traffic at hospitals</b>
            </p>
            <p>
              Patients do not go to the hospital, in order that the traffic will
              be reduced.
            </p>
          </Col>
          <Col>
            <p>
              <i className="fa fa-5x fa-heart" aria-hidden="true"></i>
            </p>
            <p>
              <b>Easily healthcare experience</b>
            </p>
            <p>
              With less than 3 steps, patient can book the best fit doctor for
              themself.
            </p>
          </Col>
        </Row>
      </Container>
      <div
        style={{
          marginTop: "80px",
          backgroundColor: "#f5f9fc",
          paddingTop: "50px",
          paddingBottom: "50px",
        }}
      >
        <p>
          <h1>Want to book a meeting with your doctor?</h1>
        </p>
        <table style={{ margin: "auto" }}>
          <tbody>
            <tr>
              <td style={{ paddingRight: "10px" }}>
                <i className="fa fa-check-square-o" aria-hidden="true"></i>
              </td>
              <td className="text-left">
                High-quality, everywhere, every time.
              </td>
            </tr>
            <tr>
              <td style={{ paddingRight: "10px" }}>
                <i className="fa fa-check-square-o" aria-hidden="true"></i>
              </td>
              <td className="text-left">No account registration needed.</td>
            </tr>
            <tr>
              <td style={{ paddingRight: "10px" }}>
                <i className="fa fa-check-square-o" aria-hidden="true"></i>
              </td>
              <td className="text-left">Easy booking and fast payment.</td>
            </tr>
            <tr>
              <td style={{ paddingRight: "10px" }}>
                <i className="fa fa-check-square-o" aria-hidden="true"></i>
              </td>
              <td className="text-left">Diagnose AI for your skin diseases.</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: "20px" }}>
          <PrimaryButton
            text="Book a meeting now"
            onClick={() => history.push("/book")}
            allowDisabledFocus
          />
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#dfe9f0",
          paddingTop: "50px",
          paddingBottom: "50px",
        }}
      >
        ©2020 LQD_OldBoiz. All Rights Reserved.
      </div>
    </div>
  );
};

export default Home;
