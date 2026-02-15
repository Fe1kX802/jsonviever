const input = document.getElementById("json-input")
const button = document.getElementById("parse-btn")
const result = document.getElementById("result")
const toggleBtn = document.getElementById("theme-toggle")

function syntaxHighlight(json) {
    json = json
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    json = json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\\s*:)?|\b(true|false|null)\b|-?\d+(\.\d+)?)/g,
        function (match) {
            let cls = "number";

            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = "key";
                } else {
                    cls = "string";
                }
            } else if (/true|false/.test(match)) {
                cls = "boolean";
            } else if (/null/.test(match)) {
                cls = "null";
            }

            return `<span class="${cls}">${match}</span>`;
        }
    );

    json = json.replace(/[\{\}]/g, function(match) {
        return `<span class="bracket_figure">${match}</span>`;
    });

    json = json.replace(/[\[\]]/g, function(match) {
        return `<span class="bracket_square">${match}</span>`;
    });

    return json;
}



if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark")
    toggleBtn.textContent = "☀️"
}

toggleBtn.addEventListener("click", function() {
    document.body.classList.toggle("dark")

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark")
        toggleBtn.textContent = "☀️"
    } else {
        localStorage.setItem("theme", "light")
        toggleBtn.textContent = "🌙"
    }
})



button.addEventListener("click", function() {
    if (input.value.trim() === "") {
        result.textContent = "Введите json"
    }
    else {
        try {
            const data = JSON.parse(input.value)
            result.classList.remove("error")
            const formatted = JSON.stringify(data, null, 2)
            result.innerHTML = syntaxHighlight(formatted)
            // console.log(data)
        } catch (error) {
            console.log("Ошибка!")

            result.classList.add("error")
            result.textContent = "Ошибка: " + error.message

        }  
    }
})
