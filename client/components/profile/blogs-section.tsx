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
      <CardContent className="space-y-4">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.id}`}
            className="block p-3 -mx-3 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <h4 className="font-medium text-base mb-1">{blog.title}</h4>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
      </CardContent>
    </Card>
  );
}
