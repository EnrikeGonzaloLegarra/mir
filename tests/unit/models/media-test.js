import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | media', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let model = this.owner.lookup('service:store').createRecord('media');
    // let store = this.store();
    assert.ok(!!model);
  });
});
