(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Sidebar Toggler
    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content').toggleClass("open");
        return false;
    });


    // Progress Bar
    $('.pg-bar').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Calender
    $('#calender').datetimepicker({
        inline: true,
        format: 'L'
    });

    // Chart Global Color
    Chart.defaults.color = "#6C7293";
    Chart.defaults.borderColor = "#000000";

    //Dropdown
    $('#country-predictions-dropdown li').click(function(){
        $('#country-predictions-span').text($(this).text());
      });

      $('#platform-predictions-dropdown li').click(function(){
        $('#platform-predictions-span').text($(this).text());
      }); 

      var inputData2 = {
        "startDate": "",
        "endDate":"",
        "country":"",
        "platform": ""
    };

    //onchange listeneners
    $("#predictions-start-date").datepicker({
        onSelect: function(dateText) {
            var splitDate = dateText.split('/');
            var newFormat = splitDate[2] + '-' + splitDate[1] + '-' + splitDate[0];
            console.log("Selected date: " + dateText + "; input's current value: " + this.value);
            inputData2["startDate"] = newFormat;
            getUserPredictions(inputData2);
        }
    });

      $("#predictions-end-date").datepicker({
        onSelect: function(dateText) {
            var splitDate = dateText.split('/');
            var newFormat = splitDate[2] + '-' + splitDate[1] + '-' + splitDate[0];
            console.log("Selected date: " + newFormat + "; input's current value: " + this.value);
            inputData2["endDate"] = newFormat;
            getUserPredictions(inputData2);
        }
    });

    $('#country-predictions-dropdown li').click(function() {
        inputData2["country"] = $(this).attr("val");
        getUserPredictions(inputData2);
    });

    $('#platform-predictions-ul li').click(function() {
        inputData2["platform"] = $(this).attr("val");
        getUserPredictions(inputData2);
    });

    //Create chart objects
    var ctx1 = $("#active-users").get(0).getContext("2d");
    var myChart1 = new Chart(ctx1, {
        type: "line",
        data: {
        labels: [],
        datasets: [{
            label: "Users",
            data: [],
            backgroundColor: "rgba(235, 22, 22, .7)",
            fill: true
        }
        ]
    },
    options: {
        responsive: true
        }
    });

    //default
    getUserPredictions(inputData2);

    function createChart(canvas_id, resp_labels, resp_data, chart_type, new_backgroundColor) {
        var ctx = $(canvas_id).get(0).getContext("2d");
            var myChart1 = new Chart(ctx, {
                type: chart_type,
                data: {
                labels: resp_labels,
                datasets: [{
                    label: "Users",
                    data: resp_data,
                    backgroundColor: new_backgroundColor,
                    fill: true
                }
                ]
            },
            options: {
                responsive: true
                }
            });
        
        return myChart1;
    }
    
    function removeData(chart) {
        chart.destroy();
    }

    function getUserPredictions(inputData2) {
        $.post("/getUsersPrediction",
        inputData2,
        function (data, status) {
            var resp = {
                labels: [],
                data: []
            };
            resp.labels = data.labels;
            resp.data = data.data;
            removeData(myChart1);
            myChart1 = createChart('', resp.labels, resp.data, "line", ["rgba(235, 22, 22, .7)"]);
        });
    }
    
})(jQuery);
