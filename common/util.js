export const showUToast = (that, type , message) => {
     
    let params = {
        type: 'default',
        message: "无",
        iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/default.png'
    }
     
    switch(type){
        case "success":
            params.type = type
            params.iconUrl = 'https://cdn.uviewui.com/uview/demo/toast/success.png'
            params.message = message
        break
        case "error":
            params.type = type
            params.iconUrl = 'https://cdn.uviewui.com/uview/demo/toast/error.png'
            params.message = message
        break
        case "loading":
            params.type = type
            params.iconUrl = 'https://cdn.uviewui.com/uview/demo/toast/loading.png'
            params.message = message
        break
        default:
            params.message = message
    }
     
    that.show({
        ...params
    })
}
