const getMode = (datas: any[], key_name: string) => {
    // valueの数を数える
    // 例 {20: 1, 13: 4}
    if(!datas.length) return null
    const value_counts: {[key: string | number]: number} = {}
    for(let i=0; i < datas.length; i++){
        if(!datas[i][key_name]){
            console.log('key-error:' + key_name)
            return null
        }
        const value = datas[i][key_name]
        if(!value_counts[value]){
            value_counts[value] = 0
        }
        //count up
        value_counts[value] += 1
    }
    let mode_value: string | number = ''
    let mode_count = 0
    for(const [v,c] of Object.entries(value_counts)){
        // countが現在のmode_countよりも大きければ更新
        if(c > mode_count){
            mode_value = v
            mode_count = c
        }
    }
    return mode_value
}

export default getMode