export interface FospObject {
    owner: string,
    created: string,
    updated: string,
    acl?: any,
    subscriptions?: any,
    type?: string,
    data?: any,
    attachment?: Attachment
}

interface Attachment {
    name?: string,
    type?: string,
    size: number
}
