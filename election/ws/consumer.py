from channels import Group


def ws_country_connect(message):
    message.reply_channel.send({"accept": True})
    Group("country").add(message.reply_channel)


def ws_country_disconnect(message):
    Group("country").discard(message.reply_channel)


def ws_voivodeship_connect(message):
    message.reply_channel.send({"accept": True})
    Group("voivodeship").add(message.reply_channel)


def ws_voivodeship_disconnect(message):
    Group("voivodeship").discard(message.reply_channel)


def ws_district_connect(message):
    message.reply_channel.send({"accept": True})
    Group("district").add(message.reply_channel)


def ws_district_disconnect(message):
    Group("district").discard(message.reply_channel)


def ws_commune_connect(message):
    message.reply_channel.send({"accept": True})
    Group("commune").add(message.reply_channel)


def ws_commune_disconnect(message):
    Group("commune").discard(message.reply_channel)

