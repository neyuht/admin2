const convertArrayToString = (array) => {
    // "{\"4665cfg\": \"8797\"}"
    const newData = array.map(item => {
        return `\"${item.key}\": \"${item.value}\"`
    })
    return `{${newData.join(',')}}`
}

export default convertArrayToString