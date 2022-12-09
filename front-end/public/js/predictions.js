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
    $('#country-dropdown li').click(function(){
        $('#country-span').text($(this).text());
      });

      $('#platform-dropdown li').click(function(){
        $('#platform-span').text($(this).text());
      }); 


    // Chart Global Color
    Chart.defaults.color = "#6C7293";
    Chart.defaults.borderColor = "#000000";

//     $.post("/getUsersPrediction",
//         {
//             data: "dummy",
//         },
//         function (data, status) {
//             var resp = {
//                 labels: [],
//                 data: []
//             };
//             resp.labels = data.labels;
//             resp.data = data.data;
//             var ctx1 = $("#active-users").get(0).getContext("2d");
//             var myChart1 = new Chart(ctx1, {
//                 type: "line",
//                 data: {
//                 labels: resp.labels,
//                 datasets: [{
//                     label: "Users",
//                     data: resp.data,
//                     backgroundColor: "rgba(235, 22, 22, .7)",
//                     fill: true
//                 }
//                 ]
//             },
//             options: {
//                 responsive: true
//                 }
//             });

//       // Active Users Chart
//     var ctx1 = $("#active-users").get(0).getContext("2d");
//     var myChart1 = new Chart(ctx1, {
//         type: "line",
//         data: {
//             labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
//             datasets: [{
//                     label: "Users",
//                     data: [15, 30, 55, 65, 60, 80, 95],
//                     backgroundColor: "rgba(235, 22, 22, .7)",
//                     fill: true
//                 }
//             ]
//             },
//         options: {
//             responsive: true
//         }
//     });
    
//     // Active Users Chart
//     var ctx1 = $("#active-users").get(0).getContext("2d");
//     var myChart1 = new Chart(ctx1, {
//         type: "line",
//         data: {
//             labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
//             datasets: [{
//                     label: "Users",
//                     data: [15, 30, 55, 65, 60, 80, 95],
//                     backgroundColor: "rgba(235, 22, 22, .7)",
//                     fill: true
//                 }
//             ]
//             },
//         options: {
//             responsive: true
//         }
//     });

//     // Active Users Chart
//     var ctx1 = $("#active-users").get(0).getContext("2d");
//     var myChart1 = new Chart(ctx1, {
//         type: "line",
//         data: {
//             labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
//             datasets: [{
//                     label: "Users",
//                     data: [15, 30, 55, 65, 60, 80, 95],
//                     backgroundColor: "rgba(235, 22, 22, .7)",
//                     fill: true
//                 }
//             ]
//             },
//         options: {
//             responsive: true
//         }
//     });
    
// })
})(jQuery);
