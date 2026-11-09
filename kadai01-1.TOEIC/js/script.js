
// ① TOEICの問題を登録する
const questions = [
    {
        question: "The meeting has been _____ until Friday.",
        choices: ["postponed", "provided", "attended", "received"],
        answer: 0,
        explanation: "postponeは「延期する」。provideは「提供する」なので、会議を延期するという意味のpostponedが正解です。",
        timeLimit: 15
    },
    {
        question: "Please _____ the document before the meeting.",
        choices: ["review", "arrive", "borrow", "depend"],
        answer: 0,
        explanation: "reviewは「確認する」。会議の前に資料を確認してください、という意味です。",
        timeLimit: 15
    },
    {
        question: "All employees are _____ to attend the training.",
        choices: ["require", "required", "requiring", "requirement"],
        answer: 1,
        explanation: "be required to ～ は「～することを求められる」という意味です。",
        timeLimit: 10
    }
];

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

    // 回答したのでタイマーを止める
    clearInterval(timerId);

    const current = questions[questionIndex];

    
if (selected === current.answer) {

    // 正解したら連続正解数を1増やす
    streak++;
    $("#result").text("⭕ 正解！");

   // 3問連続正解したら拍手（テスト用）
if (streak === 3) {
    $("#celebration").text("👏 3問連続正解！すごい！");
    showClapEffect();
}

} else if (selected === -1) {

    // 時間切れの場合
    streak = 0;
    $("#result").text("⌛ 時間切れ！不正解です");

} else {

    // 不正解の場合
    streak = 0;
    $("#result").text("❌ 不正解！");
}

// HTMLに連続正解数を表示する
$("#streak").text(streak);


    $("#explanation").text(current.explanation);

    // 2回回答できないようにする
    $(".answers button").prop("disabled", true);

    // 次の問題へボタンを表示する
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

// 最初の問題を表示する
showQuestion();

