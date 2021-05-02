const ConfigManager     = require('./configmanager')
const { v3: uuidv3 }      = require("uuid");
const { machineIdSync } = require("node-machine-id");
const bcrypt = require('bcrypt');

exports.addAccount = async function(username, password){


    let base_url = "https://api.evoniamc.eu/api/auth/"; //Edit with your auth api url


    if (username.includes('@')) {
      await fetch(
          `${base_url}?email=${username}&password=${password}`
        )
        .then((response) => response.json())
        .then((response) => {
            if ("ok" != response.status) {
              throw new Error(
                "Le pseudo ou le mot de passe que vous avez entré est incorrect. Veuillez réessayer."
              );
            }
            id = response.id
            username = response.username
            token = response.token
            mode = response.mode
            uuid = uuidv3(username + machineIdSync(), uuidv3.DNS)

            if ("skin_url" == mode) {
              token = "DevMetricsCrackedHelios"
            } else if ("uuid" == mode) {
              token = response.token
            }

        });
    } else {
      await fetch(
          `${base_url}?username=${username}&password=${password}`
        )
        .then((response) => response.json())
        .then((response) => {
            if ("ok" != response.status) {
              throw new Error(
                "Le pseudo ou le mot de passe que vous avez entré est incorrect. Veuillez réessayer."
              );
            }
            id = response.id
            username = response.username
            token = response.token
            mode = response.mode
            uuid = uuidv3(username + machineIdSync(), uuidv3.DNS)

            if ("skin_url" == mode) {
              token = "DevMetricsCrackedHelios"
            } else if ("mojang" == mode) {
              token = response.token
            }

        });
    }

    const ret = ConfigManager.addAuthAccount(
      uuid,
      token,
      username,
      username,
    );

    if (ConfigManager.getClientToken() == null) {
      ConfigManager.setClientToken(token)
    }
    ConfigManager.save();
    return ret;
}

exports.removeAccount = async function(uuid){
    try {
        ConfigManager.removeAuthAccount(uuid)
        ConfigManager.save()
        return Promise.resolve()
    } catch (err){
        return Promise.reject(err)
    }
}

exports.validateSelected = async function(){
    return true
}