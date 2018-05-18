# Create your views here.
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views import generic
from rest_framework.response import Response
from rest_framework import status
from django.utils.translation import ugettext as _

from django.shortcuts import get_object_or_404

# Create your views here.
def index(request):
    """
    index()
    """

    contexts = {}

    # 現在ログインしている?
    if request.user.is_authenticated:
        contexts['user'] = {"username": request.user.username, "user_id": request.user.id, "is_authenticated": True}

    return render(request,'world/index.html',contexts)