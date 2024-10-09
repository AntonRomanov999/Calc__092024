//create buttons for numbers
const numbersContainer = document.querySelector(".numbers__container");
for (let i = 9; i >= 0; i--) {
  const btn = document.createElement("button");
  btn.id = i;
  btn.innerHTML = i;
  numbersContainer.prepend(btn);
}
//fields with input and expression
const input = document.querySelector("#main__input");
const expression = document.querySelector("#calc__expression");

//add events for input buttons
const numbersBtns = numbersContainer.children;
for (let i = 0; i < numbersBtns.length; i++) {
  numbersBtns[i].addEventListener("click", () => handleInput(i));
}
const handleInput = (i) => {
  if (numbersBtns[i].id === "switch") {
    input.value = -input.value;
    return;
  }
  if (input.value === "") input.value = "0";
  if (input.value.includes(".") && numbersBtns[i].id === ".") return;
  input.value =
    (input.value !== "0") | (numbersBtns[i].id === ".")
      ? `${input.value}${numbersBtns[i].id}`
      : `${numbersBtns[i].id}`;
};

//calculate result
const getResult = () => {
  if (!input.value) input.value = 0;
  if (
    expression.value.match(/[\+\-\*\/]$/)
  ) {
    expression.value = `${expression.value} ${parseFloat(input.value)}`;
    try {
      const result = eval(expression.value);
      if (isNaN(parseFloat(result)) | result === Infinity) throw new Error('result is not a number');
      input.value = result;
      history.push({ value: parseFloat(input.value), expr: expression.value });
      saveHistory();
    } catch (error) {
      input.value = `ERROR`;
    }
    showHistory();
  } else input.value = expression.value = isNaN(parseFloat(input.value)) ? "ERROR" : parseFloat(input.value);
};

//history
const readHistory = () => JSON.parse(localStorage.getItem("calc_history"));
let history = readHistory() ? readHistory() : [];
const saveHistory = () => localStorage.setItem("calc_history", JSON.stringify(history));

const historyContainer = document.querySelector(".history");
const showHistory = () => {
  historyContainer.innerHTML = "";
  if (history.length > 0) {
    history.reverse().forEach((i) => {
      historyContainer.insertAdjacentHTML(
        "afterbegin",
        `<li>${i.expr} = ${i.value}</li>`
      );
    });
  }
};
const showHistoryBtn = document.querySelector("#expand");
showHistoryBtn.addEventListener("click", () => {
  showHistoryBtn.innerText =
    showHistoryBtn.innerText === "Hide history"
      ? "Show history"
      : "Hide history";
  historyContainer.classList.toggle("active");
});

//add events for other buttons
const funcBtns = document.querySelector(".buttons1__container").children;
for (let i = 0; i < funcBtns.length; i++) {
  funcBtns[i].addEventListener("click", () =>
    handleExpr(funcBtns[i].id)
  );
}
const handleExpr = (op) => {
  if (isNaN(parseFloat(input.value))) input.value = "0";
  expression.value = `${input.value} ${op}`;
};

const resultBtn = document.querySelector("#result");
resultBtn.addEventListener("click", () => getResult());

const delBtn = document.querySelector("#delete");
delBtn.addEventListener("click", () => {
  input.value = input.value.slice(0, -1);
});

const clrBtn = document.querySelector("#clear");
clrBtn.addEventListener("click", () => (input.value = "0"));

const totalBtn = document.querySelector("#total");
totalBtn.addEventListener("click", () => {
  input.value = history.reduce((a, b) => {
    return a + b.value;
  }, 0);
  historyContainer.insertAdjacentHTML(
    "beforeend",
    `<li><b>Total:  ${input.value}</b></li>`
  );
});
const clearHistBtn = document.querySelector("#clear_history");
clearHistBtn.addEventListener("click", () => {
  history = [];
  saveHistory();
  showHistory();
})

//global listeners
const keyDown = (btn) => {
  btn.classList.add("clicked");
};

const keyUp = (btn) => {
  btn.classList.remove("clicked");
};

document.addEventListener("keydown", (e) => {
  if ((e.key === "=") | (e.key === "Enter")) {
    getResult();
    keyDown(resultBtn);
  }
  if ((e.key === "+") | (e.key === "-") | (e.key === "/") | (e.key === "*")) {
    handleExpr(e.key);
    keyDown(document.getElementById(e.key));
  }
  if (e.key === "Backspace") {
    input.value = input.value.slice(0, -1);
    keyDown(document.querySelector("#delete"));
  }
  if (e.key === "Escape") {
    input.value = "";
    keyDown(document.querySelector("#clear"));
  }
  if (parseInt(e.key) >= 0) {
    handleInput(e.key);
    keyDown(document.getElementById(e.key));
  }
  if (e.key === ".") {
    handleInput(e.key);
    keyDown(document.getElementById(e.key));
  }
  e.preventDefault();
});

document.addEventListener("keyup", (e) => {
  if ((e.key === "=") | (e.key === "Enter")) {
    keyUp(resultBtn);
  }
  if ((e.key === "+") | (e.key === "-") | (e.key === "/") | (e.key === "*")) {
    keyUp(document.getElementById(e.key));
  }
  if (e.key === "Backspace") {
    keyUp(document.querySelector("#delete"));
  }
  if (e.key === "Escape") {
    keyUp(document.querySelector("#clear"));
  }
  if (parseInt(e.key) >= 0) {
    keyUp(document.getElementById(e.key));
  }
  if (e.key === ".") {
    keyUp(document.getElementById(e.key));
  }
  e.preventDefault();
});

showHistory();
