import { BlogPost } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

interface Props {
  blogs: BlogPost[];
}

export function BlogsSection({ blogs }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Blogs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-4 overflow-x-auto pb-2">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.id}`}
              className="shrink-0 w-56 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors flex flex-col justify-between"
            >
              <h4 className="font-medium text-sm leading-snug line-clamp-2">
                {blog.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(blog.created_at).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {blog.likes_count}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {blog.comments_count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
