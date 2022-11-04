import React from 'react';
import { withParamsAndNav } from '../hocs';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import CreateRoomPage from "./CreateRoomPage"


class Room extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
            spotifyAuthenticated: false,
        }

        this.roomCode = this.props.params.roomCode

        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);

        this.authenticateSpotify = this.authenticateSpotify.bind(this);

        this.getRoomDetails();
    }

    getRoomDetails() {
        fetch('/api/get-room' + '?code=' + this.roomCode)
            .then(response => {
                if (!response.ok) {
                    this.props.leaveRoomCallback();
                }
                return response.json()})
            .then(data => {
                this.setState({
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host
                })
                if (this.state.isHost) {
                    this.authenticateSpotify();
                }
            })
    }

    authenticateSpotify() {
        fetch("/spotify/is-authenticated")
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.setState({spotifyAuthenticated: data.status});
                if (!data.status) {
                    fetch('/spotify/get-auth-url')
                        .then(response => response.json())
                        .then(data => {
                            window.location.replace(data.url)
                        });
                }
            });
    }

    leaveButtonPressed() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        }
        fetch('/api/leave-room', requestOptions).then(_response => {
            this.props.leaveRoomCallback();
            this.props.navigate('/')
        })
    }

    updateShowSettings(value) {
        this.setState({
            showSettings: value,
        })
    }

    renderSettings() {
        return (
        <Container>
            <div>
                <CreateRoomPage 
                    update={true} 
                    votesToSkip={this.state.votesToSkip} 
                    guestCanPause={this.state.guestCanPause} 
                    roomCode={this.roomCode} 
                    updateCallback={this.getRoomDetails}/>
            </div>
            <div>
                <Button onClick={() => this.updateShowSettings(false)}>Close</Button>
            </div>
        </Container>
        );
    }

    renderSettingsButton() {
        return (
            <Container className="mb-3">
                <Button onClick={() => this.updateShowSettings(true)}>Settings</Button>
            </Container>
        );
    }

    render() {
        if (this.state.showSettings) {
            return this.renderSettings();
        }
        return (
            <div>
                <h3>{this.roomCode}</h3>
                <p>Votes: {this.state.votesToSkip}</p>
                <p>Guest Can Pause: {this.state.guestCanPause.toString()}</p>
                <p>Host: {this.state.isHost.toString()}</p>
                {this.state.isHost ? this.renderSettingsButton() : null}
                <Button className="btn btn-danger" onClick={this.leaveButtonPressed}>Leave Room</Button> 
            </div>
        );
    }
}

export default withParamsAndNav(Room);