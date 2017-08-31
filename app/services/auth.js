import Ember from 'ember';

export default Ember.Service.extend({
  session: Ember.inject.service(),

  loginUserPassword(authenticator, identity, password) {
    // authenticate the user model against the API
    return this.get('session')
      .authenticate(authenticator, identity, password)
      .then(() => [/* success, empty error list */])
      .catch((response) => {
        // deal with errors
        const { errors } = response;
        let errorKeys;
        // if there is a 401 "Unauthorized" in the list of returned codes
        const isUnauthorized = (errors.mapBy('code').indexOf(401) > -1);
        if (isUnauthorized) {
          errorKeys = ['errors.login.unauthorized'];
        } else {
          errorKeys = ['errors.login.other'];
        }
        return errorKeys;
      });
    // 🤞
  },

  loginTwitter() {
    const provider = 'twitter';
    let authenticator = 'authenticator:torii';

    return this.get('session')
      .authenticate(authenticator, provider)
      .then(() => {
        console.info('Sucessfully authenticated with Twitter.');
        // log user in with Ai authenticator
        authenticator = 'authenticator:token';
        const code = this.get('session.session.authenticated.code');
        const { identity, token } = this.parseToken(code);
        this.loginUserPassword(authenticator, identity, token)
          .then(() => {
            console.info('Sucessfully exchanged Twitter code for JWT.');
          });
        // 🤞
      }, (/* error */) => ['errors.login.other'])
      .catch((error) => {
        console.warn(error.message);
        return ['errors.login.other'];
      });
    // 🤞
  },

  /**
   * Splits out the OAuth user identity `identity` and OAuth2 `token` from a
   * string where both are concatenated together.
   *
   * @method parseToken
   * @param {String} code The OAuth code returned from authentication.
   * @return {Object} An object with an `identity` and `token` keys.
   * @public
   */
  parseToken(code) {
    const [identity, token] = code.split('::');
    return {
      identity,
      token,
    };
  },
});
