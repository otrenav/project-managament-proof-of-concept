# -*- coding: utf-8 -*-

from django.contrib.auth import get_user_model

from rest_framework import serializers

USER_MODEL = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = USER_MODEL.objects.create(username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return(user)

    class Meta:
        model = USER_MODEL
        fields = ('id', 'password', 'username')
