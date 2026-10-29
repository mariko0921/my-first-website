$("#guu, #choki, #pa").on("click", function() {
  // ① 自分の手を取得する
  let playerHand = this.id;
  console.log("自分の手：" + playerHand);

  // ② コンピューターの手をランダムに決める
  let randomNumber = Math.floor(Math.random() * 3);
  let computerHand = "";

  if (randomNumber === 0) {
    computerHand = "guu";
    $("#computer").text("対戦相手：グー✊");

  } else if (randomNumber === 1) {
    computerHand = "choki";
    $("#computer").text("対戦相手：チョキ✌️");

  } else {
    computerHand = "pa";
    $("#computer").text("対戦相手：パー🖐️");
  }

  console.log("相手の手：" + computerHand);

  // ③ 勝敗を判定する
  let resultText = "";
  let imagePath = "";

  if (playerHand === computerHand) {

    resultText = "勝負の結果：あいこ！";
    imagePath = "images/draw.png";

  } else if (
    (playerHand === "guu" && computerHand === "choki") ||
    (playerHand === "choki" && computerHand === "pa") ||
    (playerHand === "pa" && computerHand === "guu")
  ) {

    resultText = "勝負の結果：あなたの勝ち！";
    imagePath = "images/win.png";

  } else {

    resultText = "勝負の結果：あなたの負け！";
    imagePath = "images/lose.png";

  }

  // ④ 結果を画面に表示する
$("#result").text(resultText);
$("#judge-image").attr("src", imagePath);
$("#judge-image").css("display", "block");

});
