function registerWebinarUser() {
    $('#subscribeMessage').html('');
    var first_name = $(".contact_first_name").val();
    var last_name = $(".contact_last_name").val();
    var email = $(".contact_email").val();
    var phone = $(".contact_phone").val();
    var job_title = $(".contact_job_title").val();
    var company = $(".contact_company").val();
    var country = $(".contact_country").val();
    var state = $(".contact_state").val();
    var webinar_id = $(".w_id").val();
    var pardot_id = $(".pdep").val();


    $.post("/webinarRegistration.php", {
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone,
        job_title: job_title,
        company: company,
        country: country,
        state: state,
        webinar_id: webinar_id,
        pdep: pardot_id
    },
            function (response, status) {
                if (response == 1) {
                    $(".cWebinarForm").html('<img class="cCloseButton" data-dismiss="modal" src="/img/close.svg"/>');
                    $(".cWebinarForm").append('<p class="cFormMSG">You have successfully signed up for the webinar.</p>');
                    $(".cWebinarForm").append('<p class="cFormMSG">Please check your inbox for registration details and credentials to access the webinar.</p>');
                }else{
                    $(".cWebinarForm").html('<img class="cCloseButton" data-dismiss="modal" src="/img/close.svg"/>');
                    $(".cWebinarForm").append('<p class="cFormMSG">There was an issue with your registration. Please try again or contact us at <a href="mailto:webinars@ballerina.io" target="_top">webinars@ballerina.io</a>.</p>');
                }
            }
    );

    return false;
}

$(document).ready(function () {
    $('#webinarForm').validate({
        rules: {
            first_name: "required",
            last_name: "required",
            email: {
                required: true,
                email: true
            },
            phone: "required",
            company: "required",
            country: "required",
            job_title: "required"
        },
        messages: {
            first_name: "Please enter your first name",
            last_name: "Please enter your last name",
            email: {
                required: "Please enter your email",
                email: "Please enter a valid email"
            },
            phone: "Please enter your contact number",
            company: "Please enter your company",
            country: "Please enter your country",
            job_title: "Please enter your job title",

        }, highlight: function (element) {
            $(element).addClass('form-error');

        }, unhighlight: function (element) {
            $(element).removeClass('form-error');

        }, submitHandler: function (form) {
            $(".cSubmitButton").attr("disabled", true);
            registerWebinarUser();
            $(".cWebinarForm").html('<img class="cCloseButton" data-dismiss="modal" src="/img/close.svg"/><span>Processing your registration ...</span>');
            return false;

        }
    });
});
