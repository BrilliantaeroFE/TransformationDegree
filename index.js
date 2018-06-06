function latLngDecimalToDegrees (decimal) {
    let absDecimal = Math.abs(decimal)
    let isNegative = Math.abs(decimal) !== decimal
    let d = Math.floor(absDecimal) // 度
    let m = Math.floor((absDecimal - d) * 60) // 分
    let s = Math.round((absDecimal - d) * 3600 % 60) // 秒
    if (s === 60) { s = 0; m++ }
    if (m === 60) { m = 0; d++ }
    //d = ('000'+d).slice(-3);                   // left-pad with leading zeros
    m = ('00' + m).slice(-2)                    // left-pad with leading zeros
    s = ('00' + s).slice(-2)
    //if (s<10) s = '0' + s;                     // left-pad with leading zeros (note may include decimals)
    return (isNegative ? '-' : '') + d + '°' + m + '′' + s + '″'
}

/*
    Decimal Degrees = Degrees + minutes/60 + seconds/3600
    例：57°55'56.6" =57+55/60+56.6/3600=57.9323888888888
    return Float or NaN
*/
function latLngDegreesToDecimal (degreesStr) {
    let degreesArr = degreesStr.split('°')
    let degrees = degreesArr[0]
    let isNegative = Math.abs(degrees) !== degrees
    if (degreesArr.length === 1) {
        return parseInt(degrees)
    }

    let minutesArr = degreesArr[1].split('′')
    let minutes = minutesArr[0]
    if (minutesArr.length === 1) {
        return parseFloat((isNegative ? '-' : '') + (Math.abs(degrees) + Math.abs(minutes) / 60))
    }

    let secondsStr = minutesArr[1]
    let secondsArr = secondsStr.split('″')
    let seconds = secondsArr[0]

    return parseFloat((isNegative ? '-' : '') + (Math.abs(degrees) + Math.abs(minutes) / 60 + Math.abs(seconds) / 3600))
}

function convertToDegree(originStr) {
    let degreeStr = ''
    let length = originStr.length

    // 去除小数点
    let originStrWithoutPoint = originStr
    let originStrWithoutPoints = originStrWithoutPoint.replace(/[^\d.]/g, '')
    for (let i = length - 1; i >= 0; i--) {
        if (originStr[i] === '.') {
            degreeStr = originStr.slice(i, length) + degreeStr
            originStrWithoutPoints = originStr.slice(0, i)
            break
        }
    }

    length = originStrWithoutPoints.length
    let counter = 0
    for (let i = length - 1; i >= 0; i--) {
        counter++
        degreeStr = originStrWithoutPoints[i] + degreeStr
        if (counter === 2 && length > counter) {
            degreeStr = '′' + degreeStr
        } else if (counter === 4 && length > counter) {
            degreeStr = '°' + degreeStr
        }
    }

    return degreeStr
}

function splitDegree (degreesStr) {
    let degreesArr = degreesStr.split('°')
    let degrees = degreesArr[0]
    if (degreesArr.length === 1) {
        return {
            deg: parseInt(degrees),
            min: 0,
            sec: 0
        }
    }

    let minutesArr = degreesArr[1].split('′')
    let minutes = minutesArr[0]
    if (minutesArr.length === 1) {
        return {
            deg: parseInt(degrees),
            min: parseInt(minutes),
            sec: 0
        }
    }

    let secondsStr = minutesArr[1]
    let secondsArr = secondsStr.split('″')
    let seconds = secondsArr[0]

    return {
        deg: parseInt(degrees),
        min: parseInt(minutes),
        sec: parseInt(seconds)
    }
}

function checkLng(lngStr) {
    let lng = splitDegree(lngStr)

    if (isNaN(lng.deg)) {
        return false
    }

    if (lng.deg > 180 || lng.deg < -180) {
        return false
    }

    if (lng.min < 0 || lng.min > 60 || lng.sec < 0 || lng.sec > 60) {
        return false
    }
    return true
}

function checkLat(latStr) {
    let lat = splitDegree(latStr)

    if (isNaN(lat.deg)) {
        return false
    }

    if (lat.deg > 90 && lat.deg < -90) {
        return false
    }

    if (lat.min < 0 || lat.min > 60 || lat.sec < 0 || lat.sec > 60) {
        return false
    }
    return true
}

module.exports = {
    latLngDecimalToDegrees,
    latLngDegreesToDecimal,
    convertToDegree,
    checkLng,
    checkLat
}
