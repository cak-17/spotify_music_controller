import React from 'react';

import { withParamsAndNav } from '../hocs';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

class Room extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
        }

        this.roomCode = this.props.params.roomCode
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.getRoomDetails();
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    }

    getRoomDetails() {
        fetch('/api/get-room' + '?code=' + this.roomCode)
            .then(response => {
                if (!response.ok) {
                    console.log(this.props) 
                    this.props.leaveRoomCallback();
                }
                console.log(this.props)
                return response.json()})
            .then(data => {
                console.log(data)
                this.setState({
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host
                })
            })
    }

    leaveButtonPressed() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        }
        fetch('api/leave-room', requestOptions).then(_response => {
            this.props.leaveRoomCallback();
            this.props.navigate('/')
        })
    }

    render() {
        return (
            <div>
                <h3>{this.roomCode}</h3>
                <p>Votes: {this.state.votesToSkip}</p>
                <p>Guest Can Pause: {this.state.guestCanPause.toString()}</p>
                <p>Host: {this.state.isHost.toString()}</p>
                <Button className="btn btn-danger" onClick={this.leaveButtonPressed}>Leave Room</Button> 
            </div>
        );
    }
}

export default Room;