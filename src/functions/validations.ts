export const validatePostString = (str: string) => {
    let flag = false
    if(str.length > 0){
        flag = true
    }
    return flag
}

export const validatePostNumber = (num: number) => {
    let flag = false
    if(num > 0){
        flag = true
    }
    return flag
}

export const isEmptyObject = (obj: {[key: string]: any}) => {
    return !Object.keys(obj).length;
}