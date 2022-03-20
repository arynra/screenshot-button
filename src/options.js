function save(event) {
    const dest = event.target.elements.destination.value;
    chrome.storage.sync.set({
        destination: dest
    }, function() {
        var status = document.querySelector("#status");
        status.textContent = chrome.i18n.getMessage("optionsSaved");
        setTimeout(function() {
            status.textContent = "";
        }, 750);
    });
    event.preventDefault();
}

document.querySelectorAll("[data-i18n-text]").forEach(element => {
    const key = element.getAttribute("data-i18n-text");
    element.textContent = chrome.i18n.getMessage(key);
});

const form = document.forms.options;
chrome.storage.sync.get({
    destination: "file"
}, function(items) {
    form.destination.value = items.destination;
});

form.addEventListener("submit", save);
