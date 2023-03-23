all_dates = {
    'zurich': {
        "date" : "April 28, 2023 09:00:00",
        "background" : "url('/res/images/zurich.jpg')"
    },
    'lausanne': {
        "date" : "May 8, 2023 09:00:00",
        "background" : "url('/res/images/lausanne.jpg')"
    },
    'basel': {
        "date" : "June 2, 2023 09:00:00",
        "background" : "url('/res/images/basel.jpg')"
    }
}

// Get the next date based on today's date
next_event = null;
for (var key in all_dates) {
    next_event = all_dates[key];
    if (Date.parse(next_event.date) > Date.now()) {
        break;
    }
}

$('.countdown-timer').countdown({
    date: next_event.date,
    render: function(data) {
        $(".days .value").html(this.leadingZeros(data.days, 2));
        $(".hours .value").html(this.leadingZeros(data.hours, 2));
        $(".minutes .value").html(this.leadingZeros(data.min, 2));
        $(".seconds .value").html(this.leadingZeros(data.sec, 2));
    }
});

$('#countdown-title > #countdown-location').html(key);
$('#home-bg-parallax > .bg-parallax').css('background-image', next_event.background);
