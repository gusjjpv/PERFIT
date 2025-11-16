from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Professor, Aluno

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','first_name', 'last_name', 'username', 'email')


class ProfessorSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Professor
        fields = ('user', 'cref')
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()

        instance.cref = validated_data.get('cref', instance.cref)
        instance.save()
        return instance


class ProfessorCreateSerializer(serializers.ModelSerializer):
    # Puxamos os campos do User para este serializer
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    email = serializers.EmailField(write_only=True)
    first_name = serializers.CharField(write_only=True, required=False, default='')

    class Meta:
        model = Professor
        fields = ('cref', 'username', 'password', 'email', 'first_name')

    def create(self, validated_data):
        # 1. Separa os dados do User
        user_data = {
            'username': validated_data.pop('username'),
            'password': validated_data.pop('password'),
            'email': validated_data.pop('email'),
            'first_name': validated_data.pop('first_name'),
        }
        user = User.objects.create_user(**user_data)

        professor = Professor.objects.create(user=user, **validated_data)
        return professor


class AlunoSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    professor = ProfessorSerializer(read_only=True) 

    class Meta:
        model = Aluno
        fields = ('user', 'professor')

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()
        return super().update(instance, validated_data)


class AlunoCreateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    email = serializers.EmailField(write_only=True)
    first_name = serializers.CharField(write_only=True, required=False, default='')
    

    class Meta:
        model = Aluno
        fields = ('username', 'password', 'email', 'first_name')

    def create(self, validated_data):
        user_data = {
            'username': validated_data.pop('username'),
            'password': validated_data.pop('password'),
            'email': validated_data.pop('email'),
            'first_name': validated_data.pop('first_name'),
        }
        user = User.objects.create_user(**user_data)

        request = self.context.get('request')
        professor_logado = request.user.professor
        
        aluno = Aluno.objects.create(user=user, professor=professor_logado, **validated_data)
        return aluno