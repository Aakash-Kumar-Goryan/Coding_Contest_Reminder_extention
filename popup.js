window.onload = () => {
    // let port = chrome.extension.connect({
    //     name: "Code Forces Data Request"
    // });
    // AddLoading();
    let CodeforcesUrl = `https://codeforces.com/api/contest.list?gym=false`;
    fetch(CodeforcesUrl)
        .then(response => response.json())
        .then(data => {
            AppendCodeforces(data);
        })

    fetch('https://www.codechef.com/contests')
        .then(response => response.text())
        .then(data => {
            let el = document.createElement('html');
            el.innerHTML = data;
            let Table = el.getElementsByClassName("dataTable")[1];
            let contestCODE = [], contestNAME = [], headNAME = [], Start = [], End = [];
            for (let i = 0; i < Table.rows[0].cells.length; i++) {
                headNAME.push(Table.rows[0].cells[i].getElementsByTagName('a')[0].innerHTML)
            }
            for (let i = 1; i < Table.rows.length; i++) {
                contestCODE.push(Table.rows[i].cells[0].innerHTML);
                contestNAME.push(Table.rows[i].cells[1].getElementsByTagName('a')[0].innerHTML);
                Start.push(Table.rows[i].cells[2].innerHTML);
                End.push(Table.rows[i].cells[3].innerHTML);
            }
            // console.log('col name: ',headNAME);
            // console.log('Contest code: ',contestCODE);
            // console.log('Contest name: ',contestNAME);
            // console.log('Start: ',Start);
            // console.log('End: ',End);
            console.log(parseCodeChefDate(Start[0]));
            AppendCodeChef(contestCODE, contestNAME, Start, End);
        });

    document.getElementById('github').onclick = () => {
        console.log("Gthub Click");
        let newURL = "https://github.com/Aakash-Kumar-Goryan/Coding_Contest_Reminder_extention";
        chrome.tabs.create({ url: newURL });
    }

    $('.ui.accordion').accordion();
}
let parseCodeChefDate = (date) => {
    /// Format being parsed : "01 Feb 2020 <br> 21:05:00"
    let month = {
        "Jan" : "01",
        "Feb" : "02",
        "Mar" : "03",
        "Apr" : "04"
    }
    let arr = date.split(" ");
    let t = arr[4].split(":");
    let p = new Date(arr[2]+"-"+month[arr[1]]+"-"+arr[0]+"T"+t[0]+":"+t[1]+"Z");
    let DateParsed = new Date(p.getTime() + (p.getTimezoneOffset()*60*1000));   /// correcting according to local time zone
    return DateParsed;
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

let AppendCodeChef = (contestCODE, contestNAME, Start, End) => {
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
    for (let i = 0; i < contestCODE.length; i++) {
            tbodyContent += `<tr>
                                <td data-label="CODE">${contestCODE[i]}</td>
                                <td data-label="NAME">${contestNAME[i]}</td>
                                <td data-label="START">${Start[i]}</td>
                                <td data-label="END">${End[i]}</td>
                            </tr>`
    }
    document.getElementById('CodeChef').getElementsByTagName('tbody')[0].innerHTML = tbodyContent;
}