# -*- coding: utf-8 -*-

from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

from django_markdown.models import MarkdownField

from .constants import PROGRESS_CHOICES, ACTION_CHOICES


class Project(models.Model):
    creator = models.ForeignKey(
        User
    )
    recommenders = models.ManyToManyField(
        User,
        through='Recommendation',
        related_name='recommended_by'
    )
    name = models.CharField(
        max_length=30
    )
    state = models.IntegerField(
        choices=PROGRESS_CHOICES,
        default=1
    )
    objective = MarkdownField()
    background = MarkdownField()

    def __unicode__(self):
        return(self.name)

    def __str__(self):
        return(unicode(self).encode('utf-8'))


class Task(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE
    )
    name = models.CharField(
        max_length=30
    )
    start = models.DateField()
    end = models.DateField()

    def __unicode__(self):
        return(self.name)

    def __str__(self):
        return(unicode(self).encode('utf-8'))


class Resource(models.Model):
    # This was: ResourcesRequired
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE
    )
    details = models.CharField(
        max_length=500
    )
    justification = models.CharField(
        max_length=500
    )

    def __unicode__(self):
        return(self.details + "(" + self.task.name + ")")

    def __str__(self):
        return(unicode(self).encode('utf-8'))


class Deliverable(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE
    )
    description = models.CharField(
        max_length=500
    )

    def __unicode__(self):
        return(self.description + "(" + self.project.name + ")")

    def __str__(self):
        return(unicode(self).encode('utf-8'))


class Staff(models.Model):
    # This was: UsersAssignedTask
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE
    )
    role = models.CharField(
        max_length=30
    )
    hours = models.IntegerField()

    def __unicode__(self):
        return(self.task.name + " / " + self.role + " / " + self.user)

    def __str__(self):
        return(unicode(self).encode('utf-8'))


class Comment(models.Model):
    # This was: ProjectProposalComments
    project = models.ForeignKey(
        Project
    )
    user = models.ForeignKey(
        User
    )
    action = models.IntegerField(
        choices=ACTION_CHOICES
    )
    comment = models.CharField(
        max_length=300
    )
    date = models.DateTimeField(
        auto_now=True
    )

    def __unicode__(self):
        return(self.comment + "(" + self.project.name + " / " + self.user + ")")

    def __str__(self):
        return(unicode(self).encode('utf-8'))


class Recommendation(models.Model):
    # Many-to-many relation
    # This was: UserProjectRecommendations
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    def __unicode__(self):
        return(self.project.name + " / " + self.user)

    def __str__(self):
        return(unicode(self).encode('utf-8'))
