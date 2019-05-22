import ReactDom from 'react-dom';
// see https://github.com/bahmutov/cypress-react-unit-test/issues/51
export default function fixReactDomScope(win) {
	if (win.ReactDOM !== ReactDom) {
		win.ReactDOM = ReactDom;
	}
}
