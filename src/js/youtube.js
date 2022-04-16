'use strict';

//スクリーンショットのボタン設定
let screenshotButton = document.createElement("button");
screenshotButton.className = "screenshotButton ytp-button";
screenshotButton.style.width = "36px";
screenshotButton.innerHTML = '<img src="' + chrome.extension.getURL("icons/icon.svg") + '" style="width:22px;height:22px;transform:translate(7px,7px)">'
screenshotButton.style.cssFloat = "left";
screenshotButton.onclick = CaptureScreenshot;

/**
 * スクリーンショットボタンを追加
 */
function AddScreenshotButton() {
    let ytpRightControls = document.getElementsByClassName("ytp-right-controls")[0];
    if (ytpRightControls) {
        ytpRightControls.prepend(screenshotButton);
    }
}

AddScreenshotButton();

/**
 * キャプチャ実行
 */
function CaptureScreenshot() {
    let player = document.getElementsByClassName("video-stream")[0];

    let canvas = document.createElement("canvas");
    canvas.width = player.videoWidth;
    canvas.height = player.videoHeight;
    canvas.getContext('2d').drawImage(player, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async function (blob) {
        chrome.storage.sync.get({
            destination: "file"
        }, function(items) {
            const dest = items.destination;
            if(dest === "file" || dest === "both") {
                let fileName = getFileName();

                let downloadLink = document.createElement("a");
                downloadLink.download = fileName;

                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.click();
            }
            if(dest === "clipboard" || dest === "both") {
                navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob
                    })
                ]);
            }
        });
    }, 'image/png');

}

/**
 * ファイル名取得
 */
function getFileName() {
    let appendixTitle = "screenshot.png";
    let title;
    let headerEls = document.querySelectorAll("h1.title");

    /**
     * ファイル名を設定
     */
    function SetTitle() {
        if (headerEls.length > 0) {
            title = Array.from(headerEls).map(el=>{
                return el.innerText.trim();
            }).join("");
            return true;
        } else {
            return false;
        }
    }

    if (SetTitle() == false) {
        headerEls = document.querySelectorAll("h1.watch-title-container");

        if (SetTitle() == false)
            title = '';
    }
    let player = document.getElementsByClassName("video-stream")[0];

    title += " " + Util.formatTime(player.currentTime);

    title += " " + appendixTitle;

    return title;
}