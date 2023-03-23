import React from "react";
import "./styles/style.css";
import { useReducer } from "react";
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import { useState } from "react";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
    default:
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
    default:
  }

  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  )
  const [Mode, setMode] = useState("light");
  const toggle = () =>{
    if(Mode === "light"){
      setMode("dark");
      document.body.style.background = "linear-gradient(to right, #0250c5 0%, #d43f8d 100%)"
    }else{
      setMode("light");
      document.body.style.background = "linear-gradient(to right, #fbc2eb 0%, #a6c1ee 100%)"
    }
  }

  return (
    <>
    <div className="calculator-grid">
      <div className="output" style={Mode==="dark"? {border: "1px solid white"}: {border: "1px solid black"}}>
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        style={Mode==="dark"? {backgroundColor: "rgba(1, 1, 1, .5)", color: "white"} : {backgroundColor: "rgba(255, 255, 255, .75)", color: "black"}}
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}
      style={Mode==="dark"? {backgroundColor: "rgba(1, 1, 1, .5)", color: "white"} : {backgroundColor: "rgba(255, 255, 255, .75)", color: "black"}}>
        DEL
      </button>
      <OperationButton operation="÷" Mode={Mode} dispatch={dispatch} />
      <DigitButton digit="1" Mode={Mode} dispatch={dispatch} />
      <DigitButton digit="2" Mode={Mode} dispatch={dispatch} />
      <DigitButton digit="3" Mode={Mode} dispatch={dispatch} />
      <OperationButton operation="*" Mode={Mode} dispatch={dispatch} />
      <DigitButton digit="4" Mode={Mode} dispatch={dispatch} />
      <DigitButton digit="5" Mode={Mode} dispatch={dispatch} />
      <DigitButton digit="6"  Mode={Mode}dispatch={dispatch} />
      <OperationButton operation="+" Mode={Mode} dispatch={dispatch} />
      <DigitButton digit="7" Mode={Mode} dispatch={dispatch} />
      <DigitButton digit="8" Mode={Mode} dispatch={dispatch} />
      <DigitButton digit="9" Mode={Mode} dispatch={dispatch} />
      <OperationButton operation="-" Mode={Mode} dispatch={dispatch} />
      <DigitButton digit="." Mode={Mode} dispatch={dispatch} />
      <DigitButton digit="0" Mode={Mode} dispatch={dispatch} />
      <button
        style={Mode==="dark"? {backgroundColor: "rgba(1, 1, 1, .5)", color: "white"} : {backgroundColor: "rgba(255, 255, 255, .75)", color: "black"}}
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
      <button style={Mode==="dark"? {backgroundColor: "rgba(1, 1, 1, .5)", color: "white", fontSize: "20px", gridColumn: "span 4"} : {backgroundColor: "rgba(255, 255, 255, .75)", color: "black", fontSize: "20px", gridColumn: "span 4"}} onClick={toggle}>Change to {Mode==="light"? "Dark" : "Light"} Mode</button>
    </div>
    </>
  )
}

export default App
