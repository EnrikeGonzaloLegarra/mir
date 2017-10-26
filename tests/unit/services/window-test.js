import { get } from '@ember/object';
import { later } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | window', function(hooks) {
  setupTest(hooks);

  // Specify the other units that are required for this test.
  // needs: ['service:foo'],

  hooks.beforeEach(function() {
    // reset location hash
    window.location.hash = '';
  });

  test('it can call history.back and navigate back', function(assert) {
    // navigate forwards, manually
    window.location.hash = '#back';
    window.location.hash = '#forward';
    let service = this.owner.lookup('service:window');
    assert.ok(service, 'service is ok');
    // navigate back
    get(service, 'history.back')();
    later(this, () => {
      assert.equal(window.location.hash, '#back', '`history.back` was called');
    }, 250);
  });

  test('it can call history.back if `history` is not available (e.g. in FastBoot)', function(assert) {
    // navigate forwards, manually
    window.location.hash = '#same';
    let service = this.owner.lookup('service:window');
    assert.ok(service, 'service is ok');

    // cache history
    let cacheHistory = window.history;
    delete window.history;

    // navigate back
    get(service, 'history.back')();
    later(this, () => {
      assert.equal(window.location.hash, '#same', '`history.back` was not called');
    }, 250);

    // restore history
    window.history = cacheHistory;
  });
});
