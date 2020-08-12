"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVICE_BEGINNING = exports.HTTP_REQUEST = void 0;
const REQUEST_PARAMS = "url:string,queryParams:any|undefined,requestBody:any|undefined,configOverride?:AxiosRequestConfig";
const REQUEST_RESPONSE = "Promise<AxiosResponse<any>>";
const HTTP_REQUEST = `
import { AxiosRequestConfig, AxiosResponse } from "axios";
  
const Http={
    getRequest(${REQUEST_PARAMS}):${REQUEST_RESPONSE}{

    },
    postRequest(${REQUEST_PARAMS}):${REQUEST_RESPONSE}{
        
    },
    putRequest(${REQUEST_PARAMS}):${REQUEST_RESPONSE}{
        
    },
    deleteRequest(${REQUEST_PARAMS}):${REQUEST_RESPONSE}{
        
    },
}

export {Http}
`;
exports.HTTP_REQUEST = HTTP_REQUEST;
const SERVICE_BEGINNING = `
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { Http } from "./httpRequest";

function template(path: string, obj: { [x: string]: any } = {}) {
    Object.keys(obj).forEach((key) => {
      let re = new RegExp(\`{\${key}}\`, "i");
      path = path.replace(re, obj[key]);
    });
  
    return path;
}
`;
exports.SERVICE_BEGINNING = SERVICE_BEGINNING;
//# sourceMappingURL=strings.js.map