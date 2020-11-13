/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url: string) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj: any = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/*
  手机验证
  1. 中国电信号段 133、149、153、173、177、180、181、189、199
  2. 中国联通号段 130、131、132、145、155、156、166、175、176、185、186
  3. 中国移动号段 134(0-8)、135、136、137、138、139、147、150、151、152、157、158、159、178、182、183、184、187、188、198
 */
export function isvalidPhone(str: string) {
  const re = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
  return re.test(str)
}
