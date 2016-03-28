import _ from 'lodash';
import es from 'elasticsearch';
import httpAwsEs from 'http-aws-es';
import createLogger from './logger';

const logger = createLogger('mapper-tool-github');

function validateString(obj, prop) {
	if (!_.isString(obj[prop]) || _.isEmpty(obj[prop])) {
		throw new Error(`must provide a config string for ${prop}`);
	}
}

export {validateString};

export default class Mapper{

	constructor(settings = {}) {

		if (!_.isObject(settings.aws_elasticsearch)) {
			throw new Error('must provide aws_elasticsearch configuration');
		}

		this.esHost = settings.aws_elasticsearch.host;
		this.awsRegion = settings.aws_elasticsearch.region;
		this.accessKey = settings.aws_elasticsearch.access_key;
		this.secretKey = settings.aws_elasticsearch.secret_key;
		this.esIndex = settings.aws_elasticsearch.index;
		this.esType = settings.aws_elasticsearch.type;
		this.mappingFile = settings.mapping_file;

		validateString(this, 'esHost');
		validateString(this, 'awsRegion');
		validateString(this, 'accessKey');
		validateString(this, 'secretKey');
		validateString(this, 'esIndex');
		validateString(this, 'esType');
		validateString(this, 'mappingFile');

		this.mapping = require(this.mappingFile);

		this.client = es.Client({ // eslint-disable-line new-cap
			hosts : this.esHost,
			connectionClass : httpAwsEs,
			amazonES : {
				region : this.awsRegion,
				accessKey : this.accessKey,
				secretKey : this.secretKey
			}
		});

	}

	run() {
		const flag = _.last(process.argv);
		logger.debug('flag', flag);
		if (flag === '--delete') {
			return this.client.indices.delete({
				index : this.esIndex
			});
		}

		if (flag === '--get') {
			return this.client.indices.get({
				index : this.esIndex
			})
				.then(x => logger.info(`Mapping: ${JSON.stringify(x, null, 4)}`));
		}


		if (flag === '--create') {
			return this.client.indices.create({
				index : this.esIndex
			})
				.then(() => this.client.indices.putMapping({
					index : this.esIndex,
					type  : this.esType,
					body : this.mapping
				}));
		}

		logger.error('You are missing a command flag try either `--create`, `--delete`, or `--get`');
	}
}
