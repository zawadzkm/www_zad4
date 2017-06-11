from .views import *
from rest_framework.authtoken import views
from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token, refresh_jwt_token

urlpatterns = [
    url(r'^countries/$', CountryListAPIView.as_view(), name='list_country'),
    url(r'^countries/(?P<name>[\w-]+)$', CountryDetailAPIView.as_view(), name='detail_country'),
    url(r'^voivodeships/$', VoivodeshipListAPIView.as_view(), name='list_voivodeship'),
    url(r'^voivodeships/(?P<no>[\d]+)$', VoivodeshipDetailAPIView.as_view(), name='detail_voivodeship'),
    url(r'^districts/$', DistrictListAPIView.as_view(), name='list_district'),
    url(r'^districts/(?P<no>[\d]+)$', DistrictDetailAPIView.as_view(), name='detail_district'),
    url(r'^communes/$', CommuneListAPIView.as_view(), name='list_district'),
    url(r'^communes/(?P<code>[\d]+)$', CommuneDetailAPIView.as_view(), name='detail_district'),
    url(r'^votes/(?P<id>[\d]+)$', VoteDetailAPIView.as_view(), name='detail_vote'),
    url(r'^csearch/$', CommuneSearchList.as_view(), name='csearch'),
    url(r'^vsearch/$', VoivodeshipSearchList.as_view(), name='vsearch'),
    url(r'^dsearch/$', DistrictSearchList.as_view(), name='dsearch'),
    url(r'^ccsearch/$', CircuitSearchList.as_view(), name='ccsearch'),
    url(r'^token-auth/', obtain_jwt_token),
    url(r'^token-verify/', verify_jwt_token),
    url(r'^token-refresh/', refresh_jwt_token),
    url(r'^token-logout/', logout_token)
]