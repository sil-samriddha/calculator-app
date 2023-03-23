import { ACTIONS } from "./App"

export default function DigitButton({ Mode, dispatch, digit }) {
  return (
    <button style={Mode==="dark"? {backgroundColor: "rgba(1, 1, 1, .5)", color: "white"} : {backgroundColor: "rgba(255, 255, 255, .75)", color: "black"}}
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
    >
      {digit}
    </button>
  )
}