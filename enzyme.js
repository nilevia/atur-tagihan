// import { setConfig } from 'next/config';
// import { publicRuntimeConfig } from './next.config';
// setConfig({ publicRuntimeConfig });

const Adapter = require('enzyme-adapter-react-16');

require('enzyme').configure({ adapter: new Adapter() });
