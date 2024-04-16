// get/set methods
stateIsSet = false;

// called by getState in SorterMain.js
function getCurrentState() {
	SorterGame.saveGame();

	//var testString = "somethinginstring";
	var gameObjects = (SorterGame.gameObjects);
	//ok all game  objects, not remaining in the game in progress
	var categories = (SorterGame.categories);

	//NA PAIRNEI TON KODIKA KAI NA TON SWZEI STO STATE
	//	var gameCode = JSON.stringify();

	const workspaces=[ Blockly.serialization.workspaces.save(workspaceGamestart),
		Blockly.serialization.workspaces.save(workspaceGameplay),
		Blockly.serialization.workspaces.save(workspaceGameover)]

	var stateJSON = { gameObjects: gameObjects, categories: categories,
		blockly:workspaces };
	//console.log(stateJSON);
	return stateJSON;
}

// called by setState in SorterMain.js
function handleState(jsonState) {
	//var loadedJSON = (JSON.parse(jsonState))

	Blockly.serialization.workspaces.load(jsonState.blockly[0], workspaceGamestart);
	Blockly.serialization.workspaces.load(jsonState.blockly[1], workspaceGameplay);
	Blockly.serialization.workspaces.load(jsonState.blockly[2], workspaceGameover);

	// console.log(loadedJSON);
	if (!stateIsSet) {
		//STO LOAD GAME FILE NA FORTWNEI TON KWDIKA APO TO STATE
		SorterGame.loadGameFile(jsonState); //Create new game with the saved state
		stateIsSet = true;
	}
}
