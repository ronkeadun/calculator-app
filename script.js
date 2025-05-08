//Accessing the DOM elements of the calculator app
const inputContainer = document.getElementById("input-buttons")
const expressionPart = document.getElementById("expression")
const resultPart = document.getElementById("result")

//Define expression and result variables
let expressionValue = ""
let resultValue = ""
let tempExpression = ""

//Define event handler for the button clicks
function handleButtonClicks(event) {
    //Get value from clicked buttons
    if(!event.target.closest("button")) return
    const targetedButton = event.target
    const targetedButtonAction = targetedButton.dataset.action
    const targetedButtonValue = targetedButton.dataset.value
    //console.log(targetedButton, targetedButtonAction, targetedButtonValue)

    //Swith statement to manipulate the buttons
    switch (targetedButtonAction) {
        case "number": appendNumberValue(targetedButtonValue)
            break;
        case "clear": clearAll()
            break;
        case "backspace": handleBackspace()
            break;
        //Move the result to the expression part as a starting point if expression is empty
        case "addition":
        case "subtraction":
        case "multiplication":
        case "division":
        //case "mod":
            if(expressionValue === "" && resultValue !== ""){
                tempExpression = ""
                startExpressionFromResult(targetedButtonValue)
            }else if(expressionValue !== "" && !isLastCharOperator()){
                appendNumberValue(targetedButtonValue)
            }
            break;
        case "submit": handleSubmit()
            break;
        case "negate": handleNegate()
            break;
        case "mod": handlePercentage()
            break;
        case "decimal": handledecimal(targetedButtonValue)
            break;
        default: return
    }
    //Update display output screen
    updateDisplayOutput(expressionValue, resultValue)
}
inputContainer.addEventListener("click", handleButtonClicks)

function appendNumberValue(numVal) {
    if(numVal === "." ) {
        //Find the index of the last operator in the expression
        const lastOperatorIndex =  expressionValue.search(/[+\-*/]/)
        //Find the index of the last decimal in the expression
        const lastDecimalIndex =  expressionValue.lastIndexOf(".")
        //Find the index of the last number in the expression
        const lastNumberIndex = Math.max(
            expressionValue.lastIndexOf("+"),
            expressionValue.lastIndexOf("-"),
            expressionValue.lastIndexOf("*"),
            expressionValue.lastIndexOf("/")
        )
        //Check if it's the first decimal in the current number or if the expression is empty
        if((lastDecimalIndex < lastOperatorIndex || lastDecimalIndex < lastNumberIndex || lastDecimalIndex === -1) && (expressionValue === "" || expressionValue.slice(lastNumberIndex + 1).indexOf("-") === -1)){
            expressionValue += numVal
        }
    } else {
        expressionValue += numVal
    }
} 

function updateDisplayOutput(expressionParam, resultParam) {
    if (tempExpression !== "" && expressionValue === ""){
        expressionPart.textContent = tempExpression+"="
        resultPart.textContent = resultParam
    }else {
        expressionPart.textContent = expressionParam
        resultPart.textContent = resultParam
    }
}

function clearAll(){
    expressionValue = ""
    resultValue = ""
    tempExpression = ""
}

function handleBackspace() {
    expressionValue = expressionValue.toString().slice(0, -1)
}

function startExpressionFromResult(value) {
    expressionValue += resultValue.toString() + value.toString()
}

function isLastCharOperator() {
    return isNaN(parseFloat(expressionValue.slice(-1)))
}

function handleSubmit(){
    resultValue = evaluateExpression()
    tempExpression = expressionValue
    expressionValue = ""
}

function evaluateExpression() {
    const evalResult = eval(expressionValue)
    //checks if evalResult isNaN or infinite, if it is return a space character " "
    return isNaN(evalResult) || !isFinite(evalResult) 
    ? evalResult
    : evalResult < 1    
    ? parseFloat(evalResult.toFixed(10))
    : parseFloat(evalResult.toFixed(3))
}

function handleNegate() {
    //Negate the result if the expression is empty and the result is present
    if(expressionValue === ""  && resultValue !== ""){
        resultValue = -resultValue 
        //Toggle the sign of the expression if it's not already negative and it's not empty
    }else if (!expressionValue.startsWith("-") && expressionValue !== ""){
        expressionValue = "-" + expressionValue
        //Remove the negative sign from the expression if it's already negative
    }else if (expressionValue.startsWith("-")){
        expressionValue = expressionValue.slice(1)
    }
}

function handlePercentage() {
    //Evaluate the expression, else it will take the percentage of only the first number
    if(expressionValue !== ""){
        resultValue = evaluateExpression()
        expressionValue = ""
        if(!isNaN(resultValue) && isFinite(resultValue)) {
            resultValue /= 100
        }else {
            resultValue = ""
        }
    }else if(resultValue !== ""){
        //If expression is empty but the result exists
        resultValue = parseFloat(resultValue)/100
    }
}

function handledecimal(value) {
    if(!expressionValue.endsWith(".") && !isNaN(expressionValue.slice(-1))){
        appendNumberValue(value)
    }
}