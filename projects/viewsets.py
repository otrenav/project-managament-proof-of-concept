# -*- coding: utf-8 -*-

from django.db import transaction
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, permissions

from . import models
from . import constants
from . import serializers


class ProjectsManualViewSet(APIView):

    @transaction.atomic
    def post(self, request):
        dictt = {'status': 'ok'}
        project_dict = request.data.get('project', None)
        username = request.data.get('username', None)
        user = User.objects.get(username=username)
        self._save_project(user, project_dict)
        return(Response(dictt))

    def _save_project(self, user, project_dict):
        project = self._save_base(user, project_dict)
        tasks = self._saveTasks(project, project_dict['tasks'])
        self._save_resources(tasks, project_dict['resources'])
        self._save_deliverables(project, project_dict['deliverables'])
        self._save_staffs(user, tasks, project_dict['staffs'])

    def _save_base(self, user, project_dict):
        base = project_dict['base']
        project_id = project_dict.get('id', False)
        if project_id:
            project = models.Project.objects.get(id=project_id)
            project.creator = user
            project.name = base['name']
            project.objective = base['objective']
            project.background = base['background']
        else:
            project = models.Project.objects.create(
                creator=user,
                name=base['name'],
                objective=base['objective'],
                background=base['background']
            )
        project.save()
        return(project)

    def _saveTasks(self, project, tasks):
        models.Task.objects.filter(project__id=project.id).delete()
        task_objects = []
        for task in tasks:
            t = models.Task.objects.create(
                project=project,
                name=task['name'],
                start=task['start'],
                end=task['end']
            )
            task_objects.append(t)
        return(task_objects)

    def _save_resources(self, tasks, resources):
        task_ids = [task.id for task in tasks]
        models.Resource.objects.filter(task__id__in=task_ids).delete()
        for resource in resources:
            models.Resource.objects.create(
                task=tasks[int(resource['task'])],
                details=resource['details'],
                justification=resource['justification']
            )

    def _save_deliverables(self, project, deliverables):
        models.Deliverable.objects.filter(project__id=project.id).delete()
        for deliverable in deliverables:
            models.Deliverable.objects.create(
                project=project,
                description=deliverable['description']
            )

    def _save_staffs(self, user, tasks, staffs):
        task_ids = [task.id for task in tasks]
        user_ids = [staff['user'] for staff in staffs]
        models.Staff.objects.filter(
            user__id__in=user_ids,
            task__id__in=task_ids
        ).delete()
        for staff in staffs:
            models.Staff.objects.create(
                user=User.objects.get(id=staff['user']),
                task=tasks[int(staff['task'])],
                hours=staff['hours'],
                role=staff['role']
            )


class CustomProjectsViewSet(APIView):

    # TODO: Ultimately this should be removed for security
    permission_classes = [permissions.AllowAny]

    def get(self, request, project_id):
        self.project = (
            models.Project.objects.get(id=project_id).__dict__
        )
        self._translate_state()
        self._translate_creator()
        self._get_recommenders()
        self._get_comments()
        return(Response(self.project))

    def _translate_state(self):
        self.project['state_text'] = self._get_state_text()
        if '_state' in self.project:
            del self.project['_state']

    def _get_state_text(self):
        for status in constants.PROGRESS_CHOICES:
            if self.project['state'] == status[0]:
                return status[1]
        raise ValueError("Could not find project state {}".format(
            self.project['state']
        ))

    def _translate_creator(self):
        self.project['creator'] = (
            User.objects.get(id=self.project['creator_id']).username
        )
        if 'creator_id' in self.project:
            del self.project['creator_id']

    def _get_comments(self):
        comment_objects = models.Comment.objects.filter(
            project=models.Project.objects.get(
                id=self.project['id']
            )
        ).values('user_id', 'action', 'comment', 'date')
        comments = []
        for comment in comment_objects:
            comments.append({
                'user': User.objects.get(id=comment['user_id']).username,
                'action': self._translate_action_id(comment['action']),
                'comment': comment['comment'],
                'date': comment['date'].strftime("%B %d, %Y")
            })
        self.project['comments'] = comments

    def _translate_action_id(self, action_id):
        for action in constants.ACTION_CHOICES:
            if action_id == action[0]:
                return(action[1])
        raise ValueError("Unrecognized action")

    def _get_recommenders(self):
        recommenders = models.Recommendation.objects.filter(
            project=models.Project.objects.get(
                id=self.project['id']
            )
        ).values_list('user__username', flat=True)
        self.project['recommenders'] = recommenders


class FullProjectViewSet(APIView):

    # TODO: Ultimately this should be removed for security
    permission_classes = [permissions.AllowAny]

    def get(self, request, project_id):
        base = self._get_base(project_id)
        tasks = self._get_tasks(project_id)
        resources = self._get_resources(project_id)
        deliverables = self._get_deliverables(project_id)
        staffs = self._get_staffs(project_id)
        json = {
            "base": base,
            "tasks": tasks,
            "resources": resources,
            "deliverables": deliverables,
            "staffs": staffs
        }
        # full_project = {'it': 'worked!'}
        return(Response(json))

    def _get_base(self, project_id):
        self.project = models.Project.objects.get(id=project_id)
        serialization = {
            "name": self.project.name,
            "objective": self.project.objective,
            "background": self.project.background
        }
        return(serialization)

    def _get_tasks(self, project_id):
        self.tasks = models.Task.objects.filter(project=self.project)
        serialization = []
        for task in self.tasks:
            serialization.append({
                "name": task.name,
                "start": task.start,
                "end": task.end
            })
        return(serialization)

    def _get_resources(self, project_id):
        serialization = []
        for i, task in enumerate(self.tasks):
            resources = models.Resource.objects.filter(task=task)
            for resource in resources:
                serialization.append({
                    "task": i,
                    "details": resource.details,
                    "justification": resource.justification
                })
        return(serialization)

    def _get_deliverables(self, project_id):
        serialization = []
        deliverables = models.Deliverable.objects.filter(project=self.project)
        for deliverable in deliverables:
            serialization.append({
                "description": deliverable.description
            })
        return(serialization)

    def _get_staffs(self, project_id):
        serialization = []
        for i, task in enumerate(self.tasks):
            staffs = models.Staff.objects.filter(task=task).values()
            for staff in staffs:
                serialization.append({
                    "task": i,
                    "user": staff['user_id'],
                    "role": staff['role'],
                    "hours": staff['hours']
                })
        return(serialization)


class AssignedTasksViewSet(APIView):

    # TODO: Ultimately this should be removed for security
    permission_classes = [permissions.AllowAny]

    def get(self, request, username=None):
        tasks = (
            models.Staff.objects
            .filter(user=User.objects.get(username=username))
            .values('task__name', 'role', 'task__start', 'task__end', 'hours')
        )
        return(Response(tasks))


class GetProjectsViewSet(APIView):

    # TODO: Ultimately this should be removed for security
    permission_classes = [permissions.AllowAny]

    def get(self, request, username=None, project_state=None):
        """Get projects for a username given the project state

        If the username corresponds to a normal user, then return
        only those projects associated to the user. If the username
        corresponds to a council member or an approver member, then
        return all the projects in the system.
        """
        if self._is_approver(username) or self._is_council(username):
            projects = (
                models.Project.objects
                .filter(state=project_state)
                .values('id', 'name', 'state')
            )
        else:  # Normal user
            projects = (
                models.Project.objects
                .filter(
                    creator=User.objects.get(username=username),
                    state=project_state
                )
                .values('id', 'name', 'state')
            )
        projects = self._translate_state(projects)
        return(Response(projects))

    def _is_approver(self, username):
        # NOTE: if the group name changes, this hardcoded
        #       group name should change accordingly
        user = User.objects.get(username=username)
        return('Approvers' in user.groups.values_list('name', flat=True))

    def _is_council(self, username):
        # NOTE: if the group name changes, this hardcoded
        #       group name should change accordingly
        user = User.objects.get(username=username)
        return('Council' in user.groups.values_list('name', flat=True))

    def _translate_state(self, projects):
        new_projects = []
        for project in projects:
            project['state'] = self._get_state_text(project['state'])
            new_projects.append(project)
        return(new_projects)

    def _get_state_text(self, state_id):
        for status in constants.PROGRESS_CHOICES:
            if state_id == status[0]:
                return status[1]
        raise ValueError("Could not find `state_id` {}".format(state_id))


class ProjectActionViewSet(APIView):

    # TODO: Ultimately this should be removed for security
    permission_classes = [permissions.AllowAny]

    def post(self, request, project_id):
        response = {'status': 'ok'}
        project = models.Project.objects.get(id=project_id)
        username = request.data.get('username', False)
        comment = request.data.get('comment', False)
        action_text = request.data.get('action', False)
        action_id = self._translate_action_text(action_text)
        user = User.objects.get(username=username)

        new_comment_instance = models.Comment.objects.create(
            user=user,
            project=project,
            comment=comment,
            action=action_id
        )
        new_comment_instance.save()

        if action_text == "Submit":
            project.state = constants.SUBMITTED
        elif action_text == "Recommend":
            recommendation = models.Recommendation.objects.create(
                project=project,
                user=user
            )
            recommendation.save()
            number_of_recommendations = (
                models.Recommendation.objects.filter(project=project).count()
            )
            if number_of_recommendations >= 3:
                project.state = constants.RECOMMENDED
        elif action_text == "Return":
            #
            # NOTE: I'm assuming that if a project is
            #       returned, then all the previous
            #       recommendations from the council
            #       should be removed so that it's
            #       reviewed again by the full council
            #
            models.Recommendation.objects.filter(
                project=project
            ).delete()
            project.state = constants.IN_PROGRESS
        elif action_text == "Approve":
            project.state = constants.APPROVED
        elif action_text == "Deny":
            #
            # NOTE: I'm assuming that if a project is
            #       denied, the recommendations by
            #       council members should be kept
            #       recorded for historical reference
            #
            project.state = constants.DENIED
        else:
            raise ValueError("Unrecognized action")

        project.save()
        return(Response(response))

    def _translate_action_text(self, action_text):
        for action in constants.ACTION_CHOICES:
            if action_text == action[1]:
                return(action[0])
        raise ValueError("Action text not found")


class ProjectsViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = models.Project.objects.all()
    serializer_class = serializers.ProjectSerializer


class TasksViewSet(viewsets.ModelViewSet):
    queryset = models.Task.objects.all()
    serializer_class = serializers.TaskSerializer


class ResourcesViewSet(viewsets.ModelViewSet):
    queryset = models.Resource.objects.all()
    serializer_class = serializers.ResourceSerializer


class DeliverablesViewSet(viewsets.ModelViewSet):
    queryset = models.Deliverable.objects.all()
    serializer_class = serializers.DeliverableSerializer


class StaffViewSet(viewsets.ModelViewSet):
    queryset = models.Staff.objects.all()
    serializer_class = serializers.StaffSerializer


class CommentsViewSet(viewsets.ModelViewSet):
    queryset = models.Comment.objects.all()
    serializer_class = serializers.CommentSerializer


class RecommendationsViewSet(viewsets.ModelViewSet):
    queryset = models.Recommendation.objects.all()
    serializer_class = serializers.RecommendationSerializer
