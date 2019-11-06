import React from "react"

export default function ScoreCard(props) {
	let { player, mandatory, chooseInputMode, captured, resetGame, red, black } = props
	let win = captured[0] === 12 ? "BLACK" : captured[1] === 12 ? "RED" : ""
	return (
		<div className="score">
			{win === "" ? (
				<h2>
					{player === 1 ? "Black" : "Red"}'s {mandatory ? "mandatory move" : "turn"}
				</h2>
			) : (
				<>
					<h2>Player {win} has won!</h2>
				</>
			)}
			<p>{chooseInputMode && "Choose which piece to capture with"}</p>
			<div className="counter">
				<p>Black: {black}</p>
				<p>Red: {red}</p>
				<p className="rematch" onClick={() => resetGame()}>
					Rematch
				</p>
			</div>
		</div>
	)
}
