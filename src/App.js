import React, { useEffect, useRef } from 'react';

import './App.css';

function componentDidMount(props) {
	document.body.classList.add('container');
}

function tableIsNotUnique(tableEntry) {
	return tableEntry[1] !== 1;
}

function associationIsNotPaired(associationEntry) {
	return associationEntry[1] !== 2;
}

function App(props) {

	const didMountRef = useRef(false);

	useEffect(() => {
		if (didMountRef.current) {
			// componentDidUpdate(props, prevProps);
		} else {
			didMountRef.current = true;
			componentDidMount(props);
		}
	});

	return <><h1>LQML Validator</h1><textarea className='input' id='input' /><textarea className='output' id='output' /><input className='button' onClick={() => {
		const input = document.getElementById('input');
		const output = document.getElementById('output');
		let tableMap = {};
		let associationMap = {};
		input.value.split('\n').forEach(line => {
			let tableNameMatch = line.match(/\s*?<Table\s+?Name="(.+?[.].+?)".+/);
			if (tableNameMatch) {
				let tableName = tableNameMatch[1];
				tableMap[tableName] = (tableMap[tableName] ?? 0) + 1
			}
			let associationNameMatch = line.match(/\s*?<Association\s+?Name="(.+?)".+/);
			if (associationNameMatch) {
				let associationName = associationNameMatch[1];
				associationMap[associationName] = (associationMap[associationName] ?? 0) + 1
			}
		});
		let tableDuplicated = Object.entries(tableMap).filter(tableIsNotUnique).map(tableEntry => tableEntry[0]);
		let associationNotPaired = Object.entries(associationMap).filter(associationIsNotPaired).map(associationEntry => associationEntry[0]);
		output.value = `found ${Object.keys(tableMap).length} table(s)${'\n'
			}${'\n'
			}${
				(tableDuplicated.length > 0)
					? `the following tables are defined more than once:${'\n'
						}${'\n'
						}${tableDuplicated.join('\n')}`
					: 'no tables defined more than once'
			}${'\n'
			}${'\n'
			}found ${Object.keys(associationMap).length} association(s)${'\n'
			}${'\n'
			}${
				(associationNotPaired.length > 0)
					? `the following associations are not defined twice:${'\n'
						}${'\n'
						}${associationNotPaired.join('\n')}`
					: 'no associations defined once or more than twice'
			}`;
	}} type='button' value='Validate' /><p className='by'>by Guilherme Alan Ritter</p></>;
}

export default App;
