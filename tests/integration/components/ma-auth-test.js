import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import {
  registerTestComponent,
  unregisterTestComponent
} from
  'mir/tests/ember-test-component';

module('Integration | Component | ma auth', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function({ test: testCtx }) {
    unregisterTestComponent(testCtx.testEnvironment);
  });

  test('it renders the signup form', async function(assert) {
    registerTestComponent(this);

    this.set('loginAction', function login() {});
    this.set('signupAction', function signup() {});

    await render(hbs`
      {{ma-auth title="ABC_"
        components=(hash
          login=(component "test-component")
          input=(component "test-component"))
        loginAction=loginAction
        action=signupAction}}
    `);

    let actual = this.$().text().trim().replace(/[\s\n]+/g, '');
    assert.notEqual(actual.indexOf('ABC_'), -1);
    assert.notEqual(actual.indexOf('Signup'), -1);
  });
});
