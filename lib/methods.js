'use babel';
import Immutable from "immutable"
import { normalize, Schema, arrayOf } from 'normalizr'

import methods_response from "./methods_response"
const method = new Schema("methods")

let state = methods_response.reduce((state,methodDict)=>{
  let keys = Object.keys(methodDict)
  if( ! keys.length) return state

  let moduleName = keys[0]
  let methods = methodDict[moduleName]
  methods = methods.filter(({href,text})=>{
                    return href !== "#method-content" && href !== "#const-content"
                          && href !== "#event-content" && text && /^[\w]+$/.test(text)
                  })
                  .map(({href,text,title})=>{
                    let snippet = undefined
                    if(moduleName === "api" && text === "require"){
                      snippet = `require("\${1:moduleName}");`
                    }
                    return {
                      href: href,
                      module:moduleName,
                      name: text,
                      id: `${moduleName}.${text}`,
                      desc:title,
                      snippet:snippet,
                      platform: 2, // 0,iOS; 1,Android,2,全平台.
                    }
                  })
  let normalizeRes = normalize(methods, arrayOf(method));

  return state.mergeDeep(normalizeRes.entities)
},Immutable.fromJS({methods:{}}))

export default state.get(`methods`)
