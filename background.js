/** Accessing codeforces with apikey - Don't Delete *
let sha512 = async (str) => {
    const buf = await crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str));
    return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('');
}
let contestId = 566;
let time = Math.floor(Date.now() / 1000);
let hashstr = `123456/contest.hacks?apiKey=${codeforces.key}&contestId=${contestId}&time=${time}#${codeforces.secret}`;
sha512(hashstr).then(function(x){
    let apiSig = "123456" + x;
    let userURL = `https://codeforces.com/api/contest.hacks?contestId=${contestId}&apiKey=${codeforces.key}&time=${time}&apiSig=${apiSig}`;
    return userURL;
}).then(function(url){
    return fetch(url);
}).then(response => response.json()).then(data => console.log(data));
/***/
console.log('..INSIDE BACKGROUND.JS OF CONTEST REMINDER..');
chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostContains: '' },
        })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
});

// let CodeforcesUrl = `https://codeforces.com/api/contest.list?gym=false`;

// chrome.extension.onConnect.addListener(function (port) {
//     console.log("Connected for.... ", port.name);
//     fetch(CodeforcesUrl)
//         .then(response => response.json())
//         .then(data => {
//             port.postMessage(data);
//         })
// })