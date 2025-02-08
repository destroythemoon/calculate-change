
let formatedArray = [
  ["PENNY", 0], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]
];

const cash = document.getElementById("cash");
const change = document.getElementById("change-due");
const sale = document.getElementById("purchase-btn"); 
const pric = document.getElementById("price");
const inputs = document.querySelectorAll("#cid-inputs > *")
const upToDate = document.getElementById("up-to-date")

let currencyUnits = [
  ['PENNY', 0.01],
  ['NICKEL', 0.05],
  ['DIME', 0.1],
  ['QUARTER', 0.25],
  ['ONE', 1],
  ['FIVE', 5],
  ['TEN', 10],
  ['TWENTY', 20],
  ['ONE HUNDRED', 100]
];

sale.addEventListener("click", () => {
  let price = pric.value;
  let asf = Array.from(inputs).map(input => parseInt(input.value))
  for (let i = 0; i < asf.length; i++) {
    if (isNaN(asf[i])) {
      formatedArray[i][1] = 0;
    } else {
      formatedArray[i][1] = asf[i]
    }
  }
  let cid = formatedArray;
  console.log(cid)


  const cashValue = parseFloat(cash.value);
  const cashDue = cashValue - price;

  if (cashValue < price) {
    alert("Customer does not have enough money to purchase the item")
    return;
  }

  if (cashValue === price) {
    change.innerText = "No change due - customer paid with exact cash";
    return;
  }

  const changeResult = getChange(cashDue, cid);

  if (changeResult.status === "INSUFFICIENT_FUNDS" || changeResult.status === "CLOSED") {
    change.innerText = `Status: ${changeResult.status} ${formatChange(changeResult.change)}`
  } else {
    let changeText = `Status: OPEN ${formatChange(changeResult.change)}`;
    change.innerText = changeText;
  }
})

const getChange = (changeDue, cid) => {
  let totalCid = parseFloat(cid.reduce((sum, [_, amount]) => sum + amount, 0).toFixed(2));

  if (totalCid < changeDue) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  let remainingChange = changeDue;
  let arr = [];

  for (let i = currencyUnits.length - 1; i >= 0; i--) {
    let currentUnit = currencyUnits[i][0];
    let currentUnitValue = currencyUnits[i][1];
    let currentCurrencyValue = cid[i][1];

    if (remainingChange >= currentUnitValue && currentCurrencyValue > 0) {
      let amountFromUnit = 0;

      while (remainingChange >= currentUnitValue && currentCurrencyValue > 0) {
        currentCurrencyValue -= currentUnitValue;
        remainingChange = parseFloat((remainingChange - currentUnitValue).toFixed(2));
        amountFromUnit += currentUnitValue;
      }

      if (amountFromUnit > 0) {
        arr.push([currentUnit, amountFromUnit]);
      }
    }
  }

  if (remainingChange > 0) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  if (totalCid === changeDue) {
    return { status: "CLOSED", change: cid };
  }

  return { status: "OPEN", change: arr };
};

const formatChange = changeArray => changeArray.filter(([unit, amount]) => amount > 0).map(([unit, amount]) => `${unit}: $${amount.toFixed(2)}`).join(" ");
