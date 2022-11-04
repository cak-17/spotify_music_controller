from django.db import models

class SpotifyToken(models.Model):
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=150)
    access_token = models.CharField(max_length=150)
    expires_in = models.DateTimeField(null=True)
    token_type = models.CharField(max_length=50)

    def __str__(self):
        return f"user: {self.user}, refresh: {self.refresh_token}, access: {self.access_token}, expires: {self.expires_in}, type: {self.token_type}"