import React, { useEffect, useState } from "react";
import Editor from "./Editor";
import Split from "react-split";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faDownload,
    faEraser,
    faInfoCircle,
    faPager,
    faCopy,
} from "@fortawesome/free-solid-svg-icons";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Tooltip from "@material-ui/core/Tooltip";
import CopyToClipBoard from "react-copy-to-clipboard";
import firebase from "../utils/Firebase";
import FormDialog from "./FormDialog";
import EmDialog from "./EmDialog";
import Contact from "./Contact";
import PageDialog from "./PageDialog";
import Skyway from "./Skyway";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import { useSpeechSynthesis } from "react-speech-kit";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import { faGithub } from "@fortawesome/free-brands-svg-icons";
// import LocalStorage from "../hooks/useLocalStorage";
const database = firebase.database();
const rangeRndm = function (min, max) {
    if (max) {
        return (Math.random() * (max - min + 1) + min) | 0;
    } else {
        return (Math.random() * min) | 0;
    }
};
const myColor = "hsl(" + rangeRndm(0, 360) + ", 100%, 75%)";

const introDoc = `<html>
      <body>
        <div style="height: 100vh; background-image: radial-gradient(circle, #263238, #212226);">
        <div style="font-family: 'Lato'" class="intro-text">
        <h1 style="font-size: 30px"><br>
        はじめてみよう<span style="font-family: 'Rubik'; color:#b8b8b8">プログラミング</span>
        </h1>
        <br><br><br>
        <h2 style="font-size: 20px">
        同じページにアクセスしているユーザーとリアルタイムな共有ができます<br>
        接続ボタンからチャットに参加、マイクボタンはミュート機能になります<br>
        ページボタンでプレビュー、HTML、CSS、JSの各ボタンからファイルを
        <br>ダウンロードで保存してください、ページは<span style="font-family: 'Rubik'; color:#ba000d">
        一定期間後に消去</span>されます
        </h2><br><br><br>
        <footer>
        </footer>
      </body>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300&family=Rubik&display=swap');
        * {
            box-sizing: border-box; margin: 0; padding: 0;
        }
        .intro-text {
            color: gray; text-align: center; position: absolute; top: 50%; left: 50%; -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%);
        }
      </style>
    </html>`;

function App() {
    // const [html, setHtml] = LocalStorage("html", "");
    // const [css, setCss] = LocalStorage("css", "");
    // const [js, setJs] = LocalStorage("js", "");
    // const [title, setTitle] = LocalStorage("title", "");
    const { speak } = useSpeechSynthesis();
    const [srcDoc, setSrcDoc] = useState("");
    const [html, setHtml] = useState("");
    const [css, setCss] = useState("");
    const [js, setJs] = useState("");
    const [value, setValue] = useState("");
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(false);
    const [info, setInfo] = useState(false);
    const [openTip, setOpenTip] = useState(false);
    const [emerge, setEmerge] = useState(false);
    const [page, setPage] = useState(false);
    const [count, setCount] = useState(0);
    const [text, setText] = useState("");
    const [speakOn, setSpeakOn] = useState("");
    const [listen, setListen] = useState(true);
    const [color, setColor] = useState("");

    const title = value;

    useEffect(() => {
        setOpen(true);

        database.ref("data/" + title + "/html").on("value", (data) => {
            setHtml(data.val());
        });

        database.ref("data/" + title + "/css").on("value", (data) => {
            setCss(data.val());
        });

        database.ref("data/" + title + "/js").on("value", (data) => {
            setJs(data.val());
        });

        database.ref("data/" + title + "/count").on("value", (data) => {
            setCount(data.val());
        });
        database.ref("text/" + title + "/speak").set("");
    }, [title]);

    const downloadHtml = () => {
        let htmlContent = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>${title}</title>
        <link rel="stylesheet" href="./styles.css">
    </head>
    <body>${html}</body>
    <script src="./script.js"></script>
</html>
            `;
        let link = document.getElementById("download-btn-html");
        let file = new Blob([htmlContent], { type: "html" });
        let downloadFile = "index.html";
        link.target = "_blank";
        link.href = URL.createObjectURL(file);
        link.download = downloadFile;
    };
    const downloadCss = () => {
        // CSS
        let cssLink = document.getElementById("download-btn-css");
        let cssFile = new Blob([css], { type: "css" });
        let cssDownloadFile = "styles.css";
        cssLink.target = "_blank";
        cssLink.href = URL.createObjectURL(cssFile);
        cssLink.download = cssDownloadFile;
    };
    const downloadJs = () => {
        // JS
        let jsLink = document.getElementById("download-btn-js");
        let jsFile = new Blob([js], { type: "js" });
        let jsDownloadFile = "script.js";
        jsLink.target = "_blank";
        jsLink.href = URL.createObjectURL(jsFile);
        jsLink.download = jsDownloadFile;
    };

    const clearEditor = () => {
        database.ref("data/" + title + "/html").set("");
        database.ref("data/" + title + "/css").set("");
        database.ref("data/" + title + "/js").set("");
        setEmerge(false);
    };

    const infoOpen = () => {
        if (info === false) {
            setInfo(true);
        } else {
            setInfo(false);
        }
    };

    const pageOpen = () => {
        if (page === false) {
            setPage(true);
        } else {
            setPage(false);
        }
    };

    const infoClose = () => {
        setInfo(false);
    };

    const handleCloseTip = () => {
        setOpenTip(false);
    };

    const handleClickButton = () => {
        setOpenTip(true);
    };

    // const handleOpen = () => {
    //     setOpen(true);
    // };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEmerge = () => {
        setEmerge(true);
    };

    const setsHtml = (value) => {
        database.ref("data/" + title + "/html").set(value);
    };

    const setsCss = (value) => {
        database.ref("data/" + title + "/css").set(value);
    };

    const setsJs = (value) => {
        database.ref("data/" + title + "/js").set(value);
    };

    const listenChange = () => {
        setListen(!listen);
    };

    useEffect(() => {
        if (title === "") {
            document.title = "SONOCODE";
        } else {
            document.title = "SONOCODE - " + title;
        }

        if (!(html === "" && css === "" && js === "")) {
            document.getElementById("iframe").classList.remove("disblock");
            document.getElementById("intro").classList.add("disblock");
        }

        const timeout = setTimeout(() => {
            setSrcDoc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>
      `);
        }, 250);

        return () => clearTimeout(timeout);
    }, [html, css, js, title]);

    useEffect(() => {
        window.addEventListener("beforeunload", (ev) => {
            ev.preventDefault();
            return (ev.returnValue = "Changes you made will not be saved.");
        });
    });

    const setsSpeak = () => {
        database.ref("text/" + value + "/listen").set(speakOn);
        database.ref("text/" + value + "/color").set(myColor);
        database.ref("text/" + value + "/speak").set(speakOn);
        setSpeakOn("");
        database.ref("text/" + value + "/speak").set("");
    };

    useEffect(() => {
        database.ref("text/" + title + "/listen").on("value", (data) => {
            setText(data.val());
        });
        database.ref("text/" + title + "/color").on("value", (data) => {
            setColor(data.val());
        });
    });

    useEffect(() => {
        let isMount = true;
        if (selected === true) {
            database.ref("text/" + value + "/speak").on("value", (data) => {
                if (isMount) speak({ text: data.val() });
            });
        }
        return () => {
            isMount = false;
        };
        // eslint-disable-next-line
    }, [selected]);

    const useStyles = makeStyles({
        root: {
            background: "#3f51b5",
            height: "40px",
            width: "100px",
            color: "rgba(0, 0, 0, 0.26)",
            fontSize: "18px",
            fontFamily: "Rubik",
            "&:hover": {
                background: "#3f51b5",
            },
        },
        buttonColor: {
            "&.Mui-selected": {
                backgroundColor: "#757ce8",
                color: "#ffffff",
            },
            "&.Mui-selected:hover": {
                background: "#757ce8",
            },
        },
        textField: {
            backgroundColor: "#ffffff",
            fontFamily: "Rubik",
            margin: "3px",
            fontSize: "15px",
        },
        buttontrue: {
            backgroundColor: "#757ce8",
            color: "#ffffff",
            fontFamily: "Rubik",
            fontSize: "15px",
            "&:hover": {
                background: "#757ce8",
            },
            height: "35px",
            marginTop: "7px",
            marginLeft: "10px",
        },
        buttonfalse: {
            backgroundColor: "#3f51b5",
            color: "#ffffff",
            fontFamily: "Rubik",
            fontSize: "15px",
            "&:hover": {
                background: "#3f51b5",
            },
            height: "35px",
            marginTop: "7px",
            marginLeft: "10px",
        },
        listenbuttontrue: {
            backgroundColor: "#757ce8",
            color: "#ffffff",
            fontFamily: "Rubik",
            fontSize: "15px",
            "&:hover": {
                background: "#757ce8",
            },
            height: "35px",
            marginTop: "7px",
            marginLeft: "10px",
            marginRight: "10px",
        },
        listenbuttonfalse: {
            backgroundColor: "#3f51b5",
            color: "rgba(0, 0, 0, 0.26)",
            fontFamily: "Rubik",
            fontSize: "15px",
            "&:hover": {
                background: "#3f51b5",
            },
            height: "35px",
            marginTop: "7px",
            marginLeft: "10px",
            marginRight: "10px",
        },
        icon: {
            color: "#3f51b5",
            "&:hover": {
                color: "#757ce8",
            },
        },
    });

    const classes = useStyles();

    return (
        <div className="wrap-box">
            <nav className="nav-bar box1">
                <div className="logo">
                    {value}
                    <Tooltip
                        arrow
                        open={openTip}
                        onClose={handleCloseTip}
                        disableHoverListener
                        placement="top"
                        title="コピーしました">
                        <CopyToClipBoard text={value}>
                            <IconButton
                                classes={{
                                    root: classes.icon,
                                }}
                                disabled={value === ""}
                                onClick={handleClickButton}>
                                <FontAwesomeIcon icon={faCopy} />
                            </IconButton>
                        </CopyToClipBoard>
                    </Tooltip>
                </div>
                <EmDialog
                    emOpen={emerge}
                    emYes={clearEditor}
                    emNo={() => {
                        setEmerge(false);
                    }}
                />
                <FormDialog
                    isOpen={open}
                    doClose={() => handleClose()}
                    setValue={setValue}
                    value={value}
                />
                <div className="btn-container">
                    <ToggleButton
                        classes={{
                            root: classes.root,
                            selected: classes.buttonColor,
                        }}
                        value="check"
                        selected={selected}
                        onChange={() => {
                            setSelected(!selected);
                        }}>
                        接続　
                        <Badge badgeContent={count} color="secondary"></Badge>
                    </ToggleButton>
                    <div></div>
                    <div className="page open" onClick={pageOpen}>
                        <FontAwesomeIcon icon={faPager} />
                        <PageDialog title={title} src={srcDoc} page={page} />
                        <div>ページ</div>
                    </div>
                    <a
                        href=" "
                        id="download-btn-html"
                        title="Download HTML file"
                        onClick={downloadHtml}>
                        <FontAwesomeIcon icon={faDownload} />
                        <div>HTML</div>
                    </a>
                    <a
                        href=" "
                        id="download-btn-css"
                        title="Download CSS file"
                        onClick={downloadCss}>
                        <FontAwesomeIcon icon={faDownload} />
                        <div>CSS</div>
                    </a>
                    <a
                        href=" "
                        id="download-btn-js"
                        title="Download JS file"
                        onClick={downloadJs}>
                        <FontAwesomeIcon icon={faDownload} />
                        <div>JS</div>
                    </a>
                    <div className="clear editor" onClick={handleEmerge}>
                        <FontAwesomeIcon icon={faEraser} />
                        <div>クリア</div>
                    </div>
                    <div className="click info" onClick={infoOpen}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        <div>お問合せ</div>
                    </div>
                    <Dialog
                        open={info}
                        onClose={infoClose}
                        scroll="paper"
                        aria-labelledby="scroll-dialog-title"
                        aria-describedby="scroll-dialog-description">
                        <DialogActions>
                            <Button onClick={infoClose} color="primary">
                                閉じる
                            </Button>
                        </DialogActions>
                        <Contact
                            doNo={() => {
                                setInfo(false);
                            }}
                        />
                        <DialogContent dividers>
                            <DialogContentText id="scroll-dialog-description">
                                サービス利用規約<br></br>
                                この利用規約（以下，「本規約」といいます。）は，本サービスの利用条件を定めるものです。登録ユーザーの皆さま（以下，「ユーザー」といいます。）には，本規約に従って，本サービスをご利用いただきます。
                                <br></br>第1条（適用）
                                本規約は，ユーザーと本サービスとの間のサービスの利用に関わる一切の関係に適用されるものとします。
                                <br></br>第2条（利用登録）
                                登録希望者が本サービスの定める方法によって利用登録を申請し，本サービスがこれを承認することによって，利用登録が完了するものとします。本サービスは，利用登録の申請者に以下の事由があると判断した場合，利用登録の申請を承認しないことがあり，その理由については一切の開示義務を負わないものとします。
                                （1）利用登録の申請に際して虚偽の事項を届け出た場合
                                （2）本規約に違反したことがある者からの申請である場合
                                （3）その他，本サービスが利用登録を相当でないと判断した場合
                                <br></br>
                                第3条（ユーザーIDおよびパスワードの管理）
                                ユーザーは，自己の責任において，本サービスのユーザーIDおよびパスワードを管理するものとします。ユーザーは，いかなる場合にも，ユーザーIDおよびパスワードを第三者に譲渡または貸与することはできません。本サービスは，ユーザーIDとパスワードの組み合わせが登録情報と一致してログインされた場合には，そのユーザーIDを登録しているユーザー自身による利用とみなします。
                                <br></br>第4条（禁止事項）
                                ユーザーは，本サービスの利用にあたり，以下の行為をしてはなりません。
                                （1）法令または公序良俗に違反する行為
                                （2）犯罪行為に関連する行為
                                （3）本サービスのサーバーまたはネットワークの機能を破壊したり，妨害したりする行為
                                （4）本サービスのサービスの運営を妨害するおそれのある行為
                                （5）他のユーザーに関する個人情報等を収集または蓄積する行為
                                （6）他のユーザーに成りすます行為
                                （7）本サービスのサービスに関連して，反社会的勢力に対して直接または間接に利益を供与する行為
                                （8）その他，本サービスが不適切と判断する行為
                                <br></br>第5条（本サービスの提供の停止等）
                                本サービスは，以下のいずれかの事由があると判断した場合，ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
                                （1）本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
                                （2）地震，落雷，火災，停電または天災などの不可抗力により，本サービスの提供が困難となった場合
                                （3）コンピュータまたは通信回線等が事故により停止した場合
                                （4）その他，本サービスの提供が困難と判断した場合、本サービスの提供の停止または中断により，ユーザーまたは第三者が被ったいかなる不利益または損害について，理由を問わず一切の責任を負わないものとします。
                                <br></br>第6条（利用制限および登録抹消）
                                本サービスは，以下の場合には，事前の通知なく，ユーザーに対して，本サービスの全部もしくは一部の利用を制限し，またはユーザーとしての登録を抹消することができるものとします。
                                （1）本規約のいずれかの条項に違反した場合
                                （2）登録事項に虚偽の事実があることが判明した場合
                                （3）その他，本サービスの利用を適当でないと判断した場合，本条に基づき本サービスが行った行為によりユーザーに生じた損害について，一切の責任を負いません。
                                <br></br>第7条（免責事項）
                                本サービスの債務不履行責任は，故意または重過失によらない場合には免責されるものとします。
                                本サービスは，何らかの理由によって責任を負う場合にも，通常生じうる損害の範囲内かつ有料サービスにおいては代金額（継続的サービスの場合には1か月分相当額）の範囲内においてのみ賠償の責任を負うものとします。
                                本サービスに関して，ユーザーと他のユーザーまたは第三者との間において生じた取引，連絡または紛争等について一切責任を負いません。
                                <br></br>第8条（サービス内容の変更等）
                                本サービスは，ユーザーに通知することなく，本サービスの内容を変更し，または本サービスの提供を中止することができるものとし，これによってユーザーに生じた損害について一切の責任を負いません。
                                <br></br>第9条（利用規約の変更）
                                本サービスは，必要と判断した場合には，ユーザーに通知することなくいつでも本規約を変更することができるものとします。
                                <br></br>第10条（通知または連絡）
                                ユーザーと本サービスとの間の通知または連絡は，本サービスの定める方法によって行うものとします。
                                <br></br>第11条（権利義務の譲渡の禁止）
                                ユーザーは，本サービスの書面による事前の承諾なく，利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し，または担保に供することはできません。
                                <br></br>第12条（準拠法・裁判管轄）
                                本規約の解釈にあたっては，日本法を準拠法とします。
                                本サービスに関して紛争が生じた場合には，大阪地方裁判所を第一審の専属管轄裁判所とします。
                                <br></br>以上
                                <br></br>
                                <br></br>
                                プライバシーポリシー<br></br>
                                本サービスにおけるプライバシー情報の取扱いについて，以下のとおりプライバシーポリシー（以下，「本ポリシー」といいます。）を定めます。
                                <br></br>第1条（プライバシー情報）
                                プライバシー情報のうち「個人情報」とは，個人情報保護法にいう「個人情報」を指すものとし，生存する個人に関する情報であって，当該情報に含まれる氏名，生年月日，住所，電話番号，連絡先その他の記述等により特定の個人を識別できる情報を指します。
                                プライバシー情報のうち「履歴情報および特性情報」とは，上記に定める「個人情報」以外のものをいい，ご利用いただいたサービスやご購入いただいた商品，ご覧になったページや広告の履歴，ユーザーが検索された検索キーワード，ご利用日時，ご利用の方法，ご利用環境，郵便番号や性別，職業，年齢，ユーザーのIPアドレス，クッキー情報，位置情報，端末の個体識別情報などを指します。
                                <br></br>第２条（プライバシー情報の収集方法）
                                本サービスは，ユーザーが利用登録をする際に氏名，メールアドレス，クレジットカード番号などの個人情報をお尋ねすることがあります。また，ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や，決済に関する情報を本サービスの提携先（情報提供元，広告主，広告配信先などを含みます。以下，｢提携先｣といいます。）などから収集することがあります。
                                本サービスは，ユーザーについて，利用したサービスやソフトウエア，購入した商品，閲覧したページや広告の履歴，検索した検索キーワード，利用日時，利用方法，利用環境（携帯端末を通じてご利用の場合の当該端末の通信状態，利用に際しての各種設定情報なども含みます），IPアドレス，クッキー情報，位置情報，端末の個体識別情報などの履歴情報および特性情報を，ユーザーが本サービスや提携先のサービスを利用しまたはページを閲覧する際に収集します。
                                <br></br>第３条（個人情報を収集・利用する目的）
                                本サービスが個人情報を収集・利用する目的は，以下のとおりです。
                                （1）ユーザーに自分の登録情報の閲覧や修正，利用状況の閲覧を行っていただくために，氏名，住所，連絡先，支払方法などの登録情報，利用されたサービスや購入された商品，およびそれらの代金などに関する情報を表示する目的
                                （2）ユーザーにお知らせや連絡をするためにメールアドレスを利用する場合やユーザーに商品を送付したり必要に応じて連絡したりするため，氏名や住所などの連絡先情報を利用する目的
                                （3）ユーザーの本人確認を行うために，氏名，クレジットカード番号などの情報を利用する目的
                                （4）ユーザーに代金を請求するために，購入された商品名や数量，利用されたサービスの種類や期間，回数，請求金額，氏名，住所，銀行口座番号やクレジットカード番号などの支払に関する情報などを利用する目的
                                （5）ユーザーが簡便にデータを入力できるようにするために，本サービスに登録されている情報を入力画面に表示させたり，ユーザーのご指示に基づいて他のサービスなど（提携先が提供するものも含みます）に転送したりする目的
                                （6）代金の支払を遅滞したり第三者に損害を発生させたりするなど，本サービスの利用規約に違反したユーザーや，不正・不当な目的でサービスを利用しようとするユーザーの利用をお断りするために，利用態様，氏名や住所など個人を特定するための情報を利用する目的
                                （7）ユーザーからのお問い合わせに対応するために，お問い合わせ内容や代金の請求に関する情報など本サービスがユーザーに対してサービスを提供するにあたって必要となる情報や，ユーザーのサービス利用状況，連絡先情報などを利用する目的
                                （8）上記の利用目的に付随する目的
                                <br></br>第４条（個人情報の第三者提供）
                                本サービスは，次に掲げる場合を除いて，あらかじめユーザーの同意を得ることなく，第三者に個人情報を提供することはありません。ただし，個人情報保護法その他の法令で認められる場合を除きます。
                                （1）法令に基づく場合
                                （2）人の生命，身体または財産の保護のために必要がある場合であって，本人の同意を得ることが困難であるとき
                                （3）公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって，本人の同意を得ることが困難であるとき
                                （4）国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって，本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき
                                （5）予め次の事項を告知あるいは公表をしている場合
                                利用目的に第三者への提供を含むこと
                                第三者に提供されるデータの項目
                                第三者への提供の手段または方法
                                本人の求めに応じて個人情報の第三者への提供を停止すること
                                前項の定めにかかわらず，次に掲げる場合は第三者には該当しないものとします。
                                （1）本サービスが利用目的の達成に必要な範囲内において個人情報の取扱いの全部または一部を委託する場合
                                （2）合併その他の事由による事業の承継に伴って個人情報が提供される場合
                                （3）個人情報を特定の者との間で共同して利用する場合であって，その旨並びに共同して利用される個人情報の項目，共同して利用する者の範囲，利用する者の利用目的および当該個人情報の管理について責任を有する者の氏名または名称について，あらかじめ本人に通知し，または本人が容易に知り得る状態に置いているとき
                                <br></br>第５条（個人情報の開示）
                                本サービスは，本人から個人情報の開示を求められたときは，本人に対し，遅滞なくこれを開示します。ただし，開示することにより次のいずれかに該当する場合は，その全部または一部を開示しないこともあり，開示しない決定をした場合には，その旨を遅滞なく通知します。
                                （1）本人または第三者の生命，身体，財産その他の権利利益を害するおそれがある場合
                                （2）本サービスの業務の適正な実施に著しい支障を及ぼすおそれがある場合
                                （3）その他法令に違反することとなる場合
                                前項の定めにかかわらず，履歴情報および特性情報などの個人情報以外の情報については，原則として開示いたしません。
                                <br></br>第６条（個人情報の訂正および削除）
                                ユーザーは，本サービスの保有する自己の個人情報が誤った情報である場合には，本サービスが定める手続きにより，本サービスに対して個人情報の訂正または削除を請求することができます。本サービスは，ユーザーから前項の請求を受けてその請求に応じる必要があると判断した場合には，遅滞なく，当該個人情報の訂正または削除を行い，これをユーザーに通知します。
                                <br></br>第７条（個人情報の保持）
                                本サービスは、ユーザーの個人情報を、本ポリシーに規定された目的を実現するために必要な期間保持します。ただし、法律上必要ないしは認められている場合はこの限りではありません。また、法律上、税務上若しくは規制上その他の適法な目的のためにこれより長い保持期間が要求されているか、あるいは認められている場合も同様です。
                                <br></br>第８条（個人情報の利用停止等）
                                本サービスは，本人から，個人情報が，利用目的の範囲を超えて取り扱われているという理由，または不正の手段により取得されたものであるという理由により，その利用の停止または消去（以下，「利用停止等」といいます。）を求められた場合には，遅滞なく必要な調査を行い，その結果に基づき，個人情報の利用停止等を行い，その旨本人に通知します。ただし，個人情報の利用停止等に多額の費用を有する場合その他利用停止等を行うことが困難な場合であって，本人の権利利益を保護するために必要なこれに代わるべき措置をとれる場合は，この代替策を講じます。
                                <br></br>第９条（プライバシーポリシーの変更）
                                本ポリシーの内容は，ユーザーに通知することなく，変更することができるものとします。
                                本サービスが別途定める場合を除いて，変更後のプライバシーポリシーは，本ウェブサイトに掲載したときから効力を生じるものとします。
                                <br></br>第１０条（お問い合わせ窓口）
                                本ポリシーに関するお問い合わせは，お問い合わせフォームよりご連絡ください。
                                <br></br>以上
                            </DialogContentText>
                        </DialogContent>
                    </Dialog>
                    {/* <div className="click out" onClick={}>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <div>ホーム</div>
                    </div> */}
                </div>
            </nav>
            <Split sizes={[50, 50]} direction="vertical" className="box2">
                <Split className="pane top-pane box21" sizes={[33, 34, 33]}>
                    <Editor
                        language="text/html"
                        displayName="HTML"
                        value={html}
                        onChange={setsHtml}
                    />
                    <Editor
                        language="css"
                        displayName="CSS"
                        value={css}
                        onChange={setsCss}
                    />
                    <Editor
                        language="javascript"
                        displayName="JS"
                        value={js}
                        onChange={setsJs}
                    />
                </Split>
                <div className="pane box22">
                    <iframe
                        srcDoc={srcDoc}
                        title="output"
                        id="iframe"
                        sandbox="allow-scripts allow-popups allow-modals"
                        frameBorder="0"
                        width="100%"
                        height="100%"
                        className="disblock"
                    />
                    <iframe
                        srcDoc={introDoc}
                        title="intro"
                        id="intro"
                        sandbox="allow-scripts allow-popups allow-modals"
                        frameBorder="0"
                        width="100%"
                        height="100%"
                    />
                </div>
            </Split>
            <div className="text0">
                {listen ? (
                    <Button
                        disabled={Boolean(selected === false)}
                        onClick={listenChange}
                        className={classes.listenbuttontrue}>
                        字幕
                    </Button>
                ) : (
                    <Button
                        disabled={Boolean(selected === false)}
                        onClick={listenChange}
                        className={classes.listenbuttonfalse}>
                        字幕
                    </Button>
                )}
                {listen && selected ? (
                    <div className="text2" style={{ color: color }}>
                        {text}
                    </div>
                ) : null}
                <div className="text4">
                    <TextField
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                setsSpeak();
                            }
                        }}
                        disabled={Boolean(selected === false)}
                        defaultValue=""
                        variant="outlined"
                        value={speakOn}
                        autoFocus
                        type="text"
                        onChange={(event) => setSpeakOn(event.target.value)}
                        className={classes.textField}
                        size="small"
                    />
                    {selected ? (
                        <Button
                            disabled={Boolean(selected === false)}
                            type="submit"
                            onClick={setsSpeak}
                            className={classes.buttontrue}>
                            発信
                        </Button>
                    ) : (
                        <Button
                            disabled={Boolean(selected === false)}
                            type="submit"
                            onClick={setsSpeak}
                            className={classes.buttonfalse}>
                            発信
                        </Button>
                    )}
                </div>
                <div className="text3"></div>
            </div>
            <div
                // href="https://github.com/syehacom"
                target="_blank"
                rel="noopener noreferrer"
                id="github-link"
                className="text-center">
                {/* <FontAwesomeIcon icon={faGithub} />
                <span>&nbsp;syehacom</span> */}
                <Skyway
                    count={count}
                    value={value}
                    selected={selected}
                    color={myColor}
                />
            </div>
        </div>
    );
}

export default App;
