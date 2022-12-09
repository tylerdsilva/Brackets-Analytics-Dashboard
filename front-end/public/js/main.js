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
    $('#country-index-dropdown li').click(function(){
        $('#country-index-span').text($(this).text());
      });

      $('#platform-index-dropdown li').click(function(){
        $('#platform-index-span').text($(this).text());
      }); 


    // Chart Global Color
    Chart.defaults.color = "#6C7293";
    Chart.defaults.borderColor = "#000000";

    // get Active Users
    $.post("/getActiveUsers",
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
            var ctx1 = $("#active-users").get(0).getContext("2d");
            var myChart1 = new Chart(ctx1, {
                type: "line",
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

    // get Returning Users
    $.post("/getReturningUsers",
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
            var ctx2 = $("#returning-users").get(0).getContext("2d");
            var myChart2 = new Chart(ctx2, {
                type: "line",
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

    // get Platform Users
    $.post("/perPlatformUsers",
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
            var ctx3 = $("#per-platform-users").get(0).getContext("2d");
            var myChart3 = new Chart(ctx3, {
                type: "pie",
                data: {
                    labels: resp.labels,
                    datasets: [{
                        label: 'Users',
                        backgroundColor: [
                            "rgba(235, 22, 22, .7)",
                            "rgba(235, 22, 22, .5)",
                            "rgba(235, 22, 22, .2)"
                        ],
                        data: resp.data
                    }]
                },
                options: {
                    responsive: true
                }
            });
    });

    // get Top Countries
    $.post("/getTopCountries",
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
            var ctx4 = $("#top-countries").get(0).getContext("2d");
            var myChart4 = new Chart(ctx4, {
                type: "bar",
                data: {
                labels: ["Italy", "France", "Spain", "USA", "Argentina"],
                datasets: [{
                    label: 'Users', 
                    backgroundColor: [
                        "rgba(235, 22, 22, .7)",
                        "rgba(235, 22, 22, .6)",
                        "rgba(235, 22, 22, .5)",
                        "rgba(235, 22, 22, .4)",
                        "rgba(235, 22, 22, .3)"
                    ],
                data: [55, 49, 44, 24, 15]
                }]
                },
                options: {
                    responsive: true
                }
            });
    });
    
})(jQuery);

