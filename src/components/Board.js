import React from "react"
import Field from "./Field"

export default function Board(props) {
	const { values, highlight, handleClick } = props
	return (
		<div>
			{values.map((row, i) => {
				return (
					<div className="row" key={i}>
						{row.map((value, j) => {
							return (
								<Field
									value={value}
									highlight={highlight[i][j]}
									position={[i, j]}
									handleClick={handleClick}
									key={j}
								/>
							)
						})}
					</div>
				)
			})}
		</div>
	)
}
