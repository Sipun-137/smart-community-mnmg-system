

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetAllNotice } from "@/services/NoticeService";
import { formatDistanceToNow } from "date-fns";

export default function NoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await GetAllNotice();
        if (res.success) {
          setNotices(res.data);
        } else {
          setNotices([]);
        }
      } catch (error) {
        console.error("Error fetching notices:", error);
        setNotices([]);
      } finally {
        setLoading(false);
      }
    }

    fetchNotices();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Notices</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading notices...</p>
      ) : notices.length === 0 ? (
        <p className="text-muted-foreground">
          No notices available at this time.
        </p>
      ) : (
        <div className="grid gap-6">
          {notices.map((notice: any) => (
            <Card key={notice._id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{notice.title}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(notice.date), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{notice.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
