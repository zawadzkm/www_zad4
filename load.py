import os, pandas, django, time, pkg_resources
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "www_zad4.settings")
django.setup()

from election.models import Voivodeship, District, Commune, Circuit, Candidate, Vote, Country

df = pandas.read_csv(pkg_resources.resource_filename('data', 'data.csv'), sep=";")

CANDIDATES = ["Dariusz Maciej GRABOWSKI", "Piotr IKONOWICZ", "Jarosław KALINOWSKI", "Janusz KORWIN-MIKKE", "Marian KRZAKLEWSKI", "Aleksander KWAŚNIEWSKI", "Andrzej LEPPER", "Jan ŁOPUSZAŃSKI", "Andrzej Marian OLECHOWSKI", "Bogdan PAWŁOWSKI", "Lech WAŁĘSA", "Tadeusz Adam WILECKI"]

cands = {}

for n in (CANDIDATES):
    cand = Candidate.objects.get_or_create(name=n)
    cands[n] = cand

start_time = time.time()

#p=Country.objects.get(name="Polska")
#p.delete()

gr = df[["Uprawnieni", "Wydanekarty", "Oddane", "Wazne", "Niewazne"]].sum()

p = Country.objects.get_or_create(name="Polska", entitled=gr["Uprawnieni"], cards=gr["Wydanekarty"], votes=gr["Oddane"], valid=gr["Wazne"], invalid=gr["Niewazne"])

i=0
for i, row in df.iterrows():
    i+=1
    if i%1000 == 0:
        print(i)

    v = Voivodeship.objects.filter(no=row["Nrwoj"])
    if not v:
        gr = df[df["Nrwoj"] == row["Nrwoj"]][["Uprawnieni", "Wydanekarty", "Oddane", "Wazne", "Niewazne"]].sum()
        v = Voivodeship.objects.get_or_create(country=p[0], no=row["Nrwoj"], name=row["Wojewodztwo"], entitled=gr["Uprawnieni"], cards=gr["Wydanekarty"], votes=gr["Oddane"], valid=gr["Wazne"], invalid=gr["Niewazne"])

    d = District.objects.filter(no=row["Nrokr"])
    if not d:
        gr = df[df["Nrokr"] == row["Nrokr"]][["Uprawnieni", "Wydanekarty", "Oddane", "Wazne", "Niewazne"]].sum()
        d = District.objects.get_or_create(voivodeship=v[0], no=row["Nrokr"], name=row["Okreg"], entitled=gr["Uprawnieni"], cards=gr["Wydanekarty"], votes=gr["Oddane"], valid=gr["Wazne"], invalid=gr["Niewazne"])

    c = Commune.objects.filter(code=row["Kodgminy"])
    if not c:
        gr = df[df["Kodgminy"] == row["Kodgminy"]][["Uprawnieni", "Wydanekarty", "Oddane", "Wazne", "Niewazne"]].sum()
        c = Commune.objects.get_or_create(district=d[0], name=row["Gmina"], code=row["Kodgminy"], entitled=gr["Uprawnieni"], cards=gr["Wydanekarty"], votes=gr["Oddane"], valid=gr["Wazne"], invalid=gr["Niewazne"])

    cc = Circuit.objects.create(commune=c[0], no=row["Nrobw"], address=row["Adres"], entitled=row["Uprawnieni"], cards=row["Wydanekarty"], votes=row["Oddane"], valid=row["Wazne"], invalid=row["Niewazne"])

    objs = [
        Vote(candidate=cands[n][0], circuit=cc, number=row[n]
              ) for n in CANDIDATES
    ]
    Vote.objects.bulk_create(objs)

print("load %s seconds" % round(time.time() - start_time, 2))

