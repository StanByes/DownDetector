document.addEventListener("DOMContentLoaded", () => {
    const choices = document.querySelectorAll("input[name='type']");
    
    const webhookInfos = new bootstrap.Collapse(document.getElementById("webhook_info"), {
        toggle: choices[0].checked
    });
    const mailInfos = new bootstrap.Collapse(document.getElementById("mail_info"), {
        toggle: choices[1].checked
    });

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
    updateCollapse(choices[0].checked ? choices[0] : choices[1]);
});