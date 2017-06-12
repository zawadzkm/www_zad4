from channels.routing import route, include
from election.ws import consumer

country_websocket = [
    route('websocket.connect', consumer.ws_country_connect),
    route('websocket.disconnect', consumer.ws_country_disconnect)
]


voivodeship_websocket = [
    route('websocket.connect', consumer.ws_voivodeship_connect),
    route('websocket.disconnect', consumer.ws_voivodeship_disconnect)
]


district_websocket = [
    route('websocket.connect', consumer.ws_district_connect),
    route('websocket.disconnect', consumer.ws_district_disconnect)
]

commune_websocket = [
    route('websocket.connect', consumer.ws_commune_connect),
    route('websocket.disconnect', consumer.ws_commune_disconnect)
]

channel_routing = [
    include(country_websocket, path=r"^/country"),
    include(voivodeship_websocket, path=r"^/voivodeship"),
    include(district_websocket, path=r"^/district"),
    include(commune_websocket, path=r"^/commune")
]