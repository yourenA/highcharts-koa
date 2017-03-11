/**
 * Created by daijiaru on 2017/3/11.
 */
exports.rotateArr =(arr)=>{
    let newArr = [];
    for (let i = 0; i <= arr[0].length - 1; i++) {
        let temArr = [];
        for (let j = 0; j <=arr.length - 1 ;j++) {
            temArr.push(arr[j][i]);
        }
        newArr.push(temArr)
    }
    return newArr
}