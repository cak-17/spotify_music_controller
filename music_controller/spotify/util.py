import logging

from datetime import timedelta

from django.utils import timezone
from requests import Request, post

from .credentials import CLIENT_ID, CLIENT_SEC
from .models import SpotifyToken

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s %(lineno)-4s :%(levelname)s - %(message)s",
    datefmt="[%H:%M]",
    filemode="w",
    filename="spotify/logs/spotify.log"
    )
logger = logging.getLogger(__name__)

def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else: 
        return None

def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)

    logger.debug(f"tokens: {tokens}")
    logger.debug(f"access_token: {access_token}")
    logger.debug(f"type: {token_type}")
    logger.debug(f"expires: {expires_in}")
    logger.debug(f"refresh: {refresh_token}")

    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token 
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=[
            'access_token',
            'refresh_token',
            'expires_in',
            'token_type'
        ])
    else:
        tokens = SpotifyToken(
            user=session_id,
            access_token=access_token,
            refresh_token=refresh_token,
            token_type=token_type,
            expires_in=expires_in)
        tokens.save()

def refresh_spotify_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token

    logger.debug(f"refresh_token from get_user: {refresh_token}")

    response = post("https://accounts.spotify.com/api/token", data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SEC
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    refresh_token = response.get('refresh_token')
    
    logger.debug(f"access_token: {access_token}")
    logger.debug(f"type: {token_type}")
    logger.debug(f"expires: {expires_in}")
    logger.debug(f"refresh: {refresh_token}")

    update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token)

def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)

    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(session_id)
        return True
    return False

