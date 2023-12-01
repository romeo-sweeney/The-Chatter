// Check local storage for theme preference on page load and sets it
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "darkMode") {
        const theme = document.getElementById("theme");
        theme.setAttribute("href", "/resources/css/main.dark.css");
    }

    const flip = document.getElementById("darkMode");
    // if (flip) {
    flip.addEventListener("click", () => {
        toggle_style();
    });
    // }

    // CHecks if the theme is currently dark or light and toggles it
    function toggle_style() {
        const theme = document.getElementById("theme");
        if (theme.getAttribute("href") === "/resources/css/main.css") {
            theme.setAttribute("href", "/resources/css/main.dark.css");
            localStorage.setItem("theme", "darkMode");
        } else {
            theme.setAttribute("href", "/resources/css/main.css");
            localStorage.setItem("theme", "defaultMode");
        }
    }


    // controls mainpage sales banner
    const salesBannerDiv = document.getElementById("salesBanner");
    // controls admin page confirmation message
    const saleConfirmationDiv = document.getElementById("saleConfirmation");

    // controls admin page sales banner input
    const saleTextInput = document.getElementById("saleTextInput");
    // controls admin page sales banner button
    const setSaleButton = document.getElementById("setSaleButton");
    // controls admin page end sales banner button    
    const endSaleButton = document.getElementById("endSaleButton");
    // if message is empty, hide sales banner
    // else, show sales banner
    let message = "";

    if (setSaleButton) {
        setSaleButton.addEventListener("click", () => {
            message = saleTextInput.value;
            fetch('/api/sale', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({"message": message}),
            })
            .catch(error => {
                console.error('ERROR: fetch /api/sale POST ->', error);
            });
            if (saleConfirmationDiv) {
                saleConfirmationDiv.style.display = "block";
                saleConfirmationDiv.getElementsByTagName("p")[0].innerHTML = "Sales Banner was successfully set";
            }
        });
    }

    if (endSaleButton) {
        endSaleButton.addEventListener("click", () => {
            fetch('/api/sale', {
                method: 'DELETE', 
            })
            .then(response => response.json())
            .then(data => {
                if (!data.active) {
                    message = "";
                    salesBannerDiv.style.display = "none";
                }
            })
            .catch(error => {
                // console.error('ERROR: fetch /api/sale DELETE ->', error);
                console.error(error);
            });
            
            if (saleConfirmationDiv) {
                saleConfirmationDiv.style.display = "block";
                saleConfirmationDiv.getElementsByTagName("p")[0].innerHTML = "Sales Banner was successfully deleted";
            }
        });
    }

    if (salesBannerDiv) {
        setInterval(() => {
            fetch('/api/sale', {
                method: 'GET', 
            })
            .then(response => response.json())
            .then(data => {
                if (!data.active) {
                    message = "";
                    salesBannerDiv.style.display = "none";
                } else {
                    message = data.message;
                    salesBannerDiv.style.display = "block";
                    salesBannerDiv.getElementsByTagName("p")[0].innerHTML = message;
                }
            })
            .catch(error => {
                console.error('ERROR: Could not fetch "/api/sale" using GET => ', error);
            });
        }, 1000);
    }
});