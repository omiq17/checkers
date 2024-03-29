import React from "react"

export default function Field(props) {
	// console.log(props, "field")
	const { value, highlight, handleClick, position } = props
	let styles = {
		field: {
			background: value === 0 ? "#d2624c" : "#795548",
			boxShadow:
				highlight === 1
					? "inset 0 0 0.17em 0.17em white"
					: highlight === 2
					? "inset 0 0 0.17em 0.17em #E91E63"
					: highlight === 3
					? "inset 0 0 0.17em 0.17em #ffc107"
					: "inset 0 0 0 0 white"
		}
	}
	let icon = {
		0: null,
		10: null,
		11: "player1.png",
		12: "player2.png",
		13: "player1K.png",
		14: "player2K.png"
	}
	return (
		<div className="col" style={styles.field} onClick={() => handleClick(position)}>
			{icon[value.toString()] && (
				<img src={icon[value.toString()]} alt={icon[value.toString()]} />
			)}
		</div>
	)
}

// background: #6d4d34;
// background-color: #d45c45;
