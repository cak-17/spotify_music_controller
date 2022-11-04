import React from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { withNavigation } from '../hocs'

class RoomJoinPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: "",
            error: "",
        }
        this.handleRoomButton = this.handleRoomButton.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this); 
    }
    handleTextChange(e) {
        this.setState({
            roomCode: e.target.value
        })
    }
    handleRoomButton() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: this.state.roomCode,
            })
        };
        fetch('/api/join-room', requestOptions)
        .then(response => {
            if (response.ok) {
                this.props.navigate(`/room/${this.state.roomCode}`)
            } else {
                this.setState({
                    error: "No Room Found",
                })
            }
        }).catch(error => {
            console.log(error);
        });
    }
    render () {
        return (
        <Container >
            <Container lg={6} className="text-center">
                <h1 className="display-2">Join a Room</h1>
                <Form>
                    <Form.Group className="my-5">
                            <Form.Label><h4>Code</h4></Form.Label>
                            <Form.Control type="text" placeholder="Enter a Room Code" value={this.state.roomCode} onChange={this.handleTextChange} required />
                            <Form.Text className="text-danger">{this.state.error}</Form.Text>
                    </Form.Group>
                    <Form.Group className="btn-group">
                        <Button onClick={this.handleRoomButton}>Join Room</Button>
                        <Link className="btn btn-success" to="/">Back</Link>
                    </Form.Group>
                </Form>
            </Container>
        </Container> 
        )
    }
}

export default withNavigation(RoomJoinPage);