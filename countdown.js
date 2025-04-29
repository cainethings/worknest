// countdown.js
const countdown = (seconds) => {
    let remaining = seconds;

    const interval = setInterval(() => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`Waiting for webhook... ${remaining}s remaining`);

        remaining -= 1;
        if (remaining < 0) {
            clearInterval(interval);
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            console.log("Webhook execution complete!");
        }
    }, 1000);
};

countdown(15); // Adjust the seconds as per your webhook execution time
