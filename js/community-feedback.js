// Community feedback page - validation and submission
(function () {
  var form = document.querySelector("#feedback-form");
  if (!form) return;

  var isArabicPage =
    (document.documentElement.lang || "").toLowerCase().startsWith("ar") ||
    document.documentElement.dir === "rtl" ||
    document.body.classList.contains("arabic-page") ||
    !!document.querySelector(".arabic-page");

  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var nameRegex = /^[A-Za-z\s\u0600-\u06FF]{2,}$/;

  var errorMessages = isArabicPage
    ? {
        name: "يرجى إدخال اسم صحيح (حرفان على الأقل، حروف فقط)",
        email: "يرجى إدخال بريد إلكتروني صحيح",
        message: "يرجى إدخال رسالتك",
      }
    : {
        name: "Please enter a valid name (at least 2 characters, letters only)",
        email: "Please enter a valid email address",
        message: "Please enter your message",
      };

  function showError(field, message) {
    clearError(field);
    var wrapper = field.closest(".feedback-field") || field.closest(".enquiry-field") || field.parentElement;
    field.classList.add("enquiry-field--error");
    field.style.borderColor = "#BB133E";
    field.style.borderWidth = "2px";
    var errorEl = document.createElement("span");
    errorEl.className = "enquiry-field__error";
    errorEl.textContent = message;
    errorEl.style.color = "#BB133E";
    errorEl.style.fontSize = "12px";
    errorEl.style.marginTop = "4px";
    errorEl.style.display = "block";
    wrapper.appendChild(errorEl);
  }

  function clearError(field) {
    field.classList.remove("enquiry-field--error");
    field.style.borderColor = "";
    field.style.borderWidth = "";
    var wrapper = field.closest(".feedback-field") || field.closest(".enquiry-field") || field.parentElement;
    var existing = wrapper.querySelector(".enquiry-field__error");
    if (existing) existing.remove();
  }

  function clearAllErrors() {
    form.querySelectorAll(".enquiry-field__error").forEach(function (el) { el.remove(); });
    form.querySelectorAll(".enquiry-field--error").forEach(function (el) { el.classList.remove("enquiry-field--error"); });
  }

  function validateForm() {
    clearAllErrors();
    var isValid = true;

    var nameInput = form.querySelector("#feedback-name");
    var emailInput = form.querySelector("#feedback-email");
    var messageInput = form.querySelector("#feedback-message");
    var firstErrorField = null;

    // Validate name - required and proper format
    if (!nameInput.value.trim()) {
      var nameErrorMsg = isArabicPage ? "الاسم مطلوب" : "Name is required";
      showError(nameInput, nameErrorMsg);
      isValid = false;
      if (!firstErrorField) firstErrorField = nameInput;
    } else if (!nameRegex.test(nameInput.value.trim())) {
      showError(nameInput, errorMessages.name);
      isValid = false;
      if (!firstErrorField) firstErrorField = nameInput;
    }

    // Validate email - required and proper format
    if (!emailInput.value.trim()) {
      var emailRequiredMsg = isArabicPage ? "البريد الإلكتروني مطلوب" : "Email is required";
      showError(emailInput, emailRequiredMsg);
      isValid = false;
      if (!firstErrorField) firstErrorField = emailInput;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, errorMessages.email);
      isValid = false;
      if (!firstErrorField) firstErrorField = emailInput;
    }

    // Validate message - required
    if (!messageInput.value.trim()) {
      var messageRequiredMsg = isArabicPage ? "الرسالة مطلوبة" : "Message is required";
      showError(messageInput, messageRequiredMsg);
      isValid = false;
      if (!firstErrorField) firstErrorField = messageInput;
    }

    // Scroll to first error field if validation fails
    if (!isValid && firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      firstErrorField.focus();
    }

    return isValid;
  }

  ["#feedback-name", "#feedback-email", "#feedback-message"].forEach(function (selector) {
    var element = form.querySelector(selector);
    if (element) {
      element.addEventListener("input", function () { clearError(element); });
      element.addEventListener("change", function () { clearError(element); });
    }
  });

  var isSubmitting = false;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Prevent double submission
    if (isSubmitting) return;

    if (!validateForm()) {
      console.log("Form validation failed - not submitted");
      return;
    }

    isSubmitting = true;
    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      var originalText = submitBtn.textContent;
      submitBtn.textContent = isArabicPage ? "جاري الإرسال..." : "Submitting...";
    }

    var nameInput = form.querySelector("#feedback-name");
    var emailInput = form.querySelector("#feedback-email");
    var messageInput = form.querySelector("#feedback-message");

    var formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
    };

    feedbackSubmit(formData, submitBtn, originalText);
  });

  function feedbackSubmit(data, submitBtn, originalText) {
    var dynamicURLRegister = "/PA_Lead_Capture_Service/daralmarefafeedback";
    var dataString =
      "name=" + encodeURIComponent(data.name) +
      "&email=" + encodeURIComponent(data.email) +
      "&message=" + encodeURIComponent(data.message);

    $.ajax({
      url: dynamicURLRegister,
      method: "POST",
      data: dataString,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: function (response) {
        if (response == "SUCCESS") {
          console.log("Form submitted successfully!");
          showSuccessMessage();
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: "feedback_submitted" });
        } else {
          console.log("Form submission failed");
          showErrorMessage();
          // Re-enable button on error
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            isSubmitting = false;
          }
        }
      },
      error: function () {
        console.log("Form submission error");
        showErrorMessage();
        // Re-enable button on error
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          isSubmitting = false;
        }
      },
    });
  }

  function showSuccessMessage() {
    var successMsg = isArabicPage
      ? "شكراً لإرسال ملاحظاتك، سيتواصل معك فريقنا قريباً."
      : "Thank you for your feedback, our team will contact you shortly.";

    form.innerHTML =
      '<div class="enquiry-form__success">' +
      '<p class="enquiry-form__success-text">' + successMsg + "</p>" +
      "</div>";

    form.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function showErrorMessage() {
    var errMsg = isArabicPage
      ? "حدث خطأ ما، يرجى المحاولة مرة أخرى."
      : "Something went wrong, please try again.";

    clearAllErrors();
    var existing = form.querySelector(".enquiry-form__general-error");
    if (existing) existing.remove();

    var errEl = document.createElement("div");
    errEl.className = "enquiry-form__general-error enquiry-field__error";
    errEl.style.marginTop = "16px";
    errEl.style.marginBottom = "16px";
    errEl.style.padding = "12px 16px";
    errEl.style.textAlign = "center";
    errEl.style.backgroundColor = "#ffe6e6";
    errEl.style.borderLeft = "4px solid #BB133E";
    errEl.style.color = "#BB133E";
    errEl.style.fontSize = "14px";
    errEl.textContent = errMsg;
    form.insertBefore(errEl, form.firstChild);
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  }
})();
