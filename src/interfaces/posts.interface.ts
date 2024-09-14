
export interface NewestLike {
    addedAt: string
    userId: string
    login: string
}

export interface ExtendedLikesInfo {
    likesCount: number;
    dislikesCount: number;
    newestLikes: NewestLike[]
}

export interface PostInstance {
    _id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    extendedLikesInfo: ExtendedLikesInfo;
}
