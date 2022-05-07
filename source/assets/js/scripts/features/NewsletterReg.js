(function() {

    $(document).on('submit', 'form.registration-form' , function(e) {
        e.preventDefault();
        var data = {
            "channel":"HOT", 
            "email": $('#email-pre-register').val(), 
            "language": $('html').attr('lang')
        }
        
        if($('#app-store-btn').data('value') == 1) {
            $.extend(data, {"osPreferences": "IOS"});
        }

        var dataJSON = JSON.stringify(data);
        var xhr = new XMLHttpRequest();
        var url = "https://newsletter.trionworlds.com/api/subscribe";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if(xhr.status === 200) {
                    GmgSession.sendClickedRegisterEvent('', 'Landing Page');
                    $('#modal-confirm').toggleClass('open');
                    $('#modal-overlay').toggleClass('open');
                    document.getElementById("newsletter-form").reset();
                    document.getElementById("confirmation").checked = false;
                } else {
                    $('#modal-error').toggleClass('open');
                    $('#modal-overlay').toggleClass('open');
                    $('#modal-text').text("Error, please try again later.");
                }  
            }
        }
    xhr.send(dataJSON);
    });
    
}());