# -*- coding: utf-8 -*-

from django.contrib.auth import get_user_model

from rest_framework import permissions, viewsets
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from . import serializers

USER_MODEL = get_user_model()


class CreateUserViewSet(CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.UserSerializer
    model = USER_MODEL


class GetUserInfoViewSet(APIView):

    permission_classes = [permissions.AllowAny]

    def get(self, request, username=None):
        user = USER_MODEL.objects.get(username=username)
        groups = user.groups.values_list('name', flat=True)
        return(Response({
            'id': user.id,
            'groups': groups
        }))


class GetUserListViewSet(APIView):

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        user_objects = USER_MODEL.objects.values()
        users = [
            {'username': user['username'], 'id': user['id']}
            for user in user_objects
        ]
        return(Response(users))


class UserViewSet(viewsets.ModelViewSet):
    queryset = USER_MODEL.objects.all()
    serializer_class = serializers.UserSerializer
