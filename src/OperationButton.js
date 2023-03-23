import { ACTIONS } from "./App"

export default function OperationButton({ Mode, dispatch, operation }) {
  return (
    <button style={Mode==="dark"? {backgroundColor: "rgba(1, 1, 1, .5)", color: "white"} : {backgroundColor: "rgba(255, 255, 255, .75)", color: "black"}}
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })
      }
    >
      {operation}
    </button>
  )
}