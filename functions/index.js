const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
// const adminEmail = functions.config().admin.email;

//  メールサーバの設定
const mailTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});

//  管理者用のメールテンプレート
const adminContents = (data) => {
    return `以下内容でお問い合わせを受け付けました。

お名前:
${data.name}

メールアドレス:
${data.email}

内容:
${data.content}
`;
};

exports.sendMail = functions.https.onCall((data, context) => {
    //  メール設定
    let email = {
        from: gmailEmail,
        to: data.email,
        bcc: gmailEmail,
        subject: "【SOKOCODE】お問い合わせ",
        text: adminContents(data),
    };

    //  管理者へのメール送信
    mailTransport.sendMail(email, (err, info) => {
        if (err) {
            return console.error(`send failed. ${err}`);
        }
        return console.log("send success.");
    });
});
