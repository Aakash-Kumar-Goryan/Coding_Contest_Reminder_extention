console.log("== Content Script | Coding Reminder Extension == ");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
window.onload = async () => {
    chrome.runtime.onMessage.addListener(
        async (request, sender, sendResponse) => {
            console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

            
            if (request.msg === 0){
                gotoAttendance()
                // AbsentClasses()
                sendResponse({ farewell: "goodbye" });
            }
            else if(request.msg === 1) {
                await solveCaptchaLogin()
            }
        }
    );
    console.log("After load");
    console.log(document.getElementById('banner').contentWindow.document.getElementById('captchaimg'));
}

