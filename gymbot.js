
var schedule = require('node-schedule');
var request = require('request');
var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'notifications.ej@gmail.com',
        pass: '3JSQ614!'
    }
});


var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [6, 1, 3];
rule.hour = [01, 02];
rule.minute = 00;
rule.second = 00;


schedule.scheduleJob(rule, function () {
    gymbook();
});



var gymdate = function () {
    var d = new Date();
    d.setTime(d.getTime() + (68 * 60 * 60 * 1000));
    date = d.toISOString().substring(0, 10);
    hour = d.getHours() - 1;
    weekday = d.toLocaleString('en-US', { weekday: 'long' });
    return [date, hour, weekday];
}

var gymtime = function (h) {
    if (h < 10) {
        return ('0' + h.toString())
    }
    else {
        return h.toString()
    }
}

var gymbook = function () {

    console.log(Date())

    const url1 = 'https://d1va2v45wuqutp.cloudfront.net/v1/accounts/auth/tokens?scope=ga2b75sz815wn5xnp8ryvkhy00&subject=z2yj97n0kn5jffycws79fw0b9m&password=277833&context=te6cyadahx57v5rvf210sjaj1c';

    const url2_part1 = 'https://d1va2v45wuqutp.cloudfront.net/v1/permits/temporary?issue=true&location=ga2b75sz815wn5xnp8ryvkhy00&policy=te6cyadahx57v5rvf210sjaj1c&valid=';
    const url2_part2 = '&unit=z2yj97n0kn5jffycws79fw0b9m&notes=Ebin+Joby&tel=9176559789&email=ebinjoby13%40gmail.com&agreement=true&Authorization=bearer+';

    var time = gymdate()

    var url2_date = time[0] + 'T' + gymtime(time[1]) + ':00:00.000-04:00/' + time[0] + 'T' + gymtime(time[1] + 1) + ':00:00.000-04:00';
    console.log(url2_date)


    request.post(url1, function (error, res, body) {

        console.log(`statusCode: ${res.statusCode}`);

        if (error) {
            console.error(error);
            return
        }


        if (res) {
            var object1 = JSON.parse(res.body);

            var url_final = url2_part1 + url2_date + url2_part2 + object1.token;

            request.post(url_final, function (error, res, body) {

                console.log(`statusCode: ${res.statusCode}`)

                if (error) {
                    console.error(error);
                    return
                }

                if (res) {

                    var object2 = JSON.parse(res.body);

                    if (object2.message) {
                        console.log(object2.message);

                        var mailOptions = {
                            from: 'notifications.ej@gmail.com',
                            to: 'ebinjoby13@gmail.com, aakarsh.g2012@gmail.com',
                            subject: 'GYM NOT BOOKED!',
                            text: 'Unsuccessfully attempted reservation for ' + time[2] + ', ' + time[0] + ', at ' + (time[1] % 12) + ' PM!\n\n'
                                + object2.message + '\n\nSee current reservations at https://amenitypass.app/properties/ga2b75sz815wn5xnp8ryvkhy00'
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                    }

                    else {
                        console.log("Gym Booking Success");

                        if (object2.locations) {

                            var mailOptions = {
                                from: 'notifications.ej@gmail.com',
                                to: 'ebinjoby13@gmail.com, aakarsh.g2012@gmail.com',
                                subject: 'GYM BOOKED!',
                                text: 'Get ready for the gym on ' + time[2] + ', ' + time[0] + ', at ' + (time[1] % 12) + ' PM!'
                                    + '\n\nTime to get ripped son!!!\n\nSee reservation at https://amenitypass.app/properties/ga2b75sz815wn5xnp8ryvkhy00'
                            };

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                            });
                        }
                    }
                }
            })
        }
    })
}






