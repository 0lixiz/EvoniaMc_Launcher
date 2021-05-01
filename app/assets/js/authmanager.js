/**
 * AuthManager
 * 
 * This module aims to abstract login procedures. Results from Mojang's REST api
 * are retrieved through our Mojang module. These results are processed and stored,
 * if applicable, in the config using the ConfigManager. All login procedures should
 * be made through this module.
 * 
 * @module authmanager
 */
// Requirements
const ConfigManager     = require('./configmanager')
const { v3: uuidv3 }      = require("uuid");
const { machineIdSync } = require("node-machine-id");
const bcrypt = require('bcrypt');
// Functions

/**
 * Add an account. This will authenticate the given credentials with Mojang's
 * authserver. The resultant data will be stored as an auth account in the
 * configuration database.
 * 
 * @param {string} username The account username (email if migrated).
 * @param {string} password The account password.
 * @returns {Promise.<Object>} Promise which resolves the resolved authenticated account object.
 */

const hashPassword = async (password, saltRounds = 10) => {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash password
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
    }

    // Return null if error
    return null;
};

exports.addAccount = async function(username, password){
    if (username.includes('@')) {
      await fetch(
          `https://api.evoniamc.eu/api/auth/?email=${username}&password=${password}`
        )
        .then((response) => response.json())
        .then((response) => {
            if ("ok" != response.status) {
              throw new Error(
                "Le pseudo ou le mot de passe que vous avez entré est incorrect. Veuillez réessayer."
              );
            }
            id = response.id
            token = response.token
            username = response.username
            mode = response.mode
            uuid = uuidv3(username + machineIdSync(), uuidv3.DNS)

            if ("skin_url" == mode) {
              token = "CrackedHelios"
            } else if ("uuid" == mode) {
              token = response.token
            }

        });
    } else {
      await fetch(
          `https://api.evoniamc.eu/api/auth/?username=${username}&password=${password}`
        )
        .then((response) => response.json())
        .then((response) => {
            if ("ok" != response.status) {
              throw new Error(
                "Le pseudo ou le mot de passe que vous avez entré est incorrect. Veuillez réessayer."
              );
            }
            id = response.id
            token = response.token
            username = response.username
            mode = response.mode
            uuid = uuidv3(username + machineIdSync(), uuidv3.DNS)

            if ("skin_url" == mode) {
              token = "CrackedHelios"
            } else if ("uuid" == mode) {
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

/**
 * Remove an account. This will invalidate the access token associated
 * with the account and then remove it from the database.
 * 
 * @param {string} uuid The UUID of the account to be removed.
 * @returns {Promise.<void>} Promise which resolves to void when the action is complete.
 */
exports.removeAccount = async function(uuid){
    try {
        ConfigManager.removeAuthAccount(uuid)
        ConfigManager.save()
        return Promise.resolve()
    } catch (err){
        return Promise.reject(err)
    }
}
    
/**
 * Validate the selected account with Mojang's authserver. If the account is not valid,
 * we will attempt to refresh the access token and update that value. If that fails, a
 * new login will be required.
 * 
 * **Function is WIP**
 * 
 * @returns {Promise.<boolean>} Promise which resolves to true if the access token is valid,
 * otherwise false.
 */
exports.validateSelected = async function(){
    return true
}