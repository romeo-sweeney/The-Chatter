const service = document.getElementById("service");
const paymentType = document.getElementById("paymentType");
const calc = document.getElementById("calculation");
let total = 10;

// If the service type changes, we want to recalculate the total
if (service) {
    service.addEventListener("change", () => {
        handleEvent();
    });
}

// If the paymentType changes, we want to recalculate the total
if (paymentType) {
    paymentType.addEventListener("change", () => {
        handleEvent();
    });
}

function handleEvent() {
    // Gets the current service value based on the service type selected
    getServiceValue();
    // Checks if the paymentType is checked and applies discount if it is
    if (paymentType.checked) {
        calcDiscount();
    }

    calc.innerText = "Total: $" + total;
}

// Subtracts the current total by 5% and sets the new total
function calcDiscount() {
    total -= (total*.05);
}

// Selects the total $ amount based on the service selected
function getServiceValue() {
    if (service.value === "instore") {
        total = 10;
    } else if (service.value === "oneLesson") {
        total = 20;
    } else if (service.value === "twoLessons") {
        total = 30;
    } else if (service.value === "unlimited") {
        total = 50;
    } else {
        // error
        total = 0;
    }
}