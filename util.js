
// I want to consistently convert input text to value that can be used as an id name
function namify(text) {
    // I'm not super rigorous about this, it just has to be good enough
    if (typeof text === "number") {
        text = text.toString();
    }

    if (text.length === 0) {
        throw new Error("Empty string");
    }

    if (Number(text[0]) == NaN) {
        text = "i" + text
    }

    return text;
    
}


export {namify};
