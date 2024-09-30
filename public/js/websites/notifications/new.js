document.addEventListener("DOMContentLoaded", () => {
    const webhookInfos = new bootstrap.Collapse(document.getElementById("webhook_info"));
    const mailInfos = new bootstrap.Collapse(document.getElementById("mail_info"), {
        toggle: false
    });

    const choices = document.querySelectorAll("input[name='type']");

    function updateCollapse(choice) {
        if (choice.id == "mail") {
            webhookInfos.hide();
            mailInfos.show();
        } else {
            webhookInfos.show();
            mailInfos.hide();
        }
    }

    choices.forEach(choice => choice.addEventListener("change", () => updateCollapse(choice)));
    updateCollapse(choices[0]);
});