import React, {FC, useEffect} from 'react';
import {Box, Text, useFocus, useFocusManager, useInput, useApp} from 'ink';
import {copy} from './utils/pbcopy';

const exampleCommands = [
	{
		name: 'docker image rm <image_id>',
		description: 'remove a docker image'
	}, 
	{
		name: 'docker ps',
		description: 'show all running docker containers'
	}
]

const Result: FC<{name: string, description: string, onEnter: (command: string) => void}> = ({name, description, onEnter}) => {
	const {isFocused} = useFocus()

	useInput((_, key) => {
		if (key.return) {
			if (isFocused) onEnter(name)
		}
	})

	return (
		<Box marginLeft={3}>
			<Text color={isFocused ? "blue" : "white"}>{'❯'}</Text>
			<Box marginLeft={1}>
				<Text bold={isFocused} color={isFocused ? "blue" : "white" }>{name}</Text>
			</Box>
			<Box marginLeft={2}>
				<Text>{description}</Text>
			</Box>
		</Box>

	)
}

const App: FC<{query?: string | undefined}> = ({query = undefined}) => {
	const {enableFocus, focusNext} = useFocusManager()
	const {exit} = useApp()

	useEffect(() => {
		enableFocus()
		focusNext()
	}, [])

	useInput((input: string, _) => {
		if (input === 'q') {
			exit()
		}
	});

	const copyCommand = (command: string) => {
		exit()
		copy(command)
	}

	return (
		<Box flexDirection="column">
			<Text color="white" bold>
				results for (<Text color="green">{query}"docker"</Text>)
			</Text>
			<Box flexDirection="column">
				{exampleCommands.map((command: any) => (
						<Result
							key={command.name}
							name={command.name}
							description={command.description}
							onEnter={copyCommand}
						/>
					))
				}
			</Box>
		</Box>
	);
}
module.exports = App;
export default App;
