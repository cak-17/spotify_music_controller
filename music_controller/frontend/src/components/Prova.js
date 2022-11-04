import React from 'react';

export default class Prova extends React.Component {
    static defaultProps = {
        votesDef: 2,
        guests: false
    }
    constructor(props) {
        super(props);
        this.state = {
            votes: this.props.votesDef,
            guests: this.props.guests,
        }
    }
    render() {
        console.log(this.props)
        return (
            <>
                <h1>Prova</h1>
                <p>{this.state.votes}</p>
                <p>{this.state.guests.toString()}</p>
            </>
        )
    }
}