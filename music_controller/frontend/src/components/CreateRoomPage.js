import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

import { withNavigation } from '../hocs'

/* 
To Fix:
    
*/


function AlertDismissible(props) {
    const [show, setShow] = useState(true);
    if (show) {
        return (
        <Alert variant={props.variant} onClose={() => setShow(false)} dismissible>
            {props.msg}
        </Alert>
        );
    }
}



class CreateRoomPage extends React.Component {
    static defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            votes_to_skip: this.props.votesToSkip,
            guest_can_pause: this.props.guestCanPause,
            errorMsg: '',
            successMsg: '',
            alertShow: false,
        };

        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this)
        this.handleVotesChange = this.handleVotesChange.bind(this)
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this)
        this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this)
    }

    handleVotesChange(e) {
        this.setState({
            votes_to_skip: e.target.value
        })
    }

    handleGuestCanPauseChange(e) {
        this.setState({
            guest_can_pause: e.target.value === 'true' ? true : false,
        })
    }

    handleRoomButtonPressed () {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: this.state.votes_to_skip,
                guest_can_pause: this.state.guest_can_pause
            })
        }
        fetch('/api/create-room', requestOptions)
        .then((response) => response.json())
        .then(data => this.props.navigate('/room/' + data.code));
    }

    handleUpdateButtonPressed () {
        const requestOptions = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: this.state.votes_to_skip,
                guest_can_pause: this.state.guest_can_pause,
                code: this.props.roomCode
            })
        }
        fetch('/api/update-room', requestOptions)
        .then((response) => {
            if (response.ok) {
                this.setState({
                    alertShow: true,
                    successMsg: "Room updated Successfully",
                })
            } else {
                this.setState({
                    alertShow: true,
                    errorMsg: "Error updating Room...",
                })
            }
            this.props.updateCallback();
        });
        
    }

    renderCreateButtons() {
        return (
            <Form.Group className="btn-group mt-3">
            <Button type="button" onClick={this.handleRoomButtonPressed}>Create A Room</Button>
            <Link className="btn btn-success" to="/">Back</Link>
            </Form.Group>)
    }

    renderUpdateButtons() {
        return (
            <Form.Group className="btn-group mt-3">
            <Button type="button" onClick={this.handleUpdateButtonPressed}>Update A Room</Button>
            </Form.Group>)
    }

    renderAlertMsg() {
        if (this.state.alertShow) {
            if (this.state.successMsg != "") {
                return (<AlertDismissible variant={"success"} msg={this.state.successMsg}/>)
            }
            if (this.state.errorMsg != "") {
                return (<AlertDismissible variant={"danger"} msg={this.state.errorMsg}/>)
            }
        }
        return null;
    }

    render () {
        const title = this.props.update ? "Update Room" : "Create A Room";

        return (
            <Container>
                <Container lg={6}>
                    {this.renderAlertMsg()}
                </Container>
                <Container className="mt-5">
                    <h1 className="display-1 text-center">{title}</h1>
                </Container>
                <Form>
                    <Container className="col-lg-6 p-5 d-flex flex-column justify-content-center align-content-center mt-5">
                        <Form.Text className="text-center">Guest Control of Playback State</Form.Text>
                        <Form.Group className="mt-3 d-flex justify-content-around" controlId="formPlaybackControl" onChange={this.handleGuestCanPauseChange}>
                            <Form.Check name={"control1"} type={'radio'} value={true} checked={this.state.guest_can_pause === true} label={'Play/Pause'}/>
                            <Form.Check name={"control1"} type={'radio'} value={false} checked={this.state.guest_can_pause === false} label={'No Control'}/>
                        </Form.Group>
                        <Form.Group className="my-4 text-center">
                            <Form.Control type="text" className="text-center" onChange={this.handleVotesChange} value={this.state.votes_to_skip}/>
                            <Form.Text>Votes to Skip Song</Form.Text>
                        </Form.Group>
                        {this.props.update ? this.renderUpdateButtons() : this.renderCreateButtons()}
                    </Container>
                </Form>
            </Container>
    )};
}



export default withNavigation(CreateRoomPage)