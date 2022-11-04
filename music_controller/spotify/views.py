import base64
from django.shortcuts import redirect
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .credentials import CLIENT_ID, CLIENT_SEC, REDIRECT_URI
from .util import update_or_create_user_tokens, is_spotify_authenticated, get_user_tokens, logger


class AuthURL(APIView):
    def get(self, request, format=None):

        # defines what info we want to access from spotify
        scopes = "user-read-playback-state user-modify-playback-state user-read-currently-playing"

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)

def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')
    logger.error(f"---- error: {error}")
    credentials = base64.b64encode(f"{CLIENT_ID}:{CLIENT_SEC}".encode('utf-8'))
    authorization = credentials.decode('utf-8')
    
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": f"Basic {authorization}"
    }
    body = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,

    }
    response = post('https://accounts.spotify.com/api/token/', data=body, headers=headers).json()



    access_token = response.get("access_token")
    token_type = response.get("token_type")
    refresh_token = response.get("refresh_token")
    expires_in = response.get("expires_in")
    response_error = response.get('error')
    logger.debug(access_token)
    logger.debug(token_type)
    logger.debug(expires_in)
    logger.debug(refresh_token)
    logger.error(f"---- response error: {response_error}")

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(
        request.session.session_key, access_token, token_type, expires_in, refresh_token)

    return redirect('frontend:')


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        return Response({'Status': is_authenticated}, status=status.HTTP_200_OK)