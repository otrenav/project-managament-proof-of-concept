# -*- coding: utf-8 -*-

from django.conf.urls import url

from rest_framework import routers

from . import viewsets
from . import constants


urlpatterns = [
    url(r'^save/$',
        viewsets.ProjectsManualViewSet.as_view()),
    url(r'^assigned-tasks/(?P<username>\w+)/$',
        viewsets.AssignedTasksViewSet.as_view()),
    url(r'^custom-projects/(?P<project_id>\w+)/$',
        viewsets.CustomProjectsViewSet.as_view()),
    url(r'^full-project/(?P<project_id>\w+)/$',
        viewsets.FullProjectViewSet.as_view()),
    url(r'^action/(?P<project_id>\w+)/$',
        viewsets.ProjectActionViewSet.as_view()),
    url(r'^active-projects/(?P<username>\w+)/$',
        viewsets.GetProjectsViewSet.as_view(),
        kwargs={'project_state': constants.IN_PROGRESS}),
    url(r'^submitted-projects/(?P<username>\w+)/$',
        viewsets.GetProjectsViewSet.as_view(),
        kwargs={'project_state': constants.SUBMITTED}),
    url(r'^recommended-projects/(?P<username>\w+)/$',
        viewsets.GetProjectsViewSet.as_view(),
        kwargs={'project_state': constants.RECOMMENDED}),
    url(r'^approved-projects/(?P<username>\w+)/$',
        viewsets.GetProjectsViewSet.as_view(),
        kwargs={'project_state': constants.APPROVED}),
    url(r'^denied-projects/(?P<username>\w+)/$',
        viewsets.GetProjectsViewSet.as_view(),
        kwargs={'project_state': constants.DENIED}),
]

router = routers.DefaultRouter()
router.register(r'projects', viewsets.ProjectsViewSet)
router.register(r'tasks', viewsets.TasksViewSet)
router.register(r'resources', viewsets.ResourcesViewSet)
router.register(r'deliverables', viewsets.DeliverablesViewSet)
router.register(r'staff', viewsets.StaffViewSet)
router.register(r'comments', viewsets.CommentsViewSet)
router.register(r'recomendation', viewsets.RecommendationsViewSet)

urlpatterns += router.urls
