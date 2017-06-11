from rest_framework import serializers

from election.models import *

class CandidateListSerializer(serializers.Serializer):
    name = serializers.CharField()
    order = serializers.IntegerField()
    votes = serializers.IntegerField()

class CircuitCandidateListSerializer(serializers.Serializer):
    name = serializers.CharField()
    order = serializers.IntegerField()
    vote_id = serializers.IntegerField()
    votes = serializers.IntegerField()

class TopVoivodeshipSerializer(serializers.Serializer):
    no = serializers.IntegerField()
    name = serializers.CharField()


class TopDistrictSerializer(serializers.Serializer):
    no = serializers.IntegerField()
    name = serializers.CharField()
    voivodeship = TopVoivodeshipSerializer()


class SubareaListSerializer(serializers.Serializer):
    no = serializers.IntegerField()
    name = serializers.CharField()
    entitled = serializers.IntegerField()
    cards = serializers.IntegerField()
    votes = serializers.IntegerField()
    valid = serializers.IntegerField()
    invalid = serializers.IntegerField()
    attendance = serializers.FloatField()


class CommuneListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Commune
        fields = ['code', 'name', 'entitled', 'cards', 'votes', 'valid', 'invalid', 'attendance']


class CircuitListSerializer(serializers.ModelSerializer):

    candidates = CircuitCandidateListSerializer(many=True, read_only=True)

    class Meta:
        model = Circuit
        fields = ['no', 'address', 'entitled', 'cards', 'votes', 'valid', 'invalid', 'attendance', 'candidates']


class CountrySerializer(serializers.ModelSerializer):

    candidates = CandidateListSerializer(many=True, read_only=True)
    subareas = SubareaListSerializer(many=True, read_only=True)

    class Meta:
        model = Country
        fields = ['name', 'entitled', 'cards', 'votes', 'valid', 'invalid', 'attendance', 'candidates', 'subareas']


class VoivodeshipSerializer(serializers.ModelSerializer):

    candidates = CandidateListSerializer(many=True, read_only=True)
    subareas = SubareaListSerializer(many=True, read_only=True)

    class Meta:
        model = Voivodeship
        fields = ['no', 'name', 'entitled', 'cards', 'votes', 'valid', 'invalid', 'attendance', 'candidates', 'subareas']


class DistrictSerializer(serializers.ModelSerializer):

    candidates = CandidateListSerializer(many=True, read_only=True)
    subareas = CommuneListSerializer(many=True, read_only=True)
    voivodeship = TopVoivodeshipSerializer()

    class Meta:
        model = District
        fields = ['no', 'name', 'entitled', 'cards', 'votes', 'valid', 'invalid', 'attendance', 'voivodeship', 'candidates', 'subareas']


class CommuneSerializer(serializers.ModelSerializer):

    candidates = CandidateListSerializer(many=True, read_only=True)
    subareas = CircuitListSerializer(many=True, read_only=True)
    district = TopDistrictSerializer()

    class Meta:
        model = Commune
        fields = ['code', 'name', 'entitled', 'cards', 'votes', 'valid', 'invalid', 'attendance', 'district', 'candidates', 'subareas']

class VoteCommuneSerializer(serializers.ModelSerializer):

    district = TopDistrictSerializer()

    class Meta:
        model = Commune
        fields = ['code', 'name', 'district']

class VoteCircuitSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    address = serializers.CharField()
    commune = VoteCommuneSerializer()

class VoteCandidateSerializer(serializers.Serializer):

    name = serializers.CharField()

class VoteSerializer(serializers.ModelSerializer):

    circuit = VoteCircuitSerializer(many=False, read_only=True)
    candidate = VoteCandidateSerializer(many=False, read_only=True)

    class Meta:
        model = Vote
        fields = ['id', 'number', 'circuit', 'candidate']

class CommuneSearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = Commune
        fields = ['code', 'name']

class VoivodeshipSearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = Voivodeship
        fields = ['no', 'name']

class DistrictSearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = Voivodeship
        fields = ['no', 'name']

class CircuitSearchSerializer(serializers.ModelSerializer):

    commune = CommuneSearchSerializer()

    class Meta:
        model = Circuit
        fields = ['no', 'address', 'commune']
