import os, django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "www_zad4.settings")
django.setup()

from election.models import Commune, Circuit

# from django.contrib.auth.models import User
#
# user = User.objects.create_user('test1', '', 'test1')
# user.first_name = "User"
# user.last_name = 'Test1'
# user.save()

c = Circuit.objects.filter(no=2)
print(c[0].candidates[0].vote_id)
