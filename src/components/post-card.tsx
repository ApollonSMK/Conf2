
'use client';

import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MessageSquare, ThumbsUp, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';

interface Post {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    title: string;
    content: string;
    tags?: string[];
    createdAt: string;
    likes?: number;
    comments?: number;
}

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const timeAgo = post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: pt }) : '';

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <Avatar>
                    <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                    <AvatarFallback>{post.authorName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-foreground">{post.authorName}</p>
                    <p className="text-sm text-muted-foreground">{timeAgo}</p>
                </div>
                 <Button variant="ghost" size="icon" className="ml-auto">
                    <MoreHorizontal />
                </Button>
            </CardHeader>
            <CardContent>
                <CardTitle className="text-xl mb-2 text-primary">{post.title}</CardTitle>
                <p className="text-foreground/90 whitespace-pre-wrap">{post.content}</p>
                 {post.tags && post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
                 <Button variant="ghost">
                    <ThumbsUp className="mr-2"/>
                    Gosto ({post.likes || 0})
                </Button>
                <Button variant="ghost">
                     <MessageSquare className="mr-2"/>
                    Comentar ({post.comments || 0})
                </Button>
            </CardFooter>
        </Card>
    );
}
