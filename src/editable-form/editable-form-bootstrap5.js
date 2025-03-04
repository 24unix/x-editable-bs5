/*
Editableform based on Bootstrap 5 (No jQuery)
*/
(() => {
    "use strict";

    class EditableForm {
        constructor(formElement, inputOptions = {}) {
            this.formElement = formElement;
            this.inputOptions = inputOptions;
            this.inputType = inputOptions.type || "text";
            this.initInput();
        }

        initInput() {
            // Supported input types
            const stdTypes = ["text", "select", "textarea", "password", "email", "url", "tel", "number", "range", "time", "typeaheadjs"];

            if (stdTypes.includes(this.inputType)) {
                this.formElement.classList.add("form-control", "editable");
            }

            // Automatically open select dropdown when clicked
            if (this.inputType === "select") {
                setTimeout(() => {
                    this.formElement.focus();
                    this.formElement.click();
                }, 50);
            }

            // Apply Bootstrap 5 button size classes
            const buttonContainer = this.formElement.closest(".editable-buttons");
            if (buttonContainer) {
                if (this.inputOptions.inputClass && this.inputOptions.inputClass.includes("input-lg")) {
                    buttonContainer.querySelectorAll("button").forEach(btn => btn.classList.add("btn-lg"));
                }
            }
        }
    }

    // Create buttons dynamically
    function createEditableButtons() {
        const btnContainer = document.createElement("div");
        btnContainer.classList.add("editable-buttons");

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.classList.add("btn", "btn-primary", "btn-sm", "editable-submit");
        submitButton.innerHTML = '<i class="bi bi-check"></i>';

        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.classList.add("btn", "btn-secondary", "btn-sm", "editable-cancel");
        cancelButton.innerHTML = '<i class="bi bi-x"></i>';

        btnContainer.appendChild(submitButton);
        btnContainer.appendChild(cancelButton);

        return btnContainer;
    }

    // Apply Bootstrap 5 validation classes
    function applyErrorStyles(element) {
        element.classList.add("is-invalid");
        const errorBlock = document.createElement("div");
        errorBlock.classList.add("invalid-feedback");
        errorBlock.innerText = "Invalid input"; // You can dynamically update this message
        element.after(errorBlock);
    }

})();