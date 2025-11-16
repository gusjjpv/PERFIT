from django.db import models
from django.contrib.auth.models import User

class Professor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    cref = models.CharField(max_length=20, unique=True, null=True, blank=True, verbose_name="CREF")
    def __str__(self):
        return self.user.first_name


class Aluno(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    professor = models.ForeignKey(Professor, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Professor Responsavel", related_name="meus_alunos")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")

    def __str__(self):
        return self.user.first_name or self.user.username


class FichaDeDados(models.Model):
    aluno = models.OneToOneField(Aluno, on_delete=models.CASCADE, primary_key=True, verbose_name= "Aluno", related_name='fichadedados')

    peso = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Peso (Kg)", null=True, blank=True)
    altura = models.DecimalField(max_digits=3, decimal_places=2, verbose_name="Altura (m)", null=True, blank=True)
    imc = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="IMC", null=True, blank=True)
    objetivo = models.CharField(max_length=255, blank=True)
    profissao = models.CharField(max_length=50, blank=True)
    problema_saude = models.CharField(max_length=255, blank=True)

    def save(self, *args, **kwargs):
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


