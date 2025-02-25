import http from "@/utils/http";

export const getAllAPI=()=>{
    return http({
        url:"/home",
        method:"GET"
    })
}