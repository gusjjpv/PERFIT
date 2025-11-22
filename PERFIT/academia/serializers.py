from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Professor, Aluno, FichaTreino, Treino, Exercicio, FichaDeDados

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
        fields = ('user', 'professor', 'ativo')

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user_serializer = UserSerializer(instance.user, data=user_data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()

        instance.ativo = validated_data.get('ativo', instance.ativo)
        instance.save()

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
    

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data['user_id'] = self.user.id
        data['username'] = self.user.username
        data['first_name'] = self.user.first_name
        
        if hasattr(self.user, 'professor'):
            data['role'] = 'professor'
        elif hasattr(self.user, 'aluno'):
            data['role'] = 'aluno'
        else:
            data['role'] = 'admin'

        return data  


class ExercicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercicio
        fields = ['id', 'nome', 'series', 'repeticoes', 'descanso', 'observacao']


class TreinoSerializer(serializers.ModelSerializer):
    # Um treino tem vários exercícios
    exercicios = ExercicioSerializer(many=True) 

    class Meta:
        model = Treino
        fields = ['id', 'dia_semana','titulo', 'descricao', 'ordem', 'exercicios']


class FichaTreinoSerializer(serializers.ModelSerializer):
    # Uma ficha tem vários treinos
    treinos = TreinoSerializer(many=True)

    class Meta:
        model = FichaTreino
        fields = ['id', 'aluno', 'nome', 'data_inicio', 'data_fim', 'ativa', 'observacoes', 'treinos']

    def validate_aluno(self, value):
        #Impede que o professor crie ficha para um aluno que não é dele.
       
        user = self.context['request'].user
        
        if user.is_superuser:
            return value
        
        if value.professor.user != user:
             raise serializers.ValidationError("Você não tem permissão para criar fichas para este aluno.")
        
        return value

    def create(self, validated_data):
        treinos_data = validated_data.pop('treinos')

        ficha = FichaTreino.objects.create(**validated_data)
        
        for treino_data in treinos_data:
            exercicios_data = treino_data.pop('exercicios')
            
            treino = Treino.objects.create(ficha=ficha, **treino_data)
            
            for exercicio_data in exercicios_data:
                Exercicio.objects.create(treino=treino, **exercicio_data)
        
        return ficha


class FichaDeDadosSerializer(serializers.ModelSerializer):
    class Meta:
        model = FichaDeDados
        exclude = ['aluno']


class AlunoDetailSerializer(AlunoSerializer):
    fichadedados = FichaDeDadosSerializer(read_only=True)

    class Meta(AlunoSerializer.Meta):
        fields = AlunoSerializer.Meta.fields + ('fichadedados',)
