import React from  'react';
import { useParams, useNavigate } from 'react-router-dom';

export function withNavigation(Component) {
    return props => <Component {...props} navigate={useNavigate()} />;
}

export function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
}

export function withParamsAndNav(Component) {
    return props => <Component {...props} params={useParams()} navigate={useNavigate()} />;
}