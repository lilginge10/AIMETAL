const FakeYou = require('fakeyou.js');
const fs = require('fs');
const https = require('https');
// Pre reqs (file paths)
const filepath = String.raw `responses.txt`;
let comms = String.raw `comms2.txt`;
const results = [];
const chars = ["MGS2 Solid Snake (David Hayter)", "Raiden (Quinton Flynn)", "MGS1 Otacon (Christopher Randolph)", "Senator Armstrong (Version 2.0)", "Arnold Schwarzenegger (Movies, Version 2.0)"];
//functions
let done = 0;
var download = function(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    https.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);
        });
        console.log('')
    });
}


function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function loadfy() {
    let done = 1;
    const fy = new FakeYou.Client({
        token: 'eyJhbGciOiJIUzI1NiJ9.eyJjb29raWVfdmVyc2lvbiI6IjIiLCJzZXNzaW9uX3Rva2VuIjoiU0VTU0lPTjo0ZjFqcXE2d2ZncmptNHJ4ZTVtbjUxZGYiLCJ1c2VyX3Rva2VuIjoiVTpXUEJOMlcyN1lWOUdKIn0.NuJRXmuUup6OYywL44dO-uufUjQzRcTEFwzWcQsLRmw'
    });
    await fy.start(); //required


    fs.writeFile(comms, "process", async(err2, data2) => { console.log('loading...') });
    fs.readFile(filepath, 'utf8', async(err, data) => {
        const d = data.split("~");
        let len = d.length;
        let time = 2000;
        let errm = "ok";
        let count = 0;
        let overall = 0;
        for (let i = 0; i < len; i++) {
            try {
                await delay(time);
                if (errm == "redo") {
                    i--;
                    errm = "ok";
                }
                if (count > 2) {
                    timeb = time - 4500;
                    time = timeb;
                }
                if (time < 2000) { time = 4000; }
                console.log(String(i) + "/" + String(len));
                let models = fy.searchModel(chars[d[i].charAt(0)]);
                console.log(d[i].slice(2))
                let result = await fy.makeTTS(models.first(), d[i].slice(2));
                let done = result.audioURL();
                results.push(done)
                    // replace with the full "generations" folder path from unity source
                const filePath = String.raw `Assets/Resources/generations/${i}.wav`;
                download(done, filePath);


                console.log('result: ' + done)
                timeb = overall + time;
                overall = timeb;
            } catch (err) {
                let errstring = err.toString();
                if (errstring.indexOf("TypeError:") !== -1) {
                    console.log("Fatal error... Correcting...");
                    i++;
                    timeb = time + 4500;
                    console.log("Waiting " + time / 1000 + " seconds, to prevent rate limit.");
                    time = timeb;
                    errm = "redo";
                    count++;
                } else {
                    console.log("rate limited...")
                    timeb = time + 4500;
                    console.log("Waiting " + time / 1000 + " seconds, to prevent rate limit.");
                    time = timeb;
                    errm = "redo";
                    count++;
                }










            }
        }
        let quickmath1 = overall / 1000;
        let quickmath2 = Math.round(quickmath1 / 60);
        console.log(results.length + " lines generated. Time taken: " + quickmath2 + " minutes.");
        console.log(results);
        let done = 1;
        if (done === 1) {
            fs.writeFile(comms, "done", async(err2, data2) => { console.log('process finished... Awaiting new task.') });
        }
    });

}


// runs the program:
setInterval(() => {
    fs.readFile(comms, 'utf8', async(err2, data2) => {
        if (data2 === "make" || data2 === "make \n") {
            await loadfy();
        } else {
            if (data2 === "done" || data2 === "done\n") {
                console.log('waiting...')
            }
        }
    });
}, 6000);