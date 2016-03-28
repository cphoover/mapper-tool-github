import Mapper, {validateString} from './mapper';
import assert from 'assert';
import sinon from 'sinon';
import es from 'elasticsearch';
import Bluebird from 'bluebird';

const settings = {
	'aws_elasticsearch' : {
		'host' : 'change this to a valid host',
		'region' : 'us-east-1',
		'access_key' : 'xxxx_access_key',
		'secret_key' : 'xxxx_secret_key',
		'index' : 'github',
		'type' : 'repo'
	},
	'mapping_file' : '../mapping.json'
};

describe('mapper', function suite() {

	beforeEach(function beforeEach() {
		this.sandbox = sinon.sandbox.create();
	});

	afterEach(function afterEach() {
		this.sandbox.restore();
	});

	it('can be instantiated', function test() { // this test ensures coverage
		assert(new Mapper(settings) instanceof Mapper);
	});

	it('validate string will throw if property is missing', function test() {
		const blah = {
		};

		assert.throws(function () {
			validateString(blah, 'asdf');
		});
	});

	it('validate string will throw if property is not a string', function test() {
		const blah = {
			asdf : 1234
		};

		assert.throws(function () {
			validateString(blah, 'asdf');
		});
	});

	it('will throw if not passed an aws_elasticsearch config', function test() {
		const _settings = {
			'mapping_file' : '../mapping.json'
		};
		assert.throws(function () {
			return new Mapper(_settings);
		});
	});

	it('will attempt to delete the index if --delete last flag given', function test() {
		process.argv.push('--delete');
		const esClientStub = this.sandbox.stub(es, 'Client');
		esClientStub.returns({
			indices : {
				create : () => Bluebird.resolve(),
				get : () => Bluebird.resolve(),
				delete : () => Bluebird.resolve(),
				putMapping : () => Bluebird.resolve()
			}
		});
		const mapper = new Mapper(settings);
		const deleteSpy = this.sandbox.spy(mapper.client.indices, 'delete');
		const getSpy = this.sandbox.spy(mapper.client.indices, 'get');
		const createSpy = this.sandbox.spy(mapper.client.indices, 'create');
		mapper.run();
		assert(deleteSpy.calledOnce);
		assert(getSpy.notCalled);
		assert(createSpy.notCalled);
	});

	it('will attempt to get the index mapping if --get last flag given', function test() {
		process.argv.push('--get');
		const esClientStub = this.sandbox.stub(es, 'Client');
		esClientStub.returns({
			indices : {
				create : () => Bluebird.resolve(),
				get : () => Bluebird.resolve(),
				delete : () => Bluebird.resolve(),
				putMapping : () => Bluebird.resolve()
			}
		});
		const mapper = new Mapper(settings);
		const deleteSpy = this.sandbox.spy(mapper.client.indices, 'delete');
		const getSpy = this.sandbox.spy(mapper.client.indices, 'get');
		const createSpy = this.sandbox.spy(mapper.client.indices, 'create');
		mapper.run();
		assert(deleteSpy.notCalled);
		assert(getSpy.calledOnce);
		assert(createSpy.notCalled);
	});

	it('will attempt to create the index and mapping if --create last flag given', function test() {
		process.argv.push('--create');
		const esClientStub = this.sandbox.stub(es, 'Client');
		esClientStub.returns({
			indices : {
				create : () => Bluebird.resolve(),
				get : () => Bluebird.resolve(),
				delete : () => Bluebird.resolve(),
				putMapping : () => Bluebird.resolve()
			}
		});
		const mapper = new Mapper(settings);
		const deleteSpy = this.sandbox.spy(mapper.client.indices, 'delete');
		const getSpy = this.sandbox.spy(mapper.client.indices, 'get');
		const createSpy = this.sandbox.spy(mapper.client.indices, 'create');
		mapper.run();
		assert(deleteSpy.notCalled);
		assert(getSpy.notCalled);
		assert(createSpy.calledOnce);
	});
});
