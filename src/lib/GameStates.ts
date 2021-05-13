// export const gameState = (function() {

// 	let currentState = -1;
// 	const stateNames: string[] = [];
// 	const stateCallbacks: { enterState: any; exitState: any; }[] | { enterState: () => void; exitState: any }[] = [];

// 	return {
// 		current: function() {
// 			if (currentState >= 0) {
// 				return stateNames[currentState];
// 			}
// 		},
// 		add: function(name: string, onEnter: any, onExit: any) {
// 			const index = stateNames.indexOf(name);
// 			if (index !== -1) {
// 				throw "State " + name + " already exist!";
// 			}
// 			stateCallbacks.push({
// 				enterState: onEnter || false,
// 				exitState: onExit || false,
// 			});
// 			stateNames.push(name);
// 		},
// 		remove: function(name: string) {
// 			const index = stateNames.indexOf(name);
// 			if (index === -1) {
// 				throw "State " + name + " not found!";
// 			}
// 			stateNames.splice(index, 1);
// 			stateCallbacks.splice(index, 1);
// 		},
// 		enter: function(name: string) {
// 			const index = stateNames.indexOf(name);
// 			if (index === -1) {
// 				throw "State " + name + " not found!";
// 			}
// 			if (stateCallbacks[currentState].exitState) {
// 				stateCallbacks[currentState].exitState();
// 			}
// 			currentState = index;
// 			if (stateCallbacks[index].enterState) {
// 				stateCallbacks[index].enterState();
// 			}
// 		},
// 		exit: function() {
// 			if (currentState === -1) {
// 				throw "Not currently in any state";
// 			}
// 			if (stateCallbacks[currentState].exitState) {
// 				stateCallbacks[currentState].exitState();
// 			}
// 			currentState = -1;
// 		},
// 	};
// }());