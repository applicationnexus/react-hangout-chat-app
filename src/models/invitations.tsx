export default interface Invitations {
    from?: {
        email?: string
        familyName?: string
        friends?: []
        givenName?: string
        name?: string
        online?: boolean
        picture?: string
        user_id?: number
        _id?: string
    }
    status?: string
    to?: string
    _id?: string
}
