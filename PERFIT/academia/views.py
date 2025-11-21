from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Professor, Aluno
from .serializers import ProfessorSerializer, ProfessorCreateSerializer, AlunoSerializer, AlunoCreateSerializer
from .permissions import IsProfessor
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from drf_spectacular.utils import extend_schema, OpenApiResponse

class ProfessoresAPIView(generics.ListCreateAPIView):
    queryset = Professor.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProfessorCreateSerializer
        return ProfessorSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()
    
    #sobrescrevendo os metodos para documentacao no swagger

    @extend_schema(
        summary="Lista todos os professores",
        description="Retorna todos os professores cadastrados no sistema. Requer autenticação.",
        responses=ProfessorSerializer(many=True)
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    #Documentação POST
    @extend_schema(
        summary="Cria um novo professor",
        request=ProfessorCreateSerializer,
        responses=OpenApiResponse(
            response=ProfessorSerializer,
            description="Professor criado com sucesso."
        ),
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class ProfessorAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    permission_classes = [IsAuthenticated]

    #sobrescrevendo os metodos para documentacao no swagger

    @extend_schema(
        summary="Busca professor por ID",
        description="Retorna os dados de um professor específico."
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        summary="Atualiza professor",
        description="Atualiza os dados do professor. Apenas usuários autenticados."
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @extend_schema(
        summary="Remove professor",
        description="Exclui o professor especificado."
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class AlunosAPIView(generics.ListCreateAPIView):
    queryset = Aluno.objects.all()
    permission_classes = [IsAuthenticated, IsProfessor]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AlunoCreateSerializer
        return AlunoSerializer
    
    #sobrescrevendo os metodos para documentacao no swagger

    @extend_schema(
        summary="Lista todos os alunos",
        description="Retorna todos os alunos cadastrados. Apenas professores podem acessar.",
        responses=AlunoSerializer(many=True)
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        summary="Cria um novo aluno",
        description=(
            "Cria um aluno vinculado automaticamente ao professor autenticado. "
            "Somente professores podem criar alunos."
        ),
        request=AlunoCreateSerializer,
        responses=OpenApiResponse(
            response=AlunoSerializer,
            description="Aluno criado com sucesso."
        ),
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class AlunoAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer
    permission_classes = [IsAuthenticated]

    #sobrescrevendo os metodos para documentacao no swagger

    @extend_schema(
        summary="Busca aluno por ID",
        description="Retorna os dados de um aluno específico."
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        summary="Atualiza aluno",
        description="Atualiza os dados de um aluno. Necessita autenticação."
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @extend_schema(
        summary="Remove aluno",
        description="Exclui o aluno especificado. Necessita autenticação."
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    #sobrescrevendo os metodos para documentacao no swagger
    
    @extend_schema(
        summary="Obter token JWT",
        description="Retorna o access token e refresh token para o usuário."
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)