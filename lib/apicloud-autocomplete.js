'use babel';
import provider from "./provider"

export default {
  provide(){
    return provider
  },
  activate(state) {
    console.log("最好用的APICloud语法补全插件,已为您激活!");
  },
  deactivate() {
    // nothing to do.
  },
  serialize() {
    return {
    };
  },
};
