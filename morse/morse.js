$("#play").click(function() {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var ctx = new AudioContext();
    var dot = 1.2 / 15;

    var splits = getoption();

    var t = ctx.currentTime;

    var oscillator = ctx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = 600;

    var gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, t);

    $('#result').val().split("").forEach(function(letter) {
        switch (letter) {
        case splits.short:
            gainNode.gain.setValueAtTime(1, t);
            t += dot;
            gainNode.gain.setValueAtTime(0, t);
            t += dot;
            break;
        case splits.long:
            gainNode.gain.setValueAtTime(1, t);
            t += 3 * dot;
            gainNode.gain.setValueAtTime(0, t);
            t += dot;
            break;
        case splits.space:
            t += 7 * dot;
            break;
        }
    });

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start();

    return false;
});

