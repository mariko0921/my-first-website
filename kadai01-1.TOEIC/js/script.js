
// ① スプレッドシートから問題を取得する

const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRzC-H82sDMLR6cKpIeuuu0nGhrW8DXwReqZDPeMcQPaGviE0BWmXfnvIV88P80fOaelFltdQl4dcK8/pub?output=csv";

// 問題を保存する配列
let questions = [];

// CSVを読み込む関数
function loadQuestions() {

    $("#question").text("問題を読み込み中...");

    Papa.parse(csvUrl, {
        download: true,
        header: true,
        skipEmptyLines: "greedy",

        complete: function(results) {

            questions = results.data
                .filter(function(row) {
                    return row.question && row.question.trim() !== "";
                })
                .map(function(row) {

                    return {
                        question: row.question,
                        choices: [
                            row.choiceA,
                            row.choiceB,
                            row.choiceC,
                            row.choiceD
                        ],
                        answer: Number(row.answer),
                        explanation: row.explanation,
                        timeLimit: Number(row.timeLimit)
                    };

                });

            // 問題データが正しいか確認
            questions = questions.filter(function(q) {
                return q.question &&
                    q.choices.every(function(c) {
                        return typeof c === "string" && c.trim() !== "";
                    }) &&
                    Number.isInteger(q.answer) &&
                    q.answer >= 0 &&
                    q.answer <= 3 &&
                    Number.isFinite(q.timeLimit) &&
                    q.timeLimit > 0;
            });

            console.log("読み込んだ問題数：" + questions.length);

            if (results.errors.length > 0) {
                console.warn("CSV読み込み時の警告", results.errors);
            }

            if (questions.length > 0) {
                showQuestion();
            } else {
                $("#question").text("問題データがありません。");
            }
        },

        error: function(error) {
            console.error("CSV読み込みエラー", error);
            $("#question").text("問題の読み込みに失敗しました。");
        }
    });
}

// ② ゲームの状態を管理する
let questionIndex = 0;
let seconds = 0;
let timerId = null;
let streak = 0; // ★追加：連続正解数
let answered = false; // ★追加

// ③ 問題を画面に表示する
function showQuestion() {
    answered = false; // ★追加
    const current = questions[questionIndex];

    $("#question-number").text("Question " + (questionIndex + 1));

    $("#question").text(current.question);

    $("#answer1").text("A. " + current.choices[0]);
    $("#answer2").text("B. " + current.choices[1]);
    $("#answer3").text("C. " + current.choices[2]);
    $("#answer4").text("D. " + current.choices[3]);

    $("#result").text("");
    $("#explanation").text("");
    $("#celebration").text(""); // ★追加

    $(".answers button").prop("disabled", false);
    $("#next").prop("hidden", true);


    seconds = current.timeLimit;
    $("#timer").text(seconds);
    startTimer();
}


 // ④ 正解・不正解を判定する
function checkAnswer(selected) {

    // すでに回答済みなら何もしない
    if (answered === true) {
        return;
    }

    // 回答済みにする
    answered = true;

    // タイマーを止める
    clearInterval(timerId);

    const current = questions[questionIndex];

    // 正解した場合
    if (selected === current.answer) {

        streak++;
        $("#result").text("⭕ 正解！");

        // 連続正解数に応じたご褒美
        if (streak === 15) {
            $("#celebration").text("👏 15問連続正解！すごい！");
            showClapEffect();

        } else if (streak === 30) {
            $("#celebration").text("🎆 30問連続正解！おめでとう！");

        } else if (streak === 50) {
            $("#celebration").text("👑 TOEICの神！！！");
        }

    // 時間切れの場合
    } else if (selected === -1) {

        streak = 0;
        $("#result").text("⌛ 時間切れ！不正解です");

    // 不正解の場合
    } else {

        streak = 0;
        $("#result").text("❌ 不正解！");
    }

    // 連続正解数を画面に表示
    $("#streak").text(streak);

    // 解説を表示
    $("#explanation").text(current.explanation);

    // ボタンを無効にして二重回答を防止
    $(".answers button").prop("disabled", true);

    // 次の問題へボタンを表示
    $("#next").prop("hidden", false);
}


// ⑤ 4つの選択肢をクリックしたとき
$("#answer1").on("click", function() {
    checkAnswer(0);
});

$("#answer2").on("click", function() {
    checkAnswer(1);
});

$("#answer3").on("click", function() {
    checkAnswer(2);
});

$("#answer4").on("click", function() {
    checkAnswer(3);
});

// タイマーを動かす関数
function startTimer() {

    // 前のタイマーが残っていたら止める
    clearInterval(timerId);

    // 1秒ごとに繰り返す
    timerId = setInterval(function() {

        seconds = seconds - 1;

        $("#timer").text(seconds);

        if (seconds <= 0) {
            checkAnswer(-1);
        }

    }, 1000);
}

// ⑥ 次の問題へ進む
$("#next").on("click", function() {

    questionIndex++;

    if (questionIndex < questions.length) {
        showQuestion();
    } else {
        $("#question-number").text("FINISH!");
        $("#question").text("全問終了！お疲れさまでした 🎉");

        $(".answers button").hide();
        $("#next").prop("hidden", true);
    }
});




// 拍手GIFを表示する関数
function showClapEffect() {

    // GIFのアニメーションを最初から再実行
    $("#clap-effect img").css("animation", "none");

    // 拡大アニメーションを再設定
    $("#clap-effect img")[0].offsetHeight;
    $("#clap-effect img").css("animation", "");

    // 拍手を表示する
    $("#clap-effect").css("display", "flex");

    // 3秒後に非表示にする
    setTimeout(function() {
        $("#clap-effect").hide();
    }, 3000);
}

// スプレッドシートから問題を読み込む
loadQuestions();