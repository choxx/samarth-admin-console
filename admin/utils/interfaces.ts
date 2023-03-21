export interface USER_SCOPES {
    disrtrict: string,
    block: string,
    any: string,
    admin: string,
    school: string,
    state: string
}



export interface APPLICATIONS {
    e_samwaad_user: {
        id: string,
        name: string
    },
    shiksha_saathi_user: {
        id: string,
        name: string
    },
};