const term = new Terminal();
    term.open(document.getElementById('terminal'));

    const basuerl = "";
    
    term.onData(data => {
        fetch("/terminal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: data })
        })
        .then(r => r.text())
        .then(output => term.write(output));
    });