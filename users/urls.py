# -*- coding: utf-8 -*-

from django.conf.urls import url

from rest_framework import routers
from rest_framework_jwt.views import obtain_jwt_token

from . import viewsets


urlpatterns = [
    url(r'^login/$',
        obtain_jwt_token),
    url(r'^get-user-info/(?P<username>\w+)/$',
        viewsets.GetUserInfoViewSet.as_view()),
    url(r'^get-user-list/$',
        viewsets.GetUserListViewSet.as_view()),
    url(r'^save/$',
        viewsets.CreateUserViewSet.as_view()),
]

router = routers.DefaultRouter()
router.register(r'users', viewsets.UserViewSet)

urlpatterns += router.urls
