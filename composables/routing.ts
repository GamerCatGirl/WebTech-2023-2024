//const {data, status} = useAuth();
//const user = data.value?.user?.name;


export const openLoginPage = ()  => {
    navigateTo("/login")
}

export const openProfile = () => {
    let url = "/profile" //+ user
    navigateTo(url)
}

export const openMap = () => {
    navigateTo('/map')
}

export const openRecepies = () => {
    navigateTo('/recipies')
}

export const openHome = () => {
    navigateTo('/home')
    //console.log(data)
    //console.log(data.value)
}