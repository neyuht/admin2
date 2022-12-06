const convertArrayToString = (array) => {
    // "{\"4665cfg\": \"8797\"}"
    const newData = array.map(item => {
        return `\"${item.keys}\": \"${item.description}\"`
    })
    return `{${newData.join(',')}}`
}

export default convertArrayToString