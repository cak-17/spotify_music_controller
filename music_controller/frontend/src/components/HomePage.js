import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Navigate,
} from "react-router-dom";

import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
import Room from './Room';
import Prova from './Prova';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: null,
        };
        this.clearRoomCallback = this.clearRoomCallback.bind(this);
    }
    async componentDidMount() {
        fetch('/api/user-in-room')
        .then(response => response.json())
            .then(data => {
                this.setState({roomCode: data.code})
                console.log(this.state.roomCode)
            });
        }
        clearRoomCallback() {
            this.setState({
                roomCode: null,
            })
        }

    RenderHomePage() {
        return (
            <Container>
            <Row className="mb-5">
                <Col lg={6} className="text-center">
                    <h1 className="display-1 fw-bold">House Party</h1>
                </Col>
            </Row>
            <Row>
                <Col className="btn-group">
                    <Link className="btn btn-primary" to="/join">Join</Link>
                    <Link className="btn btn-danger" to="/create">Create</Link>
                </Col>
            </Row>
        </Container>
        )
    }


    render() {
    return (
        <BrowserRouter>
        <Routes>
            <Route exact path="/" element={this.state.roomCode ? <Navigate to={`/room/${this.state.roomCode}`} /> : this.RenderHomePage()}/>
            <Route path="/join" element={<RoomJoinPage />}/>
            <Route path="/create" element={<CreateRoomPage />} />
            <Route path="/room/:roomCode" element={<Room leaveRoomCallback={this.clearRoomCallback}/>}/>
            {
                //DEBUG, to delete
            }
            <Route path="/prova" element={<Prova />}/>
        </Routes>
    </BrowserRouter>
    )};
}
