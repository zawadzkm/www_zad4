from django.db import models
from django.db.models import Sum, Max

class Candidate(models.Model):
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField()

class Country(models.Model):
    name = models.CharField(max_length=50, unique=True)
    entitled = models.PositiveIntegerField()
    cards = models.PositiveIntegerField()
    votes = models.PositiveIntegerField()
    valid = models.PositiveIntegerField()
    invalid = models.PositiveIntegerField()

    @property
    def attendance(self):
        return round(self.votes/self.entitled*100, 2)

    @property
    def candidates(self):
        return Candidate.objects.annotate(votes=Sum('vote__number')).order_by('vote__candidate__order')


class Voivodeship(models.Model):
    no = models.PositiveIntegerField(unique=True)
    name = models.CharField(max_length=50)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='subareas')
    entitled = models.PositiveIntegerField()
    cards = models.PositiveIntegerField()
    votes = models.PositiveIntegerField()
    valid = models.PositiveIntegerField()
    invalid = models.PositiveIntegerField()

    @property
    def attendance(self):
        return round(self.votes/self.entitled*100, 2)

    @property
    def candidates(self):
        return Candidate.objects.filter(vote__circuit__commune__district__voivodeship=self).annotate(votes=Sum("vote__number"))

    def get_absolute_url(self):
        return "/{}".format(self.no)


class District(models.Model):
    no = models.PositiveIntegerField(unique=True)
    voivodeship = models.ForeignKey(Voivodeship, on_delete=models.CASCADE, related_name='subareas')
    name = models.CharField(max_length=50)
    entitled = models.PositiveIntegerField()
    cards = models.PositiveIntegerField()
    votes = models.PositiveIntegerField()
    valid = models.PositiveIntegerField()
    invalid = models.PositiveIntegerField()

    @property
    def attendance(self):
        return round(self.votes/self.entitled*100, 2)

    @property
    def candidates(self):
        return Candidate.objects.filter(vote__circuit__commune__district=self).annotate(votes=Sum("vote__number"))

    def get_absolute_url(self):
        return "/{}/{}".format(self.voivodeship.no, self.no)

class Commune(models.Model):
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name='subareas')
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=5, unique=True)
    entitled = models.PositiveIntegerField()
    cards = models.PositiveIntegerField()
    votes = models.PositiveIntegerField()
    valid = models.PositiveIntegerField()
    invalid = models.PositiveIntegerField()

    @property
    def attendance(self):
        return round(self.votes/self.entitled*100, 2)

    @property
    def candidates(self):
        return Candidate.objects.filter(vote__circuit__commune=self).annotate(votes=Sum("vote__number"))

    def get_absolute_url(self):
        return "/{}/{}/{}".format(self.district.voivodeship.no, self.district.no, self.code)

class Circuit(models.Model):
    no = models.PositiveIntegerField()
    commune = models.ForeignKey(Commune, on_delete=models.CASCADE, related_name='subareas')
    address = models.CharField(max_length=300)
    entitled = models.PositiveIntegerField()
    cards = models.PositiveIntegerField()
    votes = models.PositiveIntegerField()
    valid = models.PositiveIntegerField()
    invalid = models.PositiveIntegerField()

    @property
    def attendance(self):
        return round(self.votes/self.entitled*100, 2)

    @property
    def candidates(self):
        return Candidate.objects.filter(vote__circuit__id=self.id).annotate(votes=Sum("vote__number"), vote_id=Max("vote__id"))

class Vote(models.Model):
    number = models.PositiveIntegerField()
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE)
    circuit = models.ForeignKey(Circuit, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('candidate', 'circuit')