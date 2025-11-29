from django.db import models
from django.contrib.auth.models import User
from datetime import date

class Professor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    cref = models.CharField(max_length=20, unique=True, null=True, blank=True, verbose_name="CREF")
    def __str__(self):
        return self.user.first_name


class Aluno(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    professor = models.ForeignKey(Professor, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Professor Responsavel", related_name="meus_alunos")
    ativo = models.BooleanField("Aluno Ativo?", default=True)

    ativo = models.BooleanField("Aluno Ativo?", default=True)

    def __str__(self):
        return self.user.first_name or self.user.username


class FichaDeDados(models.Model):
    aluno = models.OneToOneField(Aluno, on_delete=models.CASCADE, primary_key=True, verbose_name= "Aluno", related_name='fichadedados')

    peso = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name="Peso (Kg)")
    altura = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True, verbose_name="Altura (m)")
    imc = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, verbose_name="IMC")
    data_nascimento = models.DateField(null=True, blank=True, verbose_name="Data de Nascimento")
    idade = models.IntegerField(null=True, blank=True, verbose_name="Idade")

    objetivo = models.CharField(max_length=255, blank=True)
    profissao = models.CharField(max_length=50, blank=True)
    problema_saude = models.CharField(max_length=255, blank=True)

    def save(self, *args, **kwargs):
        if self.data_nascimento:
            today = date.today()
            self.idade = today.year - self.data_nascimento.year - (
                (today.month, today.day) < (self.data_nascimento.month, self.data_nascimento.day)
            )
        else:
            self.idade = None

        if self.peso and self.altura and self.altura > 0:
            self.imc = self.peso / (self.altura * self.altura)
        else:
            self.imc = None

        super().save(*args, **kwargs)

    def __str__(self):
        try:
            return f"Ficha de {self.aluno.user.first_name}"
        except (Aluno.DoesNotExist, User.DoesNotExist):
            return "Ficha (sem aluno)"


class AvaliacaoFisica(models.Model):
    
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, verbose_name="Aluno", related_name='AvaliacoesFisicas')

    data = models.DateTimeField(verbose_name="Data da avaliação", auto_now_add=True)
    peito = models.DecimalField("Peito (cm)", max_digits=5, decimal_places=2, blank=False)
    ombro = models.DecimalField("Ombro (cm)", max_digits=5, decimal_places=2, blank=False)
    braco_d = models.DecimalField("Braço Direito (cm)", max_digits=5, decimal_places=2, blank=False)
    braco_e = models.DecimalField("Braço Esquerdo (cm)", max_digits=5, decimal_places=2, blank=False)
    cintura = models.DecimalField("Cintura (cm)", max_digits=5, decimal_places=2, blank=False)
    quadril = models.DecimalField("Quadril (cm)", max_digits=5, decimal_places=2, blank=False)
    quadriceps_d = models.DecimalField("Quadríceps Direito (cm)", max_digits=5, decimal_places=2, blank=False)
    quadriceps_e = models.DecimalField("Quadríceps Esquerdo (cm)", max_digits=5, decimal_places=2, blank=False)
    panturrilha_d = models.DecimalField("Panturrilha Direita (cm)", max_digits=5, decimal_places=2, blank=False)
    panturrilha_e = models.DecimalField("Panturrilha Esquerda (cm)", max_digits=5, decimal_places=2, blank=False)

    class Meta:
        verbose_name = "Avaliação Física"
        verbose_name_plural = "Avaliações Físicas"
        # para a avaliacao mais recente apareca em cima
        ordering = ['-data']

    def __str__(self):
        try:
            return f"Avaliação de {self.aluno.user.first_name} em {self.data.strftime('%d/%m/%Y')}"
        except:
            return f"Avaliação em {self.data.strftime('%d/%m/%Y')}"

class MomentoChoices(models.TextChoices):
    ANTES = 'ANTES', 'Antes do Treino'
    DURANTE = 'DURANTE', 'Durante o Treino'
    DEPOIS = 'DEPOIS', 'Depois do Treino'

class AvaliacaoPa(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, verbose_name ="Aluno", related_name='avaliacoes_pa')

    data = models.DateTimeField(verbose_name='Data da avaliação', auto_now_add=True)

    paSistolica = models.IntegerField("PA Sistolica")
    paDiastolica = models.IntegerField("PA Diastolica")
    glicemia = models.IntegerField("Glicemia (mg/dL)", null=True, blank=True)
    momento = models.CharField(max_length=10, choices=MomentoChoices.choices)

    class Meta:
        verbose_name = "Avaliação de PA"
        verbose_name_plural = "Avaliações de PA"
        ordering = ['-data']

    def __str__(self):
        try:
            return f"PA de {self.aluno.user.first_name} em {self.data.strftime('%d/%m/%Y')}"
        except:
            return "Avaliação de PA"


class DiaSemana(models.TextChoices):
        SEGUNDA = 'SEG', 'Segunda-feira'
        TERCA = 'TER', 'Terça-feira'
        QUARTA = 'QUA', 'Quarta-feira'
        QUINTA = 'QUI', 'Quinta-feira'
        SEXTA = 'SEX', 'Sexta-feira'
        SABADO = 'SAB', 'Sábado'
        DOMINGO = 'DOM', 'Domingo'
        INDEFINIDO = 'IND', 'Sem dia fixo (Rotativo)'


class FichaTreino(models.Model):
    aluno = models.ForeignKey(
        Aluno, on_delete=models.CASCADE,
        related_name='fichas_de_treino',
        verbose_name="Aluno"
    )

    nome = models.CharField("Nome da Ficha", max_length=100)
    data_inicio = models.DateField("Data de Início", auto_now_add=True)
    data_fim = models.DateField("Data de Término", null=True, blank=True)
    ativa = models.BooleanField("Ficha Ativa?", default=True)
    observacoes = models.TextField("Observações Gerais", blank=True)

    def __str__(self):
        return f"{self.nome} - {self.aluno.user.first_name}"


class Treino(models.Model):
    ficha = models.ForeignKey(
        FichaTreino, 
        on_delete=models.CASCADE, 
        related_name='treinos',
        verbose_name="Ficha"
    )

    dia_semana = models.CharField(
        "Dia da Semana",
        max_length=3,
        choices=DiaSemana.choices,
        default=DiaSemana.INDEFINIDO,
        blank=True
    )

    titulo = models.CharField("Título do Treino", max_length=50)
    descricao = models.CharField("Descrição/Foco", max_length=100, blank=True)
    ordem = models.PositiveIntegerField("Ordem", default=1)

    class Meta:
        ordering = ['ordem']

    def __str__(self):
        return f"{self.titulo} - {self.ficha.nome}"


class Exercicio(models.Model):
    treino = models.ForeignKey(
        Treino, 
        on_delete=models.CASCADE, 
        related_name='exercicios',
        verbose_name="Treino"
    )

    nome = models.CharField("Nome do Exercício", max_length=100) 
    series = models.PositiveIntegerField("Séries")
    repeticoes = models.CharField("Repetições", max_length=20)
    descanso = models.CharField("Tempo de Descanso", max_length=20, blank=True)
    observacao = models.TextField("Observação Técnica", blank=True)

    def __str__(self):
        return self.nome
