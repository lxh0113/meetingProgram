import http from "@/utils/http";

export const fileUploadAPI=(data:FormData)=>{
    return http({
        url:"/oss/avatar",
        method:"POST",
        data
    })
}