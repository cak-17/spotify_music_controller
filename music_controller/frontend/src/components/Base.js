import React from 'react';
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
import HomePage from './HomePage';
import Room from './Room';

export default function Base() {
return(
    <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<HomePage />}/>
            <Route path="/join" element={<RoomJoinPage />}/>
            <Route path="/create" element={<CreateRoomPage />} />
            <Route path="/room/:roomCode" element={<Room />}/>
        </Routes>
    </BrowserRouter>
)}