import { configure } from 'enzyme';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
