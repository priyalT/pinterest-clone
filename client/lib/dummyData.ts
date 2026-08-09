interface author {
    name: string,
    avatarUrl: string
}

export interface Pin {
    id: string,
    imageUrl: string,
    title: string,
    author: author,
    isSaved: boolean,
    isLiked: boolean,
}

export const dummyPins: Pin[] = [
    {
        id: "1",
        imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&q=80",
        title: "Ocean Sunset",
        author: {
            name: "Jane Doe",
            avatarUrl: "https://i.pravatar.cc/150?u=jane"
        },
        isSaved: false,
        isLiked: true,
    },
    {
        id: "2",
        imageUrl: "https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=500&q=80",
        title: "Minimalist Setup",
        author: {
            name: "Alex Smith",
            avatarUrl: "https://i.pravatar.cc/150?u=alex"
        },
        isSaved: true,
        isLiked: false,
    },
    {
        id: "3",
        imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&q=80",
        title: "Mountain Hike",
        author: {
            name: "Sarah Jones",
            avatarUrl: "https://i.pravatar.cc/150?u=sarah"
        },
        isSaved: false,
        isLiked: false,
    },
    {
        id: "4",
        imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&q=80",
        title: "Coding in the Dark",
        author: {
            name: "Dev Dude",
            avatarUrl: "https://i.pravatar.cc/150?u=dev"
        },
        isSaved: true,
        isLiked: true,
    },
    {
        id: "5",
        imageUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500&q=80",
        title: "Aesthetic Coffee",
        author: {
            name: "Coffee Lover",
            avatarUrl: "https://i.pravatar.cc/150?u=coffee"
        },
        isSaved: false,
        isLiked: false,
    },
    {
        id: "6",
        imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80",
        title: "Modern Architecture",
        author: {
            name: "Design Hub",
            avatarUrl: "https://i.pravatar.cc/150?u=design"
        },
        isSaved: false,
        isLiked: true,
    },
    {
        id: "7",
        imageUrl: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=500&q=80",
        title: "Pink Banana",
        author: {
            name: "Artistic Mind",
            avatarUrl: "https://i.pravatar.cc/150?u=art"
        },
        isSaved: true,
        isLiked: true,
    },
    {
        id: "8",
        imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=500&q=80",
        title: "Home Office Setup",
        author: {
            name: "Workaholic",
            avatarUrl: "https://i.pravatar.cc/150?u=work"
        },
        isSaved: false,
        isLiked: false,
    },
    {
        id: "9",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80",
        title: "Fashion Inspiration",
        author: {
            name: "Style Icon",
            avatarUrl: "https://i.pravatar.cc/150?u=style"
        },
        isSaved: true,
        isLiked: false,
    },
    {
        id: "10",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&q=80",
        title: "Web Development",
        author: {
            name: "Tech Geek",
            avatarUrl: "https://i.pravatar.cc/150?u=tech"
        },
        isSaved: false,
        isLiked: true,
    }
]
