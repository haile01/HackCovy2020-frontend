import api from "../../utils/api";
import { connect } from "react-redux";
import React, { useEffect } from "react";
import history from "../../utils/history";
import { Nav, Navbar } from "react-bootstrap";
import { setUser } from "../../actions/userAction";

const _Navbar: React.FC = (props: any) => {
  useEffect(() => {
    if (localStorage.getItem("token"))
      api.getSession().then((res: any) => {
        if (res.success) {
          props.setUser(res.data);
        }
      });
  }, [props.user._id]);

  const signOut = () => {
    props.setUser({});
    localStorage.removeItem("token");
    history.push("/");
  };

  const ProfileNav = props.user.hasOwnProperty("_id") ? (
    <Nav>
      <Nav.Link onClick={() => history.push("/profile")}>
        {props.user.fullName}
      </Nav.Link>
      <Nav.Link onClick={() => signOut()}>Sign out</Nav.Link>
    </Nav>
  ) : (
    <Nav>
      <Nav.Link onClick={() => history.push('/signin')}>Sign in</Nav.Link>
    </Nav>
  );

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Homespital</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link onClick={() => history.push("/book")}>Booking</Nav.Link>
          <Nav.Link onClick={() => history.push("/search")}>Look up</Nav.Link>
        </Nav>
        {ProfileNav}
      </Navbar.Collapse>
    </Navbar>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchtoProps = (dispatch) => ({
  setUser: (payload) => dispatch(setUser(payload)),
});

export default connect(mapStateToProps, mapDispatchtoProps)(_Navbar);
