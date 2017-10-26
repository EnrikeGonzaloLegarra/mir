import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';

// Stub location service
const windowStub = Service.extend({
  history: {
    back() {
      window.location.hash = '#clicked';
    },
  },
});

module('Integration | Component | ma-header', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:window', windowStub);
    // Calling inject puts the service instance in the context of the test,
    // making it accessible as `window` within each test
    this.window = this.owner.lookup('service:window');
  });

  test('it renders with `back` and `backTo` links', async function(assert) {
    this.set('backTo', 'application');
    this.set('back', 'routes.application.title');
    this.set('title', 'routes.login.title');
    await render(hbs`{{ma-header backTo=backTo back=back title=title}}`);

    assert.notEqual(this.$().text().indexOf('Sign in'), -1);
    assert.notEqual(this.$().text().indexOf('Home'), -1);
  });

  test('it renders without `back` and `backTo` links', async function(assert) {
    this.set('title', 'routes.login.title');
    await render(hbs`{{ma-header title=title}}`);

    assert.notEqual(this.$().text().indexOf('Sign in'), -1);
    assert.notEqual(this.$().text().indexOf('Back'), -1);
  });

  test('clicking `back` default link calls window.history.back', async function(assert) {
    this.set('title', 'routes.login.title');
    await render(hbs`{{ma-header title=title}}`);

    this.$('.ma-Header .ma-Header-link--back').click();
    assert.equal(window.location.hash, '#clicked');
  });

  test('the off-canvas menu button toggles its active state', async function(assert) {
    this.set('title', 'routes.login.title');
    await render(hbs`{{ma-header title=title}}`);

    // click hamburger and check that the 'is-shown' class is available
    this.$('.ma-Header-burger').click();
    assert.notEqual(this.$().html().indexOf('is-active'), -1);

    // click hamburger and check that the 'is-shown' class is available
    this.$('.ma-Header-burger').click();
    assert.equal(this.$().html().indexOf('is-active'), -1);
  });
});
