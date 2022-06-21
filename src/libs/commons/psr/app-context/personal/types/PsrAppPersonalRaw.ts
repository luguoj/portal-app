export interface PsrAppPersonalRaw {
    fullName: string,
    avatar: PsrAppPersonalAvatar,
}

export type PsrAppPersonalAvatar = PsrAppPersonalIconAvatar | PsrAppPersonalImgAvatar

export interface PsrAppPersonalIconAvatar {
    iconCls: string
}

export interface PsrAppPersonalImgAvatar {
    imgUri: string
}