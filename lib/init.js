import Mapper from './mapper';
import config from '../config';

const settings = config.get('mapper');
module.exports = new Mapper(settings).run();
