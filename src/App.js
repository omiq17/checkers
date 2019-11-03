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
			selected: [],
			remaining: [12, 12],
			availableMoves: [],
			moveType: ""
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
		this.setState({ player: this.state.player === 1 ? 2 : 1 })
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

	// Find & highlight co-ordinates & set available moves
	findAvailableMoves = (i, j, values, player) => {
		let availableMoves = []
		let combinations = []
		if (player === 1) {
			combinations = [[i - 1, j - 1], [i - 1, j + 1]]
		} else {
			combinations = [[i + 1, j - 1], [i + 1, j + 1]]
		}
		combinations.map(co => {
			let fieldValue = values[co[0]][co[1]]
			if (-1 < co[0] && co[0] < 8 && -1 < co[1] && co[1] < 8 && fieldValue === 10) {
				this.highlightField(co[0], co[1])
				availableMoves.push(co)
			}
		})
		this.setState({ availableMoves })
	}

	// Handle a user click
	handleClick = position => {
		// console.log(position, "pos")

		let { values, player, availableMoves } = this.state
		let [i, j] = position
		let currentValue = values[i][j]

		// Check if clicked on the available highlighted positions
		availableMoves.map(arr => {
			if (arr[0] === i && arr[1] === j) {
				console.log(position, "pos")
				return
			}
		})

		if (currentValue !== 0 && currentValue !== 10 && currentValue % 2 === player % 2) {
			this.highlightField(i, j)
			this.setState({ selected: [i, j] })

			this.findAvailableMoves(i, j, values, player)

			// this.switchPlayer()
		}
	}

	render() {
		console.log(this.state.availableMoves, "state")
		let styles = {
			background:
				this.state.player === 2
					? "linear-gradient(180deg, rgba(212, 92, 69, 1) 11%, rgba(255, 255, 255, 1) 100%)"
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
