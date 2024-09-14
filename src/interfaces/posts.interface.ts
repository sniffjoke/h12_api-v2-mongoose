
export interface newestLike {
    addedAt: string
    userId: string
    login: string
}

export interface extendedLikesInfo {
    likesCount: number;
    dislikesCount: number;
    newestLikes: newestLike[]
}

export interface PostInstance {
    _id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
}
