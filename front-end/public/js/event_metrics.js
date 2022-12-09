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

    //Dropdown
    $('#languages-dropdown li').click(function(){
        $('#languages-span').text($(this).text());
      });
    
    $('#event-metrics-dropdown li').click(function(){
        $('#event-metrics-span').text($(this).text());
    });

    // Chart Global Color
    Chart.defaults.color = "#6C7293";
    Chart.defaults.borderColor = "#000000";


    //AJAX Queries

    $.ajax({
        url: "/getUserAction",
        type:'POST',
        data: { data: "dummy" },
        dataType: 'json',
        success: function(response) {
            console.log("Response Labels" + response.labels);
            var ctx5 = $("#user-action-metrics").get(0).getContext("2d");
            var myChart5 = new Chart(ctx5, {
                type: "bar",
                data: {
                labels: response.labels,
                datasets: [{
                    label: "Users",
                    data: response.data,
                    backgroundColor: "rgba(235, 22, 22, .7)",
                    fill: true
                    }]
                },
                options: {
                    responsive: true
                }
            });
        },
        error: function(xhr) {
        //Do Something to handle error
        }
    });

    // Top Programming Languages
    $.post("/topProgrammingLanguages",
        {
            data: "dummy",
        },
        function (data, status) {
            var resp = {
                labels: [],
                data: []
            };
            resp.labels = data.labels;
            resp.data = data.data;
            var ctx6 = $("#top-programming-languages").get(0).getContext("2d");
            var myChart6 = new Chart(ctx6, {
                type: "pie",
                data: {
                    labels: resp.labels,
                    datasets: [{
                        label: 'Users',
                        backgroundColor: [
                            "rgba(235, 22, 22, .7)",
                            "rgba(235, 22, 22, .4)"
                        ],
                    data: resp.data
                }]
            },
            options: {
                responsive: true
            }
        });
    });
    
    // get live preview
    $.post("/getLivePreview",
        {
            data: "dummy",
        },
        function (data, status) {
            var resp = {
                labels: [],
                data: []
            };
            resp.labels = data.labels;
            resp.data = data.data;
            var ctx7 = $("#countries-live-preview").get(0).getContext("2d");
            var myChart7 = new Chart(ctx7, {
                type: "bar",
                data: {
                labels: resp.labels,
                datasets: [{
                    label: "Users",
                    data: resp.data,
                    backgroundColor: "rgba(235, 22, 22, .7)",
                    fill: true
                }
                ]
            },
            options: {
                responsive: true
                }
            });
    });

})(jQuery);

