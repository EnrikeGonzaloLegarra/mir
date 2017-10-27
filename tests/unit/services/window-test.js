import { get } from '@ember/object';
import { later } from '@ember/runloop';
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:window', 'Unit | Service | window', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo'],

  beforeEach() {
    // reset location hash
    window.location.hash = '';
  },
  afterEach() {
    // reset location hash
    window.location.hash = '';
  },
});

test('it can call history.back and navigate back', function(assert) {
  let done = assert.async();

  // navigate forwards, manually
  window.location.hash = '#back';
  window.location.hash = '#forward';
  let service = this.subject();
  assert.ok(service, 'service is ok');
  // navigate back
  get(service, 'history.back')(window);
  later(this, () => {
    assert.equal(window.location.hash, '#back', '`history.back` was called');
    done();
  }, 250);
});

test('it can call history.back if `history` is not available (e.g. in FastBoot)', function(assert) {
  let done = assert.async();

  // navigate forwards, manually
  let hash = window.location.hash;
  let service = this.subject();
  assert.ok(service, 'service is ok');

  // navigate back
  get(service, 'history.back')({});
  later(this, () => {
    assert.equal(window.location.hash, hash, '`history.back` was not called');
    // restore history
    done();
  }, 250);
});
