export default interface Friend {
    friend?: {
        email?: string
        id?: string
        name?: string
        picture?: string
        status?: boolean
        _id?: string
        groupCreatedAt?: string
    }
    messages?: Array<any>
    members?: Array<string>
}
