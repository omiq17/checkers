import React, { Component } from "react"
import "./styles/App.css"
import Board from "./components/Board"
import ScoreCard from "./components/ScoreCard"
import { styles } from "ansi-colors"

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
			availableMoves: [],
			// 0: capturing move
			// 1: non-capturing move
			moveType: 1,
			mandatory: false
		}
	}

	// Removing highlight
	// Taking a callback function
	disableHighlight = cb => {
		let highlight = Array(8)
			.fill()
			.map(() => Array(8).fill(0))
		this.setState({ highlight }, () => cb(true))
	}

	//Switch player
	switchPlayer = () => {
		this.setState(
			{
				player: this.state.player === 1 ? 2 : 1,
				availableMoves: [],
				current: [],
				moveType: 1,
				mandatory: false
			},
			() => {
				//Check for all possible mandatory moves
				let values = this.state.values.slice()
				let { player } = this.state

				values.map((row, i) => {
					row.map((col, j) => {
						if (col > 10 && col % 2 === player % 2) {
							console.log(col, "rc")
							let king = col > 12 ? true : false
							let moves_1 = this.getAllMoves(player, king, 1, i, j)
							let moves_2 = this.getAllMoves(player, king, 2, i, j)

							let capture = this.checkMandatoryMove(values, player, moves_1, moves_2)
							if (capture) {
								this.setState({ current: [i, j] })
								return 0
							}
						}
					})
				})
			}
		)
	}

	// Check for Mandatory move
	checkMandatoryMove = (values, player, moves_1, moves_2) => {
		// console.log(moves_1, "moves_1")
		// console.log(moves_2, "moves_2")
		let capturing_moves = []
		let value_1 = 0
		let value_2 = 0

		moves_1.forEach((move, index) => {
			// value_1 = values[move[0]][move[1]]
			if (move) value_1 = values[move[0]][move[1]]
			else value_1 = 0
			if (moves_2[index]) value_2 = values[moves_2[index][0]][moves_2[index][1]]
			else value_2 = 0

			if (value_1 > 10 && value_1 % 2 !== player % 2 && value_2 === 10) {
				console.log(value_1, player, value_2, "@debug")
				capturing_moves.push(moves_2[index])
			}
		})

		// console.log(capturing_moves, "cp")
		// Check for capturing moves first
		if (capturing_moves.length > 0) {
			capturing_moves.forEach(move => this.highlightField(move[0], move[1]))
			this.setState({ moveType: 0, availableMoves: capturing_moves, mandatory: true })
			return true
		} else {
			return false
		}
	}

	//Highlight a field
	highlightField = (i, j) => {
		this.disableHighlight(finish => {
			if (finish) {
				// console.log(i, j, "highlight")
				let highlight = this.state.highlight.slice()
				highlight[i][j] = 1
				highlight = this.setState({ highlight })
			}
		})
	}

	// Check for capturing or non-capturing move
	findMoveTypes = (values, player, moves_1, moves_2) => {
		// console.log(moves_1, "moves_1")
		// console.log(moves_2, "moves_2")
		let capturing_moves = []
		let non_capturing_moves = []
		let value_1 = 0
		let value_2 = 0

		moves_1.forEach((move, index) => {
			// value_1 = values[move[0]][move[1]]
			if (move) value_1 = values[move[0]][move[1]]
			else value_1 = 0
			if (moves_2[index]) value_2 = values[moves_2[index][0]][moves_2[index][1]]
			else value_2 = 0

			// console.log(value_1, player, value_2, "@debug")
			if (value_1 === 10) {
				non_capturing_moves.push(move)
			} else if (value_1 % 2 !== player % 2 && value_2 === 10) {
				capturing_moves.push(moves_2[index])
			}
		})

		// console.log(capturing_moves, "cp")
		// console.log(non_capturing_moves, "ncp")
		// Check for capturing moves first
		if (capturing_moves.length > 0) {
			capturing_moves.forEach(move => this.highlightField(move[0], move[1]))
			this.setState({ moveType: 0, availableMoves: capturing_moves })
		} else {
			non_capturing_moves.forEach(move => this.highlightField(move[0], move[1]))
			this.setState({ moveType: 1, availableMoves: non_capturing_moves })
		}
	}

	// Move a piece
	movePiece = (values, player, king, moveType, current, i, j) => {
		values[i][j] = values[current[0]][current[1]]
		values[current[0]][current[1]] = 10

		// For Capturing move
		if (moveType === 0) {
			let vanish_i = (i + current[0]) / 2
			let vanish_j = (j + current[1]) / 2
			values[vanish_i][vanish_j] = 10

			let captured = this.state.captured.slice()
			captured[player - 1] = captured[player - 1] + 1
			this.setState({ captured }, () => {
				let moves_1 = this.getAllMoves(player, king, 1, i, j)
				let moves_2 = this.getAllMoves(player, king, 2, i, j)
				// console.log(moves_1, moves_2, "moves")

				let capture_again = this.checkMandatoryMove(values, player, moves_1, moves_2)
				if (capture_again) {
					this.setState({ current: [i, j] })
					return 0
				}
			})
		}

		this.switchPlayer()
		this.disableHighlight(finish => {
			return 0
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

	// Handle a user click
	handleClick = position => {
		console.log(position, "pos")

		let { player, availableMoves, moveType, mandatory, current } = this.state
		let values = this.state.values.slice()
		// i : left side (top to bottom)
		// j: top side (left to right)
		let [i, j] = position
		let currentValue = values[i][j]
		let king = currentValue > 12 ? true : false

		// Check if clicked on the available highlighted positions
		availableMoves.map(arr => {
			if (arr[0] === i && arr[1] === j) {
				this.movePiece(values, player, king, moveType, current, i, j)
				return 0
			}
			return 0
		})

		if (
			!mandatory &&
			currentValue !== 0 &&
			currentValue !== 10 &&
			currentValue % 2 === player % 2
		) {
			this.highlightField(i, j)
			this.setState({ current: [i, j] })

			let moves_1 = this.getAllMoves(player, king, 1, i, j)
			let moves_2 = this.getAllMoves(player, king, 2, i, j)
			// console.log(moves_1, moves_2, "moves")

			this.findMoveTypes(values, player, moves_1, moves_2)
		}
	}

	render() {
		console.log(this.state.availableMoves, "state")
		let styles = {
			background:
				this.state.player === 2
					? "linear-gradient(180deg, rgba(225, 99, 75, 1) 11%, rgba(255, 255, 255, 1) 100%)"
					: "linear-gradient(180deg, rgba(255,255,255,1) 11%, rgba(57, 41, 29,1) 100%)"
		}
		return (
			<div className="App" style={styles}>
				<h1>Checkers</h1>
				<Board
					values={this.state.values}
					highlight={this.state.highlight}
					handleClick={this.handleClick}
				/>
				<ScoreCard />
			</div>
		)
	}
}
