//const {data, status} = useAuth();
//const user = data.value?.user?.name;


export const openLoginPage = ()  => {
    navigateTo("/login")
}

export const openProfile = () => {
    let url = "/profile/[id]" //+ user
    navigateTo(url)
}

export const openHome = () => {
    navigateTo("/")
}

