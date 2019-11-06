import React, { Component } from "react"
import "./styles/App.css"
import Board from "./components/Board"
import ScoreCard from "./components/ScoreCard"

export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			// 0: disable fields
			// 10: enable field, empty
			// 11: enable field, belongs to player 1
			// 12: enable field, belongs to player 2
			// 13: enable field, belongs to player 1 King
			// 14: enable field, belongs to player 2 King
			values: [
				[0, 12, 0, 12, 0, 12, 0, 12],
				[12, 0, 12, 0, 12, 0, 12, 0],
				[0, 12, 0, 12, 0, 12, 0, 12],
				[10, 0, 10, 0, 10, 0, 10, 0],
				[0, 10, 0, 10, 0, 10, 0, 10],
				[11, 0, 11, 0, 11, 0, 11, 0],
				[0, 11, 0, 11, 0, 11, 0, 11],
				[11, 0, 11, 0, 11, 0, 11, 0]
			],
			// values: [
			// 	[0, 12, 0, 10, 0, 12, 0, 12],
			// 	[10, 0, 12, 0, 12, 0, 12, 0],
			// 	[0, 11, 0, 12, 0, 11, 0, 12],
			// 	[10, 0, 10, 0, 10, 0, 11, 0],
			// 	[0, 10, 0, 10, 0, 10, 0, 10],
			// 	[11, 0, 11, 0, 11, 0, 11, 0],
			// 	[0, 11, 0, 11, 0, 11, 0, 11],
			// 	[11, 0, 11, 0, 11, 0, 11, 0]
			// ],
			highlight: [
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0]
			],
			player: 1,
			current: [],
			captured: [0, 0],
			availableMoves: { from: [], to: [] },
			// 0: capturing move
			// 1: non-capturing move
			moveType: 1,
			mandatory: false,
			chooseInputMode: false
		}
	}

	//Switch player
	switchPlayer = () => {
		this.setState(
			{
				player: this.state.player === 1 ? 2 : 1,
				availableMoves: { from: [], to: [] },
				current: [],
				moveType: 1,
				mandatory: false
			},
			async () => {
				//Check for all possible mandatory moves
				let values = this.state.values.slice()
				let { player } = this.state

				for (const [i, row] of values.entries()) {
					for (const [j, col] of row.entries()) {
						if (col > 10 && col % 2 === player % 2) {
							// console.log(col, "rc")
							let king = col > 12 ? true : false
							let moves_1 = this.getAllMoves(player, king, 1, i, j)
							let moves_2 = this.getAllMoves(player, king, 2, i, j)

							await this.checkMandatoryMove(values, player, moves_1, moves_2, [i, j])
						}
					}
				}
			}
		)
	}

	// Check for Mandatory move
	checkMandatoryMove = async (values, player, moves_1, moves_2, position) => {
		// console.log(moves_1, "moves_1")
		// console.log(moves_2, "moves_2")
		let capturing_moves = JSON.parse(JSON.stringify(this.state.availableMoves))
		// console.log(capturing_moves, "cp_st")
		let value_1 = 0
		let value_2 = 0

		for (const [index, move] of moves_1.entries()) {
			// value_1 = values[move[0]][move[1]]
			if (move) value_1 = values[move[0]][move[1]]
			else value_1 = 0
			if (moves_2[index]) value_2 = values[moves_2[index][0]][moves_2[index][1]]
			else value_2 = 0

			if (value_1 > 10 && value_1 % 2 !== player % 2 && value_2 === 10) {
				// console.log(value_1, player, value_2, position, "@debug")
				this.highlightField(moves_2[index][0], moves_2[index][1], 3)
				this.highlightField(position[0], position[1], 1)

				capturing_moves.from.push(position)
				capturing_moves.to.push(moves_2[index])
			}
		}

		// console.log(capturing_moves, "cp")
		// Check for capturing moves first
		if (capturing_moves.from.length > 0) {
			await this.setState({ moveType: 0, availableMoves: capturing_moves, mandatory: true })
			return 1
		} else {
			return 2
		}
	}

	//Highlight a field
	highlightField = (i, j, type) => {
		// console.log(i, j, "highlight")
		let highlight = this.state.highlight.slice()
		highlight[i][j] = type
		highlight = this.setState({ highlight })
	}

	// Removing highlight
	// Taking a callback function
	disableHighlight = cb => {
		let highlight = Array(8)
			.fill()
			.map(() => Array(8).fill(0))
		this.setState({ highlight }, () => cb(true))
	}

	// Check for capturing or non-capturing move
	findMoveTypes = (values, player, moves_1, moves_2, position) => {
		// console.log(moves_1, "moves_1")
		// console.log(moves_2, "moves_2")
		let capturing_moves = { from: [], to: [] }
		let non_capturing_moves = { from: [], to: [] }
		let value_1 = 0
		let value_2 = 0

		moves_1.forEach((move, index) => {
			// value_1 = values[move[0]][move[1]]
			if (move) value_1 = values[move[0]][move[1]]
			else value_1 = 0
			if (moves_2[index]) value_2 = values[moves_2[index][0]][moves_2[index][1]]
			else value_2 = 0

			// console.log(value_1, player, value_2, "@debug1")
			if (value_1 === 10) {
				non_capturing_moves.from.push(position)
				non_capturing_moves.to.push(move)
			} else if (value_1 % 2 !== player % 2 && value_2 === 10) {
				capturing_moves.from.push(position)
				capturing_moves.to.push(moves_2[index])
			}
		})

		// console.log(capturing_moves, "cp")
		// console.log(non_capturing_moves, "ncp")
		// Check for capturing moves first
		if (capturing_moves.from.length > 0) {
			capturing_moves.from.forEach((move, i) => {
				this.highlightField(move[0], move[1], 1)
				this.highlightField(capturing_moves.to[i][0], capturing_moves.to[i][1], 3)
			})
			this.setState({ moveType: 0, availableMoves: capturing_moves })
		} else {
			non_capturing_moves.from.forEach((move, i) => {
				this.highlightField(move[0], move[1], 1)
				this.highlightField(non_capturing_moves.to[i][0], non_capturing_moves.to[i][1], 3)
			})
			this.setState({ moveType: 1, availableMoves: non_capturing_moves })
		}
	}

	// Reseting Game
	resetGame = () => {
		this.setState({
			values: [
				[0, 12, 0, 12, 0, 12, 0, 12],
				[12, 0, 12, 0, 12, 0, 12, 0],
				[0, 12, 0, 12, 0, 12, 0, 12],
				[10, 0, 10, 0, 10, 0, 10, 0],
				[0, 10, 0, 10, 0, 10, 0, 10],
				[11, 0, 11, 0, 11, 0, 11, 0],
				[0, 11, 0, 11, 0, 11, 0, 11],
				[11, 0, 11, 0, 11, 0, 11, 0]
			],
			highlight: [
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0]
			],
			player: 1,
			current: [],
			captured: [0, 0],
			availableMoves: { from: [], to: [] },
			moveType: 1,
			mandatory: false
		})
	}

	// Review if game ends
	// Then if player becoms King
	checkGameState = (player, king, captured, values, i, j) => {
		if (captured[0] === 12) {
			// console.log("1 win")
			return { king: king, newKing: false, gameEnd: true }
		} else if (captured[1] === 12) {
			// console.log("2 win")
			return { king: king, newKing: false, gameEnd: true }
		} else if ((!king && (player === 1 && i === 0)) || (player === 2 && i === 7)) {
			//Making of a New KING
			values[i][j] = 10 + player + 2
			this.setState({ values })
			return { king: true, newKing: true, gameEnd: false }
		} else {
			return { king: king, newKing: false, gameEnd: false }
		}
	}
	// Move a piece
	movePiece = async (values, player, king, moveType, from, to) => {
		values[to[0]][to[1]] = values[from[0]][from[1]]
		values[from[0]][from[1]] = 10
		let captured = this.state.captured.slice()

		// For Capturing move
		if (moveType === 0) {
			// vanishing opponent
			let vanish_i = (to[0] + from[0]) / 2
			let vanish_j = (to[1] + from[1]) / 2
			values[vanish_i][vanish_j] = 10
			captured[player - 1] = captured[player - 1] + 1
		}

		let capture_again = 0
		await this.setState({ captured, availableMoves: { from: [], to: [] } }, async () => {
			//Check game state first
			let result = await this.checkGameState(player, king, captured, values, to[0], to[1])

			//Actions based on result
			if (result.gameEnd) return 0
			if (!result.gameEnd && !result.newKing && moveType === 0) {
				let moves_1 = this.getAllMoves(player, result.king, 1, to[0], to[1])
				let moves_2 = this.getAllMoves(player, result.king, 2, to[0], to[1])
				// console.log(moves_1, moves_2, "moves")

				this.disableHighlight(finish => {
					// console.log(
					// 	"disable highlight first, then do change player if no more mandatory move"
					// )
				})
				capture_again = await this.checkMandatoryMove(values, player, moves_1, moves_2, [
					to[0],
					to[1]
				])
				// console.log(capture_again, "bbb")
				if (capture_again === 1) return 0
				else this.switchPlayer()
			}
			if (moveType === 1 || result.newKing)
				this.disableHighlight(finish => {
					// console.log(moveType, capture_again, "ppp2")
					if (finish) this.switchPlayer()
				})
		})
	}

	// Get all combination of moves
	getAllMoves = (player, king, step, i, j) => {
		let moves = []
		let combinations = []
		if (king) {
			combinations = [
				[i - step, j - step],
				[i - step, j + step],
				[i + step, j - step],
				[i + step, j + step]
			]
		} else if (player === 1) {
			combinations = [[i - step, j - step], [i - step, j + step]]
		} else {
			combinations = [[i + step, j - step], [i + step, j + step]]
		}
		// verify combinations
		combinations.forEach(co => {
			if (0 <= co[0] && co[0] <= 7 && 0 <= co[1] && co[1] <= 7) {
				moves.push(co)
			} else moves.push(null)
		})
		return moves
	}

	inputHighlight = inputs => {
		let highlight = this.state.highlight.slice()
		inputs.forEach(input => {
			highlight[input[0]][input[1]] = 2
		})
	}

	// Handle a user click
	handleClick = position => {
		// console.log(position, "pos")

		let { player, availableMoves, moveType, mandatory, chooseInputMode } = this.state
		let values = this.state.values.slice()
		// i : left side (top to bottom)
		// j: top side (left to right)
		let [i, j] = position
		let currentValue = values[i][j]
		let king = currentValue > 12 ? true : false

		// Check if clicked on the available highlighted positions
		for (const [index, arr] of availableMoves.to.entries()) {
			if (arr[0] === i && arr[1] === j) {
				// Resolving common match case
				// Taking choice from input
				if (
					availableMoves.to.length >= 2 &&
					moveType === 0 &&
					availableMoves.to[0].toString() === availableMoves.to[1].toString()
				) {
					this.inputHighlight(availableMoves.from)
					return this.setState({ chooseInputMode: true })
				}

				return this.movePiece(
					values,
					player,
					king,
					moveType,
					availableMoves.from[index],
					arr
				)
			}
		}

		if (
			!mandatory &&
			currentValue !== 0 &&
			currentValue !== 10 &&
			currentValue % 2 === player % 2
		) {
			this.disableHighlight(finish => {
				if (finish) this.highlightField(i, j, 1)

				let moves_1 = this.getAllMoves(player, king, 1, i, j)
				let moves_2 = this.getAllMoves(player, king, 2, i, j)
				// console.log(moves_1, moves_2, "moves")

				this.findMoveTypes(values, player, moves_1, moves_2, position)
			})
		}

		// Resolving common match case
		if (chooseInputMode) {
			for (const [index, arr] of availableMoves.from.entries()) {
				if (arr[0] === i && arr[1] === j) {
					this.setState({ chooseInputMode: false })
					return this.movePiece(
						values,
						player,
						king,
						moveType,
						arr,
						availableMoves.to[index]
					)
				}
			}
		}
	}

	render() {
		// console.log(this.state.availableMoves, "state")
		let styles = {
			background:
				this.state.player === 2
					? "linear-gradient(180deg, rgba(225, 99, 75, 1) 11%, rgba(255, 255, 255, 1) 100%)"
					: "linear-gradient(180deg, rgba(255,255,255,1) 11%, rgba(57, 41, 29,1) 100%)"
		}
		return (
			<div className="App" style={styles}>
				<h1>
					CHECKERS<sub>multiplayer</sub>
				</h1>
				<Board
					values={this.state.values}
					highlight={this.state.highlight}
					handleClick={this.handleClick}
				/>
				<ScoreCard
					player={this.state.player}
					mandatory={this.state.mandatory}
					chooseInputMode={this.state.chooseInputMode}
					captured={this.state.captured}
					resetGame={this.resetGame}
				/>
			</div>
		)
	}
}
