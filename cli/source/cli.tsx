#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './ui';

const cli = meow(`
	Usage
	  $ cli

	Options
		--name  Your name

	Examples
	  $ cli --name=Jane
	  Hello, Jane
`, {
	flags: {
		query: {
			type: 'string'
		}
	}
});

export const {clear, unmount} = render(<App query={cli.flags.query}/>);

