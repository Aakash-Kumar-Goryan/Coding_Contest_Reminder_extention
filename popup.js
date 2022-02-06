var myHeaders = new Headers();
myHeaders.append("authority", "www.codechef.com");
myHeaders.append("sec-ch-ua", "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"97\", \"Chromium\";v=\"97\"");
myHeaders.append("accept", "application/json, text/javascript, */*; q=0.01");
myHeaders.append("x-requested-with", "XMLHttpRequest");
myHeaders.append("sec-ch-ua-mobile", "?0");
myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36");
myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
myHeaders.append("sec-fetch-site", "same-origin");
myHeaders.append("sec-fetch-mode", "cors");
myHeaders.append("sec-fetch-dest", "empty");
myHeaders.append("referer", "https://www.codechef.com/contests/?itm_medium=navmenu&itm_campaign=allcontests_head");
myHeaders.append("accept-language", "en-US,en;q=0.9,hi;q=0.8");
myHeaders.append("cookie", "_gcl_au=1.1.902691023.1643476884; _fbp=fb.1.1643476883656.1845843787; _ga=GA1.2.125357324.1643476884; _gid=GA1.2.16410053.1643476884; SESS93b6022d778ee317bf48f7dbffe03173=4eeaf87c5fd3cb4a248e54d7882ebea5; _clck=6ya4a0|1|eyl|0; _clsk=3o2qgs|1643605353250|1|1|b.clarity.ms/collect");
myHeaders.append("if-none-match", "W/\"1643662696\"");
myHeaders.append("if-modified-since", "Mon, 31 Jan 2022 20:58:16 +0000");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

window.onload = () => {
    let CodeforcesUrl = `https://codeforces.com/api/contest.list?gym=false`;
    fetch(CodeforcesUrl)
        .then(response => response.json())
        .then(data => {
            AppendCodeforces(data);
        })
    fetch("https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=premium", requestOptions)
		.then(response => response.json())
		.then(result => {
      		AppendCodeChef(result);
		}).catch(error => console.log('error', error));

    document.getElementById('github').onclick = () => {
        let newURL = "https://github.com/Aakash-Kumar-Goryan/Coding_Contest_Reminder_extention";
        chrome.tabs.create({ url: newURL });
    }
    $('.ui.accordion').accordion();
}

let AddLoading = () => {
    if (document.getElementById("loading").classList.contains("hidden")) {
        document.getElementById("loading").classList.remove("hidden");
    }
}

let HideLoading = () => {
    if (!document.getElementById("loading").classList.contains("hidden")) {
        document.getElementById("loading").classList.add("hidden");
    }
}

let unixtodate = (unix_timestamp) => {
    let date = new Date(unix_timestamp * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return [date, formattedTime];
}

let secondsToHms = (date) => {
    date = Number(date);
    let d = Math.floor(date / 86400);   // 3600*24
    let h = Math.floor(date % 86400 / 3600);
    let m = Math.floor((date % 86400) % 3600 / 60);
    // let s = Math.floor((date % 86400) % 3600 % 60);

    let dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
    let hmDisplay = h > 0 ? h + (m > 0 ? " : " + m : "") + (h == 1 ? " hour" : " hours") : (m > 0 ? "0 : " + m + "hour" : "");
    // let hDisplay = h > 0 ? h + (h == 1 ? " hour" : " hours") : "";
    // let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    // let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hmDisplay;
}

let AppendCodeforces = (data) => {
    let AccordianContent = `<div class="title">
                                <i class="dropdown icon"></i>
                                    CODEFORCES	
                            </div>
                            <div class="content">
                                <table class="ui unstackable celled table transition hidden" id="table">
                                    <thead></thead>
                                    <tbody></tbody>
                                </table>
                            </div>`;
    let theadContent = `<tr>
					        <th>Name</th>
					        <th>Type</th>
                            <th>Duration</th>
                            <th>Start</th>
                      </tr>`;
    document.getElementById('table').getElementsByTagName('thead')[0].innerHTML = theadContent;
    let tbodyContent = "";
    for (let i = data.result.length - 1; i >= 0; i--) {
        if (data.result[i].phase === "BEFORE") {
            tbodyContent += `<tr>
                                <td data-label="Name">${data.result[i].name}</td>
                                <td data-label="Type">${data.result[i].type}</td>
                                <td data-label="Duration">${secondsToHms(data.result[i].durationSeconds)}</td>
                                <td data-label="Start">${unixtodate(data.result[i].startTimeSeconds)[0]}</td>
                            </tr>`
        }
        document.getElementById('table').getElementsByTagName('tbody')[0].innerHTML = tbodyContent;
    }
}

let AppendCodeChef = (data) => {
    let AccordianContent = `<div class="title">
                                <i class="dropdown icon"></i>
                                    CodeChef	
                            </div>
                            <div class="content">
                                <table class="ui unstackable celled table transition hidden" id="CodeChef">
                                    <thead></thead>
                                    <tbody></tbody>
                                </table>
                            </div>`;
    let theadContent = `<tr>
					        <th>CODE</th>
					        <th>NAME</th>
                            <th>START</th>
                            <th>END</th>
                      </tr>`;
    document.getElementById('CodeChef').getElementsByTagName('thead')[0].innerHTML = theadContent;
    let tbodyContent = "";
    let futureContest = data.future_contests;
    for (let i = 0; i < futureContest.length; i++) {
            tbodyContent += `<tr>
                                <td data-label="CODE">${futureContest[i].contest_code}</td>
                                <td data-label="NAME">${futureContest[i].contest_name}</td>
                                <td data-label="START">${futureContest[i].contest_start_date}</td>
                                <td data-label="END">${futureContest[i].contest_end_date}</td>
                            </tr>`
    }
    document.getElementById('CodeChef').getElementsByTagName('tbody')[0].innerHTML = tbodyContent;
}