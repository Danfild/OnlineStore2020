const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const hostname = require('./cfg').hostname;
const fs = require("fs");
const Handlebars = require("handlebars");

const transporter = nodemailer.createTransport(smtpTransport({
  service: 'smtp-mail.outlook.com', //todo я использовал яндекс, потому что гугл сильно не любит когда с гугловой почты отправляют разные приложения
  host: 'SMTP.Office365.com',
  auth: {
    user: 'technostore72@outlook.com', //todo твоя почта
    pass: 'Dan1996qaz' //todo твой пароль. ТОЛЬКО НЕ ВЗДУМАЙ ЕГО КОММИТИТЬ!!
  }
}));

const sender = '"TechnoStore" <technostore72@outlook.com>' //todo все основные почтовые сервисы требуют чтобы у тебя отпрваитель совпадал с твой твоей почтой, это плохо, но обойти кажется сложно. Хотя можно почитать какие почтовые сервисы разрешают.

const send_mail = async function(email_recipients_list, html_text, subject) { //импорти потом эту функцию куда надо

    try {
        const recipients_string = email_recipients_list.join(", ")

        let result = await transporter.sendMail({
          from: sender,
          to: recipients_string,
          subject: subject,
          html: html_text
        });

        console.log(`Письмо было отправлено. Тема: ${subject}. Адреса: ${recipients_string}`); //todo замени на logger.info
        } catch (error) {
            console.log(`Ошибка в ходе отправки письма: ${error}`) //todo замени на logger.info
        }
    };

    const content =  "Смотри, этот текст можно форматировать как <b>html</b>. This <i>message</i> was sent from <strong>Node js</strong> server. "
    const recipients = ["danfild_kazmin@mail.ru"]
    const subj = "Вам уведомление от нашего магазина"


const send_new_order_mail = function(user_email, user_name, user_id, total_price){
var order_created_mail_html = fs.readFileSync('./views/layouts/order_created_mail.hbs', 'utf8');
var order_created_mail_template = Handlebars.compile(order_created_mail_html);

var mail_data = { "user_name": user_name, "user_email": user_email, "total_price": total_price, "hostname":hostname, 'user_id':user_id};
var mail_content = order_created_mail_template(mail_data);
const subj = 'Создан новый заказ на сайте Техностор';
send_mail([user_email], mail_content, subj);
}

module.exports.send_new_order_mail = send_new_order_mail;


const send_order_status_mail = function(user_email, user_name, user_id, order_status){
var order_created_mail_html = fs.readFileSync('./views/layouts/order_status_mail.hbs', 'utf8');
var order_created_mail_template = Handlebars.compile(order_created_mail_html);

var mail_data_status = { "user_name": user_name, "user_email": user_email, 'order_status': order_status, "hostname": hostname, 'user_id':user_id};
var mail_content_status = order_created_mail_template(mail_data_status);
const subj = 'Обновлен статус вашего заказа на сайте Техностор';
send_mail([user_email], mail_content_status, subj);
}

module.exports.send_order_status_mail = send_order_status_mail;




