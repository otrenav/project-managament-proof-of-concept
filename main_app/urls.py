# -*- coding: utf-8 -*-

from django.views.generic.base import TemplateView
from django.conf.urls import include, url
from django.views.static import serve
from django.contrib import admin


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^users/', include('users.urls', namespace='users')),
    url(r'^projects/', include('projects.urls', namespace='projects')),
    url(r'^angular/static/(?P<path>.*)$', serve, kwargs={'document_root': 'angular'}),
    url(r'^.*$', TemplateView.as_view(template_name='index.html')),
    url(r'^$', TemplateView.as_view(template_name='index.html'))
]

