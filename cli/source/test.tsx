import React from 'react';
import chalk from 'chalk';
import test from 'ava';
import {render} from 'ink-testing-library';
import App from './ui';


test('greet with query', t => {
	const {lastFrame} = render(<App query="docker"/>);

	t.is(lastFrame(), chalk`Showing Results For Query, {green docker}`);
});
