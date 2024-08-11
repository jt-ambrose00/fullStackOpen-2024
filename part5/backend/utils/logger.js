const info = (...params) => {
    if (process.env.NODE_ENV !== 'test' || process.env.NODE_ENV !== 'e2e') {
        console.log(...params)
    }
}

const error = (...params) => {
    if (process.env.NODE_ENV !== 'test' || process.env.NODE_ENV !== 'e2e') {
        console.error(...params)
    }
}

module.exports = {
    info,
    error
}
