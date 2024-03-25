from django.db import models

class Movie(models.Model):
        


    def __str__(self):
        return self.title
