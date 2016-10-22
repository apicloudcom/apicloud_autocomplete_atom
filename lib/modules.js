'use babel';
import Immutable from "immutable"
import { normalize, Schema, arrayOf } from 'normalizr'
import  modules_response from "./modules_response.json"

const module = new Schema("modules",{idAttribute:'name'})

let modules = modules_response.body.map(({mdName,mdPlatform,mdInfo,mdType})=>{
  let baseUrl = "http://docs.apicloud.com/Client-API"
  let url = baseUrl

  let typeName = {
    "2": "Device-Access",
    "5": "Func-Ext",
    "3": "UI-Layout",
    "4": "Nav-Menu",
    "8": "Open-SDK",
    "9": "Cloud-Service",
  }[""+mdType]

  if(typeName){
    url = `${baseUrl}/${typeName}/${mdName}`
  }

  if("api" === mdName){
    url = "http://docs.apicloud.com/Client-API/api"
  }

  if("$api" === mdName){
    url = "http://docs.apicloud.com/Front-end-Framework/framework-dev-guide"
  }

  return {
  "name":mdName,
  "platform": mdPlatform,
  "url": url,
  "desc":mdInfo
}})

let normalizeRes = normalize(modules, arrayOf(module));
modules = normalizeRes.entities.modules

export default Immutable.fromJS(
  normalizeRes.entities.modules
)
