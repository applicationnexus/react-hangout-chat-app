export default interface User {
    _id?: string
    email?: string
    name?: string
    picture?: string
    user_id?: number
    givenName?: string
    familyName?: string
    friends?: Array<any>
}
