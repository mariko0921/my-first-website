
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

// ③ 問題を画面に表示する
function showQuestion() {

    const current = questions[questionIndex];

    $("#question-number").text("Question " + (questionIndex + 1));

    $("#question").text(current.question);

    $("#answer1").text("A. " + current.choices[0]);
    $("#answer2").text("B. " + current.choices[1]);
    $("#answer3").text("C. " + current.choices[2]);
    $("#answer4").text("D. " + current.choices[3]);

    $("#result").text("");
    $("#explanation").text("");

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
        $("#result").text("⭕ 正解！");

    } else if (selected === -1) {
        $("#result").text("⌛ 時間切れ！不正解です");

    } else {
        $("#result").text("❌ 不正解！");
    }

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

// 最初の問題を表示する
showQuestion();

