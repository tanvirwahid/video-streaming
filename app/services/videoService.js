const getStartAndEnd = (range, fileSize) => {
    let parts = range.replace(/bytes=/, '').split('-');
    let start = parseInt(parts[0], 10);
    let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    return {
        start,
        end
    };
}

module.exports = {
    getStartAndEnd
}