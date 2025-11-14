from django.db import models
from django.contrib.auth.models import User

class Professor(User):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    ## era bom ter o cref do professor
    def __str__(self):
        return self.user.first_name


class Aluno(User):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return self.user.first_name


class FichaDeDados(models.Model):
    aluno = models.OneToOneField(Aluno, on_delete=models.CASCADE, primary_key=True, verbose_name= "Aluno", related_name='fichadedados')

    peso = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Peso (Kg)")
    altura = models.DecimalField(max_digits=3, decimal_places=2, verbose_name="Altura (m)")
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