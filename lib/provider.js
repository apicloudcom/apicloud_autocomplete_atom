'use babel';
import {Point,Range} from 'atom'

import Immutable from "immutable"
import modules from "./modules"
import methods from "./methods"
import snippets from "./snippets"

const SCOPE_META_ARGUMENTS_JS = "meta.arguments.js"
const SCOPE_META_METHOD_CALL_JS = "meta.method-call.js"
const SCOPE_KEYWORD_OPERATOR_ASSIGNMENT_JS = "keyword.operator.assignment.js"
const SCOPE_META_DELIMITER_METHOD_PERIOD_JS = "meta.delimiter.method.period.js"
const SCOPE_VARIABLE_OTHER_PROPERTY_JS = "variable.other.property.js"

const ICON_HTML_ANDROID = `<span style="font-size:11px">安卓<span>`
const ICON_HTML_IOS = `<span style="font-size:11px">iOS<span>`

const provider =
{
 selector: '.source.js',
 inclusionPriority: 42,
 excludeLowerPriority: false,
 disableForSelector: '.comment',
 getSuggestions: ({editor, bufferPosition, scopeDescriptor, prefix, activatedManually})=>{
   let scopeTextDict = scopeDescriptor.scopes.reduce((dict,scope)=>{
     let range = editor.bufferRangeForScopeAtCursor(scope)
     if (range) {
       let scopeText = editor.getTextInBufferRange(range)
       dict[scope] = scopeText
     }
     return dict
   },{})
   const curLineRange = new Range([bufferPosition.row,0], [bufferPosition.row,bufferPosition.column])
   const curLineText = editor.getTextInBufferRange(curLineRange)
   let cleanPrefix = prefix.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
   let prefixRequireReg = new RegExp(`[^\\w]*api\\.require\\([\`|\"|\']${cleanPrefix}\$`)

   if (/\w+/.test(prefix) && prefixRequireReg.test(curLineText)) {
       let likeModuleName = prefix
       let suggestions = modules
                         .filter((v,k)=>
                           {
                               let regStr = likeModuleName.split("")
                                               .reduce((regStr,item)=>{
                                                 regStr = `${regStr}\\w*${item}`
                                                 return regStr
                                               },"\\w*") + "\\w*"
                               let reg = new RegExp(regStr, "i")
                               return k !== "api" && k !== "$api" && reg.test(k)
                            })
                         .map((item)=>{
                           let {name,desc,url,platform} = item.toJS()
                           let iconHTML = undefined
                           if (0 === platform) {
                             iconHTML = ICON_HTML_IOS
                           }
                           if (1 === platform) {
                             iconHTML = ICON_HTML_ANDROID
                           }
                           return Immutable.fromJS({
                             snippet: name,
                             type:"require",
                             description:desc,
                             descriptionMoreURL:url,
                             iconHTML: iconHTML,
                           })
                         }).valueSeq()
       return suggestions.toJS()
   }

   prefixRequireReg = new RegExp(`\([^ ]+\)\\.\(${prefix==="."?"":cleanPrefix}\)\$`)

   if (prefixRequireReg.test(curLineText)) { // obj and method
     let findModuleInfo = new Promise((resolve)=>{
       let reg = prefixRequireReg

       editor.backwardsScanInBufferRange(reg,curLineRange,
               ({match, matchText, range, stop, replace})=>{
             stop()
             resolve(Immutable.fromJS({moduleName:match[1],methodName:match[2]}))
         })
     })

     let findRealModuleName = (state) => (new Promise((resolve)=>{
       const moduleName = state.get(`moduleName`)
       if("api" === moduleName || "$api" === moduleName){
         resolve(state)
       }
       let regStr = ` *${moduleName} *= *api\\.require\\(['|"](\\w+)['|"]\\)`
       let reg = new RegExp(regStr)
       editor.backwardsScanInBufferRange(reg,
         [(0,0), bufferPosition],
         ({match, matchText, range, stop, replace})=>{
           stop()
           resolve(state.set(`moduleName`, match[1]))
         }
       )
     }))

     let makeSuggestions = (state)=>(new Promise((resolve)=>{
       let likeMethodName = state.get(`methodName`)
       let moduleObj = state.get(`moduleName`)
       let baseUrl = modules.getIn([moduleObj,`url`])

       let suggestions = methods
                         .filter((v,k)=>
                           {
                               let cleanModuleObj = moduleObj.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
                               let regStr = likeMethodName.split("")
                                               .reduce((regStr,item)=>{
                                                 regStr = `${regStr}\\w*${item}`
                                                 return regStr
                                               },`^${cleanModuleObj}.`) + "\\w*"

                               let reg = new RegExp(regStr, "i")
                               return reg.test(k)
                            })
                         .map((item)=>{
                           let {name,desc,platform,snippet,href} = item.toJS()
                           let iconHTML = undefined
                           if (0 === platform) {
                             iconHTML = ICON_HTML_IOS
                           }
                           if (1 === platform) {
                             iconHTML = ICON_HTML_ANDROID
                           }

                           if( ! snippet){
                             let baseSnippet = snippets.getIn([`${moduleObj}.${name}`,`snippet`])
                             snippet = baseSnippet ?`${name}${baseSnippet}`:`${name}`
                           }

                           return Immutable.fromJS({
                             snippet: snippet,
                             displayText:name,
                             type:"snippet",
                             description:desc ? desc: name,
                             descriptionMoreURL:`${baseUrl}${href}`,
                             iconHTML: iconHTML,
                           })
                         }).valueSeq()
       resolve(suggestions.toJS())
     }))

     return findModuleInfo
     .then(findRealModuleName)
     .then(makeSuggestions)
   }

   if (scopeTextDict[SCOPE_KEYWORD_OPERATOR_ASSIGNMENT_JS]) { // must not change api's value.
       return new Promise((resolve, reject)=>{
         let scopes = scopeDescriptor.scopes

         editor.backwardsScanInBufferRange(/[\$]?\w+/,curLineRange,
                 ({match, matchText, range, stop, replace})=>{
               stop()

               if (matchText === "api" || matchText === "$api") {
                 atom.notifications.addError("请不要给 api 或 $api 重新赋值!")
                 editor.backspace()
                 resolve([])
               }
           })
       })
   }

   // default nothing
   return []
 }
}

export default provider
