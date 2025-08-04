// Stopwatch Functionality
let stopwatch = {
    isRunning: false,
    startTime: 0,
    elapsedTime: 0,
    interval: null,

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now() - this.elapsedTime;
            this.interval = setInterval(() => this.update(), 10);
        }
    },

    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            this.elapsedTime = Date.now() - this.startTime;
            clearInterval(this.interval);
        }
    },

    reset() {
        this.stop();
        this.elapsedTime = 0;
        this.updateDisplay();
    },

    update() {
        this.elapsedTime = Date.now() - this.startTime;
        this.updateDisplay();
    },

    updateDisplay() {
        const time = new Date(this.elapsedTime);
        const hours = time.getUTCHours().toString().padStart(2, '0');
        const minutes = time.getUTCMinutes().toString().padStart(2, '0');
        const seconds = time.getUTCSeconds().toString().padStart(2, '0');
        const milliseconds = Math.floor(time.getUTCMilliseconds() / 10).toString().padStart(2, '0');
        document.getElementById('stopwatch-display').textContent = 
            `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
};
// Attach event listeners
document.getElementById('start-stopwatch').addEventListener('click', () => stopwatch.start());
document.getElementById('stop-stopwatch').addEventListener('click', () => stopwatch.stop());
document.getElementById('reset-stopwatch').addEventListener('click', () => stopwatch.reset());

// Timer Functionality
let timer = {
    isRunning: false,
    timeLeft: 0,
    interval: null,
    alarmSound: new Audio("./sound.mp3"), // Ensure the file is in the same folder

    set() {
        const hours = parseInt(document.getElementById('hours').value) || 0;
        const minutes = parseInt(document.getElementById('minutes').value) || 0;
        const seconds = parseInt(document.getElementById('seconds').value) || 0;
        this.timeLeft = (hours * 3600) + (minutes * 60) + seconds;
        this.updateDisplay();
    },

    start() {
        if (!this.isRunning && this.timeLeft > 0) {
            this.isRunning = true;
            this.interval = setInterval(() => this.tick(), 1000);
        }
    },

    tick() {
        if (this.timeLeft <= 0) {
            this.playAlarm();
            this.reset();
            return;
        }
        this.timeLeft--;
        this.updateDisplay();
    },

    playAlarm() {
        this.alarmSound.loop = true; // 🔄 Keeps playing the sound in a loop
        this.alarmSound.currentTime = 0; // Reset audio to start
        let playPromise = this.alarmSound.play();
    
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Audio play failed due to browser restrictions:", error);
                alert("Timer is up!");
                this.alarmSound.play(); // Try playing again after user interaction
            });
        }
    },
    

    reset() {
        this.isRunning = false;
        clearInterval(this.interval);
        this.timeLeft = 0;

        this.alarmSound.loop = false; // Stop looping
        this.alarmSound.pause();
        this.alarmSound.currentTime = 0;
        
        // Clear input fields
        document.getElementById('hours').value = '';
        document.getElementById('minutes').value = '';
        document.getElementById('seconds').value = '';
        this.updateDisplay();
    },

    updateDisplay() {
        const hours = Math.floor(this.timeLeft / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((this.timeLeft % 3600) / 60).toString().padStart(2, '0');
        const seconds = (this.timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('timer-display').textContent = `${hours}:${minutes}:${seconds}`;
    }
};

// Event Listeners
document.getElementById('set-timer').addEventListener('click', () => timer.set());
document.getElementById('start-timer').addEventListener('click', () => timer.start());
document.getElementById('reset-timer').addEventListener('click', () => timer.reset());
