const convertStringToNumber = (str: string) => {
    if(!str || str === '0') return 0
    return Number(str) + 0
}

export default convertStringToNumber