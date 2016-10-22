'use babel';
import snippets_response from "./snippets_response"
import Immutable from "immutable"
import { normalize, Schema, arrayOf} from 'normalizr'

const snippet = new Schema("snippets")

let state = snippets_response.reduce((state,infoDict)=>{
  let keys = Object.keys(infoDict)
  if( ! keys.length) return state

  let moduleName = keys[0]
  let items = infoDict[moduleName]
  items = items.map(({text})=>{
                    let snippet = text.replace(/(&(\w|#)*;)/g,
                                      (match, p1, offset, string)=>({
                                                        "&#39;": "\'",
                                                        "&gt;": "\>",
                                                        "&#34;": "\"",
                                                        "&lt;": "\<",
                                                        "&amp;": "\&"
                                                      }[match]))
                    let methodName = null

                    let clean_snippet = snippet.replace(/^.*(\w+) *= *api\.require\(.*\)(.|\n)*[ |\n\t]+\1\.(\w+)/,
                                      (match,p1,p2,p3,offset,text)=>{

                                        methodName = p3
                                        return ""
                                      })
                    if("$api" === moduleName || "api" === moduleName){
                      clean_snippet = snippet.replace(/^.* *[\$]?api\.(\w+)/,
                                        (match,p1,offset,text)=>{

                                          methodName = p1
                                          return ""
                                        })
                    }

                    if( ! methodName){
                      return null
                    }

                    return {
                      id: `${moduleName}.${methodName}`,
                      snippet:clean_snippet,
                    }
                  })
  let normalizeRes = normalize(items, arrayOf(snippet));
  return state.mergeDeep(normalizeRes.entities)
},Immutable.fromJS({snippets:{}}))

export default state.get(`snippets`)
