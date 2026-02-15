const input = document.getElementById("json-input")
const parseBtn = document.getElementById("parse-btn")
const result = document.getElementById("result")
const toggleBtn = document.getElementById("theme-toggle")
const fileButton = document.getElementById("filebutton")
const hiddenFileInput = document.getElementById("hiddenfile")

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
                cls = /:$/.test(match) ? "key" : "string";
            } else if (/true|false/.test(match)) {
                cls = "boolean";
            } else if (/null/.test(match)) {
                cls = "null";
            }
            return `<span class="${cls}">${match}</span>`;
        }
    );

    json = json.replace(/[\{\}]/g, m => `<span class="bracket_figure">${m}</span>`);
    json = json.replace(/[\[\]]/g, m => `<span class="bracket_square">${m}</span>`);

    return json;
}

function processJSON(text) {
    if (text.trim() === "") {
        result.textContent = "Введите JSON";
        result.classList.add("error");
        return;
    }
    try {
        const data = JSON.parse(text);
        result.classList.remove("error");
        const formatted = JSON.stringify(data, null, 2);
        result.innerHTML = syntaxHighlight(formatted);
    } catch (error) {
        result.classList.add("error");
        result.textContent = "Ошибка: " + error.message;
    }
}

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️";
}

toggleBtn.addEventListener("click", function() {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        toggleBtn.textContent = "☀️";
    } else {
        localStorage.setItem("theme", "light");
        toggleBtn.textContent = "🌙";
    }
});

fileButton.addEventListener("click", () => hiddenFileInput.click());

hiddenFileInput.addEventListener("change", function() {
    const file = hiddenFileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        processJSON(e.target.result);
    };
    reader.readAsText(file);
});

parseBtn.addEventListener("click", () => processJSON(input.value));
