import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBars, faClock, faHome, faPlus, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import secureLocalStorage from 'react-secure-storage';
import CreatePost from '../pages/users/CreatePost';
import { useNavigate } from 'react-router-dom';

function MyNavbar() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [userFullName, setUserFullName] = useState(secureLocalStorage.getItem("username"));
  const [userImage, setUserImage] = useState(secureLocalStorage.getItem("image"));
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const openCreatePost = () => { setShowCreatePostModal(true); }
  const hideCreatePost = () => {
    setShowCreatePostModal(false);
  }

  useEffect(() => {
    if (userFullName !== null) {
      setUserFullName(userFullName.replace(/"/g, ""));
      setUserImage(userImage.replace(/"/g, ""));
    } else {
      setUserFullName("");
    }
  }, [userFullName, userImage])

  const handleToggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  const navigateTo = useNavigate();

  const openMyProfile = () => {
    handleToggleOffcanvas();
    navigateTo(`/user`, { state: { userId: secureLocalStorage.getItem("userId") } });
    // sessionStorage.setItem("selectedProfile", secureLocalStorage.getItem("userId"));
    // navigateTo('/user');
  }

  const openDashboard = () => {
    handleToggleOffcanvas();
    navigateTo(`/dashboard`);
  }

  useEffect(() => {
    console.log("image mo to", secureLocalStorage.getItem("image"));
    if (secureLocalStorage.getItem("isAdminLoggedIn") === "true") {
      setIsAdminLoggedIn(true);
    }
  }, [])

  return (
    <>
      <Navbar className="navbar-dark bg-zinc-950 text-white position-fixed top-0 w-100 z-10">
        <Container fluid>
          <Button variant="outline-light" onClick={handleToggleOffcanvas}>
            <FontAwesomeIcon icon={faBars} size='lg' />
          </Button>
          <Navbar.Brand onClick={() => navigateTo(`/dashboard`)}>
            <b className='clickable'>Meet Ta</b>
          </Navbar.Brand>
          <Offcanvas
            show={showOffcanvas}
            onHide={() => setShowOffcanvas(false)}
            placement="start"
            className="custom-offcanvas"
          >
            <Offcanvas.Header closeButton={false} className='mt-1'>
              <Navbar.Brand>
                <h5 className='ms-2 clickable' onClick={openMyProfile}>{userFullName}</h5>
              </Navbar.Brand>
              <div onClick={() => setShowOffcanvas(false)}>
                <Button variant='outline-light'><FontAwesomeIcon icon={faArrowLeft} size='lg' /> </Button>
              </div>
            </Offcanvas.Header>
            <Offcanvas.Body className='mt-1 flex flex-col justify-between'>
              <Nav >
                <Nav.Link onClick={openDashboard}>
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  Home
                </Nav.Link>
                <Nav.Link onClick={openMyProfile}>
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  View Profile
                </Nav.Link>
                <hr className='bg-secondary w-100' />
                {isAdminLoggedIn &&
                  <Nav.Link href='/meeta/admin/dashboard'>
                    <FontAwesomeIcon icon={faClock} className="mr-2" />
                    Pending Post
                  </Nav.Link>
                }
                <Nav.Link onClick={openCreatePost}>
                  <FontAwesomeIcon className='clickable mr-2' icon={faPlus} />
                  Create Post
                </Nav.Link>
              </Nav>
              <div>
                <NavDropdown title="Account" drop='up'>
                  {/* <NavDropdown.Item href="/gsd/account/password"><FontAwesomeIcon icon={faKey} /> Change Password</NavDropdown.Item> */}
                  <NavDropdown.Item href="/meeta" onClick={handleSignout}><FontAwesomeIcon icon={faSignOutAlt} /> Signout</NavDropdown.Item>
                </NavDropdown>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </Navbar>
      <CreatePost show={showCreatePostModal} onHide={hideCreatePost} />
    </>
  );
}

export default MyNavbar;

export function handleSignout() {
  secureLocalStorage.removeItem("username", "");
  secureLocalStorage.removeItem("image", "");
  secureLocalStorage.removeItem("email", "");
  secureLocalStorage.removeItem("userId", "");
  secureLocalStorage.removeItem("isLoggedIn", "");
  secureLocalStorage.removeItem("level", "");
  secureLocalStorage.removeItem("isAdminLoggedIn", "");
}