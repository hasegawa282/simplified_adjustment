export const convertDict = (name: string, dict: {[key: string]: string}) => {
    let return_name = ''
    for(const [k,v] of Object.entries(dict)){
        if(k === name){
            return_name = v
            break
        }
    }
    return return_name
}